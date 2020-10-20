import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../../services/api';

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
    this.props.navigation.navigate('SignUp');
  };

  handleLoginPress = async () => {
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      console.log('Sem infos');
      this.setState(
        {
          error: 'Preencha usuário e senha para continuar!',
        },
        () => false,
      );
    } else {
      console.log('Tudo certo');
      this.props.navigation.navigate('Inicio');
      /*try {
        const response = await api.post('/sessions', {
          email: this.state.email,
          password: this.state.password,
        });

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Main',
              params: {token: response.data.token},
            }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      } catch (_err) {
        this.setState({
          error: 'Houve um problema com o login, verifique suas credenciais!',
        });
      }*/
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>MagnaFarm</Text>
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
          <Text style={styles.loginText}>Cadastrar</Text>
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
  logo: {
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
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: '#ebf3e8',
  },
  errorText: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 16,
    marginTop: 15,
  },
});
