import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Alert, StyleSheet, Text, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import DoctorDetail from './components/DoctorDetail';
import Appointments from './components/Appointments';
import PatientDetail from './components/PatientDetail';
import Conversations from './components/Conversations';

import Context from './context';
import { cometChatConfig } from './env';

const Stack = createNativeStackNavigator();

const App = () => {
  const [cometChat, setCometChat] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initCometChat();
    initAuthenticatedUser();
    getPermissions();
  }, []);

  const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/react-native-chat');
    const appID = `${cometChatConfig.cometChatAppId}`;
    const region = `${cometChatConfig.cometChatRegion}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log('CometChat was initialized successfully');
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  };

  const initAuthenticatedUser = async () => {
    const authenticatedUser = await AsyncStorage.getItem('auth');
    setUser(() => authenticatedUser ? JSON.parse(authenticatedUser) : null);
  };

  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      let granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      }
    }
  };

  const handleLogout = (navigation) => {
    cometChat.logout().then(
      () => {
        AsyncStorage.removeItem('auth');
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        });
      }, error => {
        console.log("Logout failed with exception:", { error });
      }
    );
  };

  const logout = (navigation) => () => {
    Alert.alert(
      "Confirm",
      "Do you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => handleLogout(navigation) }
      ]
    );
  };

  const goAppointments = (navigation) => () => {
    navigation.navigate('Appointments');
  };

  const goConversations = (navigation) => () => {
    navigation.navigate('Conversations');
  };

  if (user) {
    return (
      <Context.Provider value={{ cometChat, user, setUser }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={({ navigation }) => ({
              headerTitle: () => (
                <View>
                </View>
              ),
              headerLeft: () => {
                if (Platform.OS === 'ios') {
                  return (
                    <View style={styles.headerLeft}>
                      <TouchableOpacity>
                        <Text style={styles.headerLeftTitle}>ZocDoc</Text>
                      </TouchableOpacity>
                    </View>
                  );
                  return <></>;
                }
              },
              headerRight: () => (
                <View style={styles.headerRight}>
                  {user.role === 'Patient' && <TouchableOpacity onPress={goAppointments(navigation)}>
                    <Image
                      style={[styles.headerRightImage, styles.mgr8]}
                      source={require('./images/alarm-clock.png')}
                    />
                  </TouchableOpacity>}
                  <TouchableOpacity onPress={goConversations(navigation)}>
                    <Image
                      style={[styles.headerRightImage, styles.mgr8]}
                      source={require('./images/chat.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={logout(navigation)}>
                    <Image
                      style={styles.headerRightImage}
                      source={require('./images/power-off.png')}
                    />
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: {
                backgroundColor: '#FCD34D',
              },
            })} />
            <Stack.Screen name="Doctor Detail" component={DoctorDetail} options={({ navigation }) => ({
              headerStyle: {
                backgroundColor: '#FCD34D',
              },
            })} />
            <Stack.Screen name="Appointments" component={Appointments} options={({ navigation }) => ({
              headerStyle: {
                backgroundColor: '#FCD34D',
              },
            })} />
            <Stack.Screen name="Patient Detail" component={PatientDetail} options={({ navigation }) => ({
              headerStyle: {
                backgroundColor: '#FCD34D',
              },
            })} />
            <Stack.Screen name="Conversations" component={Conversations} options={({ navigation }) => ({
              headerStyle: {
                backgroundColor: '#FCD34D',
              },
            })} />
          </Stack.Navigator>
        </NavigationContainer>
      </Context.Provider>
    );
  }

  return (
    <Context.Provider value={{ cometChat, user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerStyle: {
                backgroundColor: '#FCD34D',
              }
            }}
          />
          <Stack.Screen name="SignUp" component={SignUp} options={{
            headerStyle: {
              backgroundColor: '#FCD34D',
            }
          }} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerLeftTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 22
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerRightImage: {
    width: 24,
    height: 24
  },
  mgr8: {
    marginRight: 8
  },
  logoMargin: {
    marginTop: 8
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default App;