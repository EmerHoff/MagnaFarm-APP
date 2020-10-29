import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';

export default class NovaPropriedade extends React.Component {
  state = {
    nome: '',
    endereco: '',
    comarca: '',
    matricula: '',
    area: 0,
  };

  handleCadastroPress = async () => {
    if (
      this.state.nome.length === 0 ||
      this.state.endereco.length === 0 ||
      this.state.comarca.length === 0 ||
      this.state.matricula.length === 0 ||
      this.state.area <= 0
    ) {
      this.setState(
        {
          error: 'Preencha todos os campos antes de salvar!',
        },
        () => false,
      );
    } else {
      try {
        const response = await api.post('/usuario', {
          login: this.state.login,
          nome: this.state.nome,
          telefone: this.state.telefone,
          senha: this.state.senha,
          confirma_senha: this.state.confirma_senha,
        });

        console.log(response.data);

        if (response.data.statusCode === 200) {
          this.props.navigation.navigate('BemVindo');
        } else {
          this.setState({
            error: response.data.message,
          });
        }
      } catch (_err) {
        this.setState({
          error:
            'Houve um problema com o cadastro, verifique se os todos os dados foram inseridos!',
        });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.menuText}>Nova Propriedade</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Nome"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.nome}
            onChangeText={this.setState({nome})}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Endereço"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.endereco}
            onChangeText={this.setState({endereco})}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Comarca"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.comarca}
            onChangeText={this.setState({comarca})}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Matrícula"
            placeholderTextColor="#a9cba1"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.matricula}
            onChangeText={this.setState({matricula})}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Área Total"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.area}
            onChangeText={this.setState({area})}
          />
        </View>

        <TextInput style={styles.inputText}>Anexar Documento</TextInput>

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}
        <TouchableOpacity
          style={styles.loginBtn}
          //onPress={this.handleCadastroPress}>
          onPress={() => {
            this.props.navigation.navigate('BemVindo');
          }}>
          <Text style={styles.loginText}>Avançar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Login');
          }}>
          <Text style={styles.forgot}>Voltar para o Login</Text>
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
});
