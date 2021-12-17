import React, { useEffect, useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

import Context from '../context';

import { database, databaseRef, databaseSet, databaseQuery, orderByChild, equalTo, databaseOnValue, databaseOff } from "../firebase";

import { cometChatConfig } from '../env';

const DoctorDetail = ({ route }) => {
  const { item } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [hasCreatedAppointment, setHasCreatedAppointment] = useState(false);

  const { user } = useContext(Context); 

  useEffect(() => {
    getAppointments();
    return () => {
      const appointmentsRef = databaseRef(database, 'appointments');
      databaseOff(appointmentsRef);
    }
  });

  const getAppointments = () => {
    const appointmentsRef = databaseQuery(databaseRef(database, 'appointments'), orderByChild('patientId'), equalTo(user.id));
    databaseOnValue(appointmentsRef, async (snapshot) => {
      const values = snapshot.val();
      if (values) {
        const keys = Object.keys(values);
        const doctors = keys.map(key => values[key]);
        if (doctors && doctors.length && doctors.find(doctor => doctor.doctorId === item.id)) {
          setHasCreatedAppointment(() => true);
        } else {
          setHasCreatedAppointment(() => false);
        }
      }
    });
  };

  const createCometChatFriend = async () => {
    if (!user || !item) {
      return;
    }
    setIsLoading(true);
    const cometChatAppId = `${cometChatConfig.cometChatAppId}`;
    const cometChatAppRegion = `${cometChatConfig.cometChatRegion}`;
    const cometChatApiKey = `${cometChatConfig.cometChatRestApiKey}`;
    const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${user.id}/friends`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appId: cometChatAppId,
        apiKey: cometChatApiKey,
      },
      body: JSON.stringify({ accepted: [item.id] }),
    };
    try {
      const response = await fetch(url, options);
      if (response) {
        alert(`The appointment was created succesfully`);
      } else {
        alert(`Failure to add create the appointment`);
      }
      setIsLoading(false);
      setHasCreatedAppointment(() => true);
    } catch (error) { 
      console.log(error);
      setIsLoading(false);
    }
  };

  const createFirebaseAppointment = async () => {
    const id = uuidv4();
    const createdAppointment = { id, patientName: user.fullname, patientId: user.id, patientImage: user.avatar, patientBio: user.bio ? user.bio : '', doctorName: item.fullname, doctorId: item.id, doctorImage: item.avatar, doctorBio: item.bio ? item.bio : '' };
    await databaseSet(databaseRef(database, 'appointments/' + id), createdAppointment);
  };

  const handleDoctorConnection = async () => {
    await createCometChatFriend();
    await createFirebaseAppointment();
  };

  const connectWithDoctor = () => {
    Alert.alert(
      "Confirm",
      "Do you want to set an appointment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDoctorConnection() }
      ]
    );
  };

  if (!item) {
    return <></>;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.doctorDetailWrapper}>
      <View style={styles.doctorDetailContainer}>
        <Image style={styles.doctorDetailImage} source={{ uri: item.avatar }} />
        <View style={styles.doctorDetailDescriptionContainer}>
          <Text style={styles.doctorDetailFullname}>Dr. {item.fullname}</Text>
          <Text style={styles.doctorDetailBio}>Primary Care Doctor</Text>
          <View style={styles.doctorDetailRatingWrapper}>
            <AirbnbRating
              isDisabled
              defaultRating={5}
              showRating={false}
              ratingCount={5}
              size={18}
              style={{ paddingVertical: 10 }}
            />
          </View>
          <View style={styles.doctorDetailTimeslotContainer}>
            <View style={styles.doctorDetailTimeSlotItem}>
              <Text style={styles.doctorDetailTimeSlotText}>9:00am</Text>
            </View>
            <View style={styles.doctorDetailTimeSlotItem}>
              <Text style={styles.doctorDetailTimeSlotText}>9:30am</Text>
            </View>
            <View style={styles.doctorDetailTimeSlotItem}>
              <Text style={styles.doctorDetailTimeSlotText}>10:00am</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.doctorDetailDescription}>
        <Text style={styles.doctorDetailDescriptionTitle}>Description</Text>
        <Text style={styles.doctorDetailDescriptionContent}>{item.bio}</Text>
      </View>
      {!hasCreatedAppointment && <TouchableOpacity style={styles.setAppointmentBtn} onPress={connectWithDoctor}>
        <Text style={styles.setAppointmentTxt}>Set Appointment</Text>
      </TouchableOpacity>}
    </View>
  );
};


const styles = StyleSheet.create({
  loadingContainer: { 
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  doctorDetailWrapper: {
    flex: 1,
    padding: 12
  },
  doctorDetailContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 12,
    marginBottom: 12
  },
  doctorDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },
  doctorDetailDescriptionContainer: {
    flexDirection: 'column'
  },
  doctorDetailFullname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 22
  },
  doctorDetailBio: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 22,
    marginTop: 8
  },
  doctorDetailRatingWrapper: {
    alignItems: 'flex-start',
    marginLeft: 22,
    paddingTop: 5
  },
  doctorDetailTimeslotContainer: {
    flexDirection: 'row',
    marginLeft: 22,
    paddingVertical: 8
  },
  doctorDetailTimeSlotItem: {
    backgroundColor: '#FCD34D',
    borderRadius: 4,
    padding: 8,
    marginRight: 8
  },
  doctorDetailTimeSlotText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  doctorDetailDescription: {

  },
  doctorDetailDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  doctorDetailDescriptionContent: {
    paddingTop: 8,
    fontSize: 15,
    textAlign: 'justify'
  },
  setAppointmentBtn: {
    alignItems: 'center',
    backgroundColor: '#FCD34D',
    borderRadius: 4,
    display: 'flex',
    fontSize: 18,
    fontWeight: 'bold',
    height: 56,
    justifyContent: 'center',
    margin: 16,
    marginBottom: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  setAppointmentTxt: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default DoctorDetail;