import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AppointmentItem = ({ item, onItemClick, isDoctor }) => {
  const clickItem = () => { 
    onItemClick(item);
  };

  if (!item) {
    return <></>;
  }

  return (
    <TouchableOpacity style={styles.listItemWrapper} onPress={clickItem}>
      <View style={styles.listItemContainer}>
        <Image style={styles.listItemImage} source={{ uri: item.avatar }} />
        <View style={styles.listItemDescriptionContainer}>
          <Text style={styles.listItemFullname}>{isDoctor ? item.fullname : `Dr. ${item.fullname}` }</Text>
          <View style={styles.listTimeslotContainer}>
            <View style={styles.listItemTimeSlotItem}>
              <Text style={styles.listItemTimeSlotText}>9:00am</Text>
            </View>
            <View style={styles.listItemTimeSlotItem}>
              <Text style={styles.listItemTimeSlotText}>9:30am</Text>
            </View>
            <View style={styles.listItemTimeSlotItem}>
              <Text style={styles.listItemTimeSlotText}>10:00am</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 4,
  },
  listItemWrapper: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  listItemContainer: {
    flexDirection: 'row'
  },
  listItemImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },
  listItemDescriptionContainer: {
    flexDirection: 'column'
  },
  listItemFullname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 22
  },
  listTimeslotContainer: {
    flexDirection: 'row',
    marginLeft: 22,
    paddingVertical: 8
  },
  listItemTimeSlotItem: {
    backgroundColor: '#FCD34D',
    borderRadius: 4,
    padding: 8,
    marginRight: 8
  },
  listItemTimeSlotText: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default AppointmentItem;