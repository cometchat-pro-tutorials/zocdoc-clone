import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import DoctorItem from './DoctorItem';

import Context from '../context';

import { database, databaseRef, databaseOnValue, databaseOff, databaseQuery, orderByChild, equalTo } from "../firebase";

const Doctors = (props) => {
  const { navigation } = props;

  const [doctors, setDoctors] = useState([]);

  const { user } = useContext(Context);

  useEffect(() => {
    loadDoctors();
    return () => {
      setDoctors(() => []);
      const doctorsRef = databaseRef(database, 'users');
      databaseOff(doctorsRef);
    }
  }, []);


  const loadDoctors = () => {
    const doctorsRef = databaseQuery(databaseRef(database, 'users'), orderByChild('role'), equalTo('Doctor'));
    databaseOnValue(doctorsRef, async (snapshot) => {
      const values = snapshot.val();
      if (values) {
        const keys = Object.keys(values);
        const doctors = keys.map(key => values[key]);
        setDoctors(() => doctors);
      } else {
        setDoctors(() => []);
      }
    });
  };

  const onItemClick = (item) => {
    navigation.navigate('Doctor Detail', { item });
  };

  const renderItems = ({ item }) => {
    return (
      <DoctorItem item={item} onItemClick={onItemClick} />
    );
  };

  const getKey = (item) => {
    return item.id;
  };

  return (
    <View style={styles.list}>
      <FlatList
        data={doctors}
        renderItem={renderItems}
        keyExtractor={(item, index) => getKey(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 4,
  }
});

export default Doctors;