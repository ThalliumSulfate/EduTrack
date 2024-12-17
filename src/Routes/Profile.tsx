import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image, TextInput} from 'react-native';
import NavBar from '../components/NavBar.tsx';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// @ts-ignore
function Profile({navigation, route}) : React.JSX.Element {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { async function fetchUser() {
    let docSnap = await firestore().collection('users').doc(route.params.user.email).get();
    let user = docSnap.data();

    if(user !== undefined) {
      setEmail(route.params.user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setCity(user.location);
    }
    else {
      setEmail('Invalid User');
      setFirstName('Invalid User');
      setLastName('Invalid User');
      setPhone('Invalid User');
      setCity('Invalid user');
    }
  }
  fetchUser();
  }, []);

  const handleEdit = (e: any) => {
    e.preventDefault();
    if(!isEdit) {
      setIsEdit(true);
    }
    else {
      if(email !== '' && firstName !== '' && lastName !== '' && phone != ''){
        let phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        let emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(!phoneRegEx.test(phone)) {
          setError('Phone formatting wrong');
          return;
        }
        if(!emailRegEx.test(email)) {
          setError('Email formatting wrong');
          return;
        }


        if(password === passwordConfirm) {
          if(password !== '') {
            // @ts-ignore
            auth().currentUser
              .updatePassword(password)
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(email.toLowerCase())
                  .set({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    location: city,
                  })
                  .then(() => {
                    console.log('User information Updated!');
                    setIsEdit(false);
                  });
              }).catch(err => {
                console.log(err.message);
                if(err.code === 'auth/weak-password') {
                  setError('Password too weak, must be 6 digits');
                }
                else if(err.code === 'auth/requires-recent-login') {
                  setError('Must be a recent login: information sensitive');
                }
              setError(err.message);
            });
          }
          else {
            firestore()
              .collection('users')
              .doc(email.toLowerCase())
              .set({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                location: city,
              })
              .then(() => {
                console.log('User information Updated!');
                setIsEdit(false);
              });
          }
        }
        else {
          setError('Passwords do not match');
          return;
        }
      }
      else {
        setError('Required Fields are NULL');
        return;
      }
    }

  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.page}>
        <View style={styles.topView} />
        <Text style={styles.edit} onPress={handleEdit}>{isEdit ? 'Save' : 'Edit'}</Text>
        <View style={styles.imgView}>
          <Image source={require('../../res/No_User.png')} style={styles.img}/>
        </View>
        <View style={styles.mainView}>
          <View style={styles.line}/>
          <View style={styles.inputContainer}>
            <Text style={styles.inputContainerText}>
              <Icon style={styles.inputContainerIcon} name="document"/> Profile
            </Text>
            <View style={styles.inputView}>
              <TextInput style={styles.input} editable={isEdit} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#BFBFBF"/>
              <View style={styles.line}/>
              <TextInput style={styles.input} editable={isEdit} value={lastName} onChangeText={setLastName} placeholder="Last Name"  placeholderTextColor="#BFBFBF"/>
            </View>
          </View>
          <View style={styles.line}/>
          <View style={styles.inputContainer}>
            <Text style={styles.inputContainerText}>
              <Icon style={styles.inputContainerIcon} name="person-outline"/> Details
            </Text>
            <View style={styles.inputView}>
              <TextInput style={styles.input} editable={isEdit} value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor="#BFBFBF"/>
              <View style={styles.line}/>
              <TextInput style={styles.input} editable={isEdit} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor="#BFBFBF"/>
              <View style={styles.line}/>
              <TextInput style={styles.input} editable={isEdit} value={city} onChangeText={setCity} placeholder="City or country (Optional)" placeholderTextColor="#BFBFBF"/>
            </View>
          </View>
          <View style={styles.line}/>
          <View style={styles.inputContainer}>
            <Text style={styles.inputContainerText}>
              <Icon style={styles.inputContainerIcon} name="key-outline"/> Password
            </Text>
            <View style={styles.inputView}>
              <TextInput style={styles.input} editable={isEdit} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#BFBFBF" secureTextEntry={true}/>
              <View style={styles.line}/>
              <TextInput style={styles.input} editable={isEdit} value={passwordConfirm} onChangeText={setPasswordConfirm} placeholder="Re-enter the password" placeholderTextColor="#BFBFBF" secureTextEntry={true}/>
            </View>
          </View>
          <View style={styles.line}/>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <Text style={error === '' ? {height:0, width:0} : styles.error} >{error}</Text>
        </View>
      </View>
      <View style={styles.navView}>
        <NavBar path="profile" user={route.params.user} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  navView: {
    flex: 0,
  },
  page: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  topView: {
    flexDirection: 'row',
    height: 400,
    width: 400,
    alignSelf: 'center',
    backgroundColor: '#C8AD7E',
    borderRadius: 200,
    marginTop: -200,
  },
  edit: {
    margin: 15,
    color: '#F5F5DD',
    fontWeight: '600',
    fontSize: 20,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  img: {
    resizeMode: 'cover',
    height: 100,
    width: 100,
  },
  imgView: {
    position: 'absolute',
    top: '15%',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#C8AD7E',
  },
  line: {
    borderWidth: 1,
    borderColor: '#EFEEF3',
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  inputContainer: {
    margin: 20,
    gap: 5,
    minWidth: 250,
    alignSelf:'center',
  },
  inputContainerText: {
    color: '#4D4D4D',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainerIcon: {
    color: '#B0B0B0',
    fontSize: 14,
    fontWeight: '600',
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#CACACA',
  },
  input: {
    padding: 10,
    color: 'black',
  },
  mainView: {
    flex: 1,
    marginLeft: 30,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ffbebe',
    backgroundColor: '#ffeba6',
    padding: 5,
    alignSelf: 'center',
    borderRadius: 15,
    width: '70%',
  },
});

export default Profile;
