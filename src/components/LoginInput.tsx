import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

function LoginInput(props: {
  value: string | undefined;
  setValue: ((text: string) => void) | undefined;
  Label: string
  isSecure: boolean;
}): React.JSX.Element {
  return (
    <View>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.setValue}
        secureTextEntry={props.isSecure}
      />
      <Text style={styles.label}>{props.Label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#6B6B6B',
    borderRadius: 10,
    alignSelf: 'center',
    paddingTop: 20,
    paddingLeft: 10,
    color: 'black',
  },
  label: {
    position: 'absolute',
    top: -11,
    left: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(209, 187, 145, 1)',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
});

export default LoginInput;
