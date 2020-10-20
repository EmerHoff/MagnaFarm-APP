/*import React, {Component, View, Text} from 'react';

export default class Login extends Component {
  render() {
    return (
      <View>
        <Text>Tela de Login</Text>
      </View>
    );
  }
}*/

import React from 'react';
import {View, Text, Button} from 'react-native';

function Login({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Login')}
      />
      <Button title="Inicio" onPress={() => navigation.navigate('Inicio')} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
export default Login;
