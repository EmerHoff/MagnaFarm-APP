import {StackActions} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
  };

  handleEmailChange = (email) => {
    this.setState({email});
  };

  handlePasswordChange = (password) => {
    this.setState({password});
  };

  handleCreateAccountPress = () => {
    this.props.navigation.navigate('Cadastro');
  };

  handleLoginPress = async () => {
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      console.log('Sem infos');
      this.setState(
        {
          error: 'Preencha os campos de email e senha para continuar!',
        },
        () => false,
      );
    } else {
      try {
        console.log(this.state.email);

        const response = await api.post('/usuario/login', {
          login: this.state.email,
          senha: this.state.password,
        }).then(res => {
            console.log(res);
            console.log(res.data)
        })
        .catch(error => console.log(error));

        console.log(response);

        if (response.data.statusCode === 200) {
          console.log(response.data.usuario.id);

          await AsyncStorage.setItem('@save_id', response.data.usuario.id.toString());

          this.props.navigation.navigate('Inicio');
        } else {
          this.setState({
            error: response.data.message,
          });
        }
      } catch (_err) {
        this.setState({
          error:
            'Houve um problema com o login, verifique se os dados informados estão corretos!',
        });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('../images/logo.png')}
        />
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Endereço de email"
            placeholderTextColor="#a9cba1"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.email}
            onChangeText={this.handleEmailChange}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Senha"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#a9cba1"
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={this.handleLoginPress}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            style={styles.loginText}
            onPress={this.handleCreateAccountPress}>
            Cadastrar
          </Text>
        </TouchableOpacity>
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
  logoImage: {
    width: '60%',
    height: '30%',
    resizeMode: 'stretch',
    padding: 10,
    marginBottom: '10%',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 50,
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
    fontSize: 12,
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
});
