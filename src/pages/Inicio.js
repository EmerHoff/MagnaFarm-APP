import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

export default class Inicio extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Tela Inicial</Text>
        <Button
          title="Voltar para o Login"
          onPress={() => {
            this.props.navigation.navigate('Login');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  texto: {
    color: 'white',
    fontSize: 20,
  },
});
