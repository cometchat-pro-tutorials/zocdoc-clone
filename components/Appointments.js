import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

import AppointmentItem from './AppointmentItem';

import Context from '../context';

import { database, databaseRef, databaseQuery, orderByChild, equalTo, databaseOnValue, databaseOff } from "../firebase";

const Appointments = (props) => {
  const { navigation } = props;

  const [appointments, setAppointments] = useState([]);

  const { user } = useContext(Context);

  useEffect(() => {
    if (user) {
      getAppointments(user);
    }
    return () => {
      const appointmentsRef = databaseRef(database, 'appointments');
      databaseOff(appointmentsRef);
    }
  }, [user]);

  const getAppointments = (user) => {
    if (!user) {
      return;
    }
    const orderByChildCriteria = user.role === 'Doctor' ? 'doctorId' : 'patientId';
    const appointmentsRef = databaseQuery(databaseRef(database, 'appointments'), orderByChild(orderByChildCriteria), equalTo(user.id));
    databaseOnValue(appointmentsRef, async (snapshot) => {
      const values = snapshot.val();
      if (values) {
        const keys = Object.keys(values);
        const appointments = keys.map(key => values[key]);
        if (appointments && appointments.length) {
          const transformedAppointments = transformAppointments(appointments);
          setAppointments(() => transformedAppointments);
        }
      }
    });
  }

  const transformAppointments = (appointments) => {
    if (!appointments || !appointments.length) {
      return;
    }
    const isPatient = user.role === 'Patient';
    const transformedAppointments = [];
    for (const appointment of appointments) {
      transformedAppointments.push({ appointmentId: appointment.id, id: isPatient ? appointment.doctorId : appointment.patientId, fullname: isPatient ? appointment.doctorName : appointment.patientName, avatar: isPatient ? appointment.doctorImage : appointment.patientImage, bio: isPatient ? appointment.doctorBio : appointment.patientBio });
    }
    return transformedAppointments;
  }

  const onItemClick = (item) => {
    if (user.role === 'Patient') {
      return;
    }
    navigation.navigate('Patient Detail', { item });
  };

  const renderItems = ({ item }) => {
    return (
      <AppointmentItem item={item} onItemClick={onItemClick} isDoctor={user.role === 'Doctor'} />
    );
  };

  const getKey = (item) => {
    return item.appointmentId;
  };

  if (!appointments || !appointments.length) { 
    return <View style={styles.noAppointmentContainer}><Text style={styles.noAppointmentText}>There is no appointment</Text></View>
  }

  return (
    <View style={styles.list}>
      <FlatList
        data={appointments}
        renderItem={renderItems}
        keyExtractor={(item, index) => getKey(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noAppointmentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noAppointmentText: {
    fontSize: 16,
    fontWeight: 'bold'
  },  
  list: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 4,
  }
});

export default Appointments;