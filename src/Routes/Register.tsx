import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// @ts-ignore
function Register({navigation}) : React.JSX.Element | null {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  function onAuthStateChanged(newUser: any) {
    setUser(newUser);
  }

  useEffect(() => {
    if(user != null) {
      // @ts-ignore
      navigation.navigate('Home', {user: user});
    }
  }, [user]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const handleBack = (e: any) => {
    e.preventDefault();
    navigation.goBack();
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    let phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    let emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(firstName === '' || lastName === '' || phone === '' || email === '' || password === '' || passwordConfirm === '') {
      setError('Error: Missing Required Field.');
      return;
    }

    if(password !== passwordConfirm) {
      setError('Error: Passwords do not match');
      return;
    }

    if(!phoneRegEx.test(phone)) {
      setError('Error: Invalid phone number.');
      return;
    }

    if(!emailRegEx.test(email)) {
      setError('Error: Invalid email address.');
      return;
    }

    auth().createUserWithEmailAndPassword(email, password)
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
            console.log('Successfully registered!');
          });
      })
      .catch(err => {console.log(err);});
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topView}>
        <Icon style={styles.back} name="chevron-back" size={25} onPress={handleBack} />
        <Text style={styles.save} onPress={handleSave}>
          Save
        </Text>
      </View>
      <View style={styles.imgView}>
        <Image style={styles.img} source={require('../../res/No_User.png')}/>
      </View>
      <View style={styles.main}>
        <View style={styles.line}/>
        <View style={styles.inputContainer}>
          <Text style={styles.inputContainerText}>
            <Icon style={styles.inputContainerIcon} name="document"/> Profile
          </Text>
          <View style={styles.inputView}>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#BFBFBF"/>
            <View style={styles.line}/>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name"  placeholderTextColor="#BFBFBF"/>
          </View>
        </View>
        <View style={styles.line}/>
        <View style={styles.inputContainer}>
          <Text style={styles.inputContainerText}>
            <Icon style={styles.inputContainerIcon} name="person-outline"/> Details
          </Text>
          <View style={styles.inputView}>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor="#BFBFBF"/>
            <View style={styles.line}/>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor="#BFBFBF"/>
            <View style={styles.line}/>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City or country (Optional)" placeholderTextColor="#BFBFBF"/>
          </View>
        </View>
        <View style={styles.line}/>
        <View style={styles.inputContainer}>
          <Text style={styles.inputContainerText}>
            <Icon style={styles.inputContainerIcon} name="key-outline"/> Password
          </Text>
          <View style={styles.inputView}>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#BFBFBF" secureTextEntry={true}/>
            <View style={styles.line}/>
            <TextInput style={styles.input} value={passwordConfirm} onChangeText={setPasswordConfirm} placeholder="Re-enter the password" placeholderTextColor="#BFBFBF" secureTextEntry={true}/>
          </View>
        </View>
        <View style={styles.line}/>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={error === '' ? {height:0, width:0} : styles.error} >{error}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    overflow: 'hidden',
  },
  back: {
    margin: 15,
    color: '#C8AD7E',
  },
  topView: {
    flexDirection: 'row',
    height: 60,
  },
  save: {
    margin: 15,
    color: '#C8AD7E',
    position: 'absolute',
    right: 0,
    fontWeight: '600',
    fontSize: 20,
  },
  img: {
    height: 99,
    width: 99,
    resizeMode: 'cover',
  },
  imgView: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  main: {
    flex: 1,
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
  line: {
    borderWidth: 1,
    marginVertical: 5,
    borderColor: '#EFEEF3',
    height: 1,
    width: '80%',
    alignSelf: 'center',
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

export default Register;
