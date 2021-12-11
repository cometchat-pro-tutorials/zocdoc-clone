import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import validator from "validator";
import SelectDropdown from 'react-native-select-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';

import Context from "../context";

import { cometChatConfig } from '../env';

import { auth, createUserWithEmailAndPassword, storage, storageRef, uploadBytesResumable, getDownloadURL, database, databaseRef, databaseSet } from "../firebase";

const SignUp = () => {
  const { cometChat } = useContext(Context);

  const [userAvatar, setUserAvatar] = useState(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const roles = ['Patient', 'Doctor'];
  let role = roles[0];

  const onFullnameChanged = (fullname) => {
    setFullname(() => fullname);
  };

  const onEmailChanged = (email) => {
    setEmail(() => email);
  };

  const onPasswordChanged = (password) => {
    setPassword(() => password);
  };

  const onConfirmPasswordChanged = (confirmPassword) => {
    setConfirmPassword(() => confirmPassword);
  };

  const onBioChanged = (bio) => {
    setBio(() => bio);
  };

  const showMessage = (title, message) => {
    Alert.alert(
      title,
      message
    );
  };

  const isSignupValid = ({ fullname, email, role, password, confirmPassword }) => {
    if (validator.isEmpty(fullname)) {
      showMessage('Error', 'Please input your full name');
      return false;
    }
    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      showMessage('Error', 'Please input your email');
      return false;
    }
    if (validator.isEmpty(role)) {
      showMessage('Error', 'Please select your role');
      return false;
    }
    if (validator.isEmpty(password)) {
      showMessage('Error', 'Please input your password');
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      showMessage('Error', 'Please input your confirm password');
      return false;
    }
    if (password !== confirmPassword) {
      showMessage('Error', 'Your confirm password must be matched with your password');
      return false;
    }
    if (validator.isEmpty(bio)) {
      showMessage('Error', 'Please input your bio');
      return false;
    }
    return true;
  };

  const createCometChatAccount = async ({ id, fullname, avatar }) => {
    try {
      const authKey = `${cometChatConfig.cometChatAuthKey}`;
      const user = new cometChat.User(id);
      user.setName(fullname);
      user.setAvatar(avatar);
      const cometChatUser = await cometChat.createUser(user, authKey);
      if (cometChatUser) {
        showMessage('Info', `${fullname} was created successfully! Please sign in with your created account`);
        setIsLoading(false);
        setUserAvatar(null);
      } else {
        setIsLoading(false);
        setUserAvatar(null);
      }
    } catch (error) {
      showMessage('Error', 'Fail to create your CometChat user, please try again');
    }
  };

  const register = async () => {
    if (isSignupValid({ fullname, email, role, password, confirmPassword, bio })) {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential) {
        const userId = userCredential._tokenResponse.localId;
        const createdAccount = { id: userId, fullname, email, role, bio };
        databaseSet(databaseRef(database, 'users/' + userId), createdAccount);
        const storageImageRef = storageRef(storage, `users/${userAvatar.name}`);
        const localFile = await fetch(userAvatar.uri);
        const fileBlob = await localFile.blob();
        const uploadTask = uploadBytesResumable(storageImageRef, fileBlob, { contentType: userAvatar.type });
        uploadTask.on('state_changed',
          (snapshot) => {
          },
          (error) => {
            setUserAvatar(null);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (downloadUrl) {
              createdAccount.avatar = downloadUrl;
              databaseSet(databaseRef(database, 'users/' + userId), createdAccount);
              createCometChatAccount({ id: userId, fullname, avatar: downloadUrl });
            }
          }
        );
      } else {
        setIsLoading(false);
        showMessage('Error', 'Fail to create your account, your account might be existed');
      }
    }
  };

  const selectAvatar = () => {
    const options = {
      mediaType: 'photo'
    };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return null;
      } else if (response.assets && response.assets.length) {
        const uri = response.assets[0].uri;
        const fileName = response.assets[0].fileName;
        const type = response.assets[0].type;
        if (uri && fileName) {
          const file = {
            name: fileName,
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: type || 'video/quicktime'
          };
          setUserAvatar(() => file);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadContainer} onPress={selectAvatar}>
        {!userAvatar && <>
          <Image style={styles.uploadImageIcon} source={require('../images/image-gallery.png')} />
          <Text style={styles.uploadImageTitle}>Upload your avatar</Text>
        </>}
        {userAvatar && <Image style={styles.userAvatar} source={{ uri: userAvatar.uri }} />}
      </TouchableOpacity>
      <TextInput
        autoCapitalize='none'
        onChangeText={onFullnameChanged}
        placeholder="Full name"
        placeholderTextColor="#ccc"
        style={styles.input}
      />
      <TextInput
        autoCapitalize='none'
        onChangeText={onEmailChanged}
        placeholder="Email"
        placeholderTextColor="#ccc"
        style={styles.input}
      />
      <View style={styles.selectContainer}>
        <SelectDropdown
          data={roles}
          defaultValueByIndex={0}
          buttonStyle={styles.selectDropdown}
          buttonTextStyle={styles.selectDropdownText}
          onSelect={(selectedItem, index) => {
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            role = selectedItem
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
        />
      </View>
      <TextInput
        autoCapitalize='none'
        onChangeText={onPasswordChanged}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        autoCapitalize='none'
        onChangeText={onConfirmPasswordChanged}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        autoCapitalize='none'
        onChangeText={onBioChanged}
        placeholder="Bio"
        placeholderTextColor="#ccc"
        style={styles.input}
      />
      <TouchableOpacity style={styles.register} onPress={register}>
        <Text style={styles.registerLabel}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 56
  },
  loadingContainer: { 
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadImageIcon: {
    width: 96,
    height: 96
  },
  userAvatar: {
    width: 128,
    height: 128,
    borderRadius: 128 / 2
  },
  uploadImageTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 16
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    marginHorizontal: 24
  },
  selectDropdown: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1
  },
  selectDropdownText: {
    textAlign: 'left',
    fontSize: 16
  },
  register: {
    backgroundColor: '#FCD34D',
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 16,
  },
  registerLabel: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default SignUp;