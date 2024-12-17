import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LoginInput from './LoginInput.tsx';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

function LoginCard(): React.JSX.Element {
  const navigator = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  function onAuthStateChanged(newUser: any) {
    setUser(newUser);
  }

  useEffect(() => {
    if(user != null) {
      // @ts-ignore
      navigator.navigate('Home', {user: user});
    }
  }, [user]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setError('Error: Field is null');
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {

      })
      .catch(err => {
        if (err.code === 'auth/invalid-credential') {
          setError('Error: Invalid credential.');
        }
      });
  };

  const handleRegister = (e: {preventDefault: () => void}) => {
    e.preventDefault();
    // @ts-ignore
    navigator.navigate('Register');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Sign into your account</Text>
      <View style={styles.inputs}>
        <LoginInput
          Label="Email"
          value={email}
          isSecure={false}
          setValue={setEmail}
        />
        <LoginInput
          Label="Password"
          value={password}
          isSecure={true}
          setValue={setPassword}
        />
      </View>
      <Text style={styles.forgotTxt}>Forgot Password?</Text>
      <Text style={error === '' ? {height: 0, width: 0} : styles.error}>
        {error}
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonTxt}>Login</Text>
      </TouchableOpacity>
      <View style={styles.registerTxtView}>
        <Text style={styles.registerTxt}>
          <Text>Dont have an account? </Text>
          <Text style={styles.registerClickableTxt} onPress={handleRegister}>
            {' '}
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.71)',
  },
  header: {
    fontSize: 15,
    fontWeight: '600',
    margin: 10,
  },
  inputs: {
    marginTop: 20,
    gap: 25,
  },
  forgotTxt: {
    textAlign: 'right',
    marginHorizontal: 20,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#D1BB91',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    padding: 10,
  },
  registerTxt: {
    marginHorizontal: 15,
    marginVertical: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  registerTxtView: {
    justifyContent: 'flex-end',
  },
  registerClickableTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B77800',
  },
  row: {
    flexDirection: 'row',
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

export default LoginCard;
