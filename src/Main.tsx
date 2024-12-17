import React from 'react';
import {useState, useEffect} from 'react';
import {SafeAreaView, View, StyleSheet, Text, ImageBackground} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import LoginCard from './components/LoginCard.tsx';
import Register from './Routes/Register.tsx';
import Home from './Routes/Home.tsx';
import Profile from './Routes/Profile.tsx';
import Settings from './Routes/Settings.tsx';

const Stack = createNativeStackNavigator();

function Main() : React.JSX.Element | null {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name='Settings' component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// @ts-ignore
function Login() : React.JSX.Element | null  {

  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged() {
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if(initializing) {return null;}

  return (
    <SafeAreaView style={styles.app}>
      <ImageBackground style={styles.bkg} source={require('../res/Vector.png')} >
        <View style={styles.view}>
          <Text style={styles.heading}>Welcome to Edu Track</Text>
          <LoginCard/>
        </View>
      </ ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'red',
    height: '100%',
  },
  bkg:{
    flex: 1,
    top: '-10%',
    height: '120%',
    width: '110%',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: 15,
    marginTop: '30%',
  },
});

export default Main;
