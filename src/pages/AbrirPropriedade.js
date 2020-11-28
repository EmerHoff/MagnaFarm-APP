import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default class AbrirPropriedade extends React.Component {
    state = {
      propriedade: this.props.navigation.state.params.propriedade,
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.menuText}>Propriedade</Text>
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
  menuText: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#194314',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#ebf3e8',
  },
  forgot: {
    color: '#ebf3e8',
    padding: 10,
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 13,
    marginTop: 15,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -20,
    width: '80%',
  },
});
