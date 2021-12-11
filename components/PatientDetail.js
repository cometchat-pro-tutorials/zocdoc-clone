import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const PatientDetail = ({ route }) => {
  const { item } = route.params;

  if (!item) {
    return <></>;
  }

  return (
    <View style={styles.patientDetailWrapper}>
      <View style={styles.patientDetailContainer}>
        <Image style={styles.patientDetailImage} source={{ uri: item.avatar }} />
        <View style={styles.patientDetailDescriptionContainer}>
          <Text style={styles.patientDetailFullname}>{item.fullname}</Text>
          <View style={styles.patientDetailTimeslotContainer}>
            <View style={styles.patientDetailTimeSlotItem}>
              <Text style={styles.patientDetailTimeSlotText}>9:00am</Text>
            </View>
            <View style={styles.patientDetailTimeSlotItem}>
              <Text style={styles.patientDetailTimeSlotText}>9:30am</Text>
            </View>
            <View style={styles.patientDetailTimeSlotItem}>
              <Text style={styles.patientDetailTimeSlotText}>10:00am</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.patientDetailDescription}>
        <Text style={styles.patientDetailDescriptionTitle}>Description</Text>
        <Text style={styles.patientDetailDescriptionContent}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
      </View>
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
  patientDetailWrapper: {
    flex: 1,
    padding: 12
  },
  patientDetailContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 12,
    marginBottom: 12
  },
  patientDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },
  patientDetailDescriptionContainer: {
    flexDirection: 'column'
  },
  patientDetailFullname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 22
  },
  patientDetailBio: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 22,
    marginTop: 8
  },
  patientDetailRatingWrapper: {
    alignItems: 'flex-start',
    marginLeft: 22,
    paddingTop: 5
  },
  patientDetailTimeslotContainer: {
    flexDirection: 'row',
    marginLeft: 22,
    paddingVertical: 8
  },
  patientDetailTimeSlotItem: {
    backgroundColor: '#FCD34D',
    borderRadius: 4,
    padding: 8,
    marginRight: 8
  },
  patientDetailTimeSlotText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  patientDetailDescription: {

  },
  patientDetailDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  patientDetailDescriptionContent: {
    paddingTop: 8,
    fontSize: 15,
    textAlign: 'justify'
  }
});

export default PatientDetail;