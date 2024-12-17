import React from 'react';
import {View, StyleSheet} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

function NavBar(props: { user: any; path: string; }) : React.JSX.Element {
  
  const navigator = useNavigation();
  const user = props.user;

  const handleHome = () => {
    // @ts-ignore
    navigator.navigate('Home', {user: user});
  };

  const handleProfile = () => {
    // @ts-ignore
    navigator.navigate('Profile', {user: user});
  };

  const handleSettings = () => {
    // @ts-ignore
    navigator.navigate('Settings', {user: user});
  };

  return (
    <View style={styles.main}>

      <View style={styles.iconView}>
        
        <Icon name={props.path === 'home' ? 'calendar-clear' : 'calendar-clear-outline'} size={30} onPress={handleHome}/>
        <Icon name={props.path === 'profile' ? 'person-sharp' : 'person-outline'} size={30} onPress={handleProfile}/>
        <Icon name={props.path === 'settings' ? 'settings' : 'settings-outline'} size={30} onPress={handleSettings}/>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  main: {
    flex: 1,
    flexDirection: 'row',
    height: '101%',
    width: 65,
    justifyContent: 'center',
    elevation: 3,
    borderWidth: 0,
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: 'white',
  },

  iconView: {
    gap: 40,
    marginTop: 25,
  },

});

export default NavBar;
