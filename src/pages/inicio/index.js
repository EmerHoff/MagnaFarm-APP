/*import React, {Component, View, Text} from 'react';

export default class Inicio extends Component {
  render() {
    return (
      <View>
        <Text>Tela de Inicio</Text>
      </View>
    );
  }
}*/

import React from 'react';
import {View, Text, Button} from 'react-native';

function Inicio({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}
export default Inicio;
