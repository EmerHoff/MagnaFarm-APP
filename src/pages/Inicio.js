import React from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';

export default class Inicio extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.botaoInicio}
          onPress={() => {
            this.props.navigation.navigate('Propriedade');
          }}>
          <Text style={styles.botaoTexto}>Propriedades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoInicio}
          onPress={() => {
            this.props.navigation.navigate('Talhões');
          }}>
          <Text style={styles.botaoTexto}>Talões</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoInicio}
          onPress={() => {
            this.props.navigation.navigate('Inicio');
          }}>
          <Text style={styles.botaoTexto}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoInicio}
          onPress={() => {
            this.props.navigation.navigate('Propriedade');
          }}>
          <Text style={styles.botaoTexto}>Configurações</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  botaoInicio: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
    borderRadius: 5,
    borderWidth: 3,
    width: '40%',
    height: '20%',
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 20,
  },
});
