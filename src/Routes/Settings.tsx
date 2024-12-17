import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import NavBar from '../components/NavBar.tsx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function Settings({navigation, route}) : React.JSX.Element {
  const { user } = route.params;

  const handleLogout = async () => {

    await auth().signOut();
    navigation.navigate('Login');
    
  };

  const handleDeleteAccount = async () => {

    try 
    {

      const currentUser = auth().currentUser;

      if (currentUser) {
        const userEmail = currentUser.email ? currentUser.email.toLowerCase() : '';
        
        // Delete user from database
        await firestore().collection('users').doc(userEmail).delete();
        
        // Delete user authentication data
        await currentUser.delete();
        
        // go to Login page
        navigation.navigate('Login');
      }

    } 
    
    catch (error) {
      console.log('Error deleting account:', error);
      
    }

  };

  return (

    <SafeAreaView style={styles.main}>

      <View style={styles.navView}>

        <NavBar path="settings" user={user} />

      </View>


      <View style={styles.content}>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>

          <Text style={styles.buttonText}>Log Out</Text>

        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteAccount}>

          <Text style={styles.buttonText}>Delete Account</Text>

        </TouchableOpacity>


      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
  },


  navView: {
    flex: 0,
    paddingHorizontal: 35,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:670,
  },


  button: {
    backgroundColor: '#D1BB91',
    borderRadius: 19,
    padding: 15,
    marginVertical: 10,
    width: '80%',
  },


  buttonDelete: {
    backgroundColor: '#FF5757',
    borderRadius: 19,
    padding: 15,
    marginVertical: 10,
    width: '80%',
  },


  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 17,
    
  },

  
});

export default Settings;
