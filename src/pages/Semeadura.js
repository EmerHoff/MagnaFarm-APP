import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Picker} from '@react-native-community/picker';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
export default class Semeadura extends React.Component {
  state = {
    idTalhao: '',
    cultura: '',
    variedade: '',
    dataPlantio: '',
    error: '',
  };

  componentDidMount() {
    this.setarData();
  }

  setarData() {
    var today = new Date();
    var year = today.getFullYear();
    var mes = today.getMonth() + 1;
    if (today.getMonth() + 1 <= 9) {
      mes = '0' + (today.getMonth() + 1).toString();
    }
    var dia = today.getDate();

    this.setState({ dataPlantio: dia + "/" + mes + "/" + year});
  }

  handleCulturaChange = (cultura) => {
    this.setState({cultura});
  };
  handleVariedadeChange = (variedade) => {
    this.setState({variedade});
  };
  handleDataPlantioChange = (dataPlantio) => {
    this.setState({dataPlantio});
  };

  handleSalvarPress = async () => {
    if (
      this.state.idTalhao.length === 0 ||
      this.state.cultura.length === 0 ||
      this.state.variedade.length === 0 ||
      this.state.dataPlantio.length === 0 
    ) {
      this.setState(
        {
          error: 'Preencha todos os campos antes de continuar!',
        },
        () => false,
      );
    } else {
      try {
        /*const response = await api.post('/usuario', {
          login: this.state.login,
          nome: this.state.nome,
          telefone: this.state.telefone,
          senha: this.state.senha,
          confirma_senha: this.state.confirma_senha,
        });

        console.log(response.data);

        if (response.data.statusCode === 200) {
          await AsyncStorage.setItem('@save_id', response.data.usuario.id.toString());
          this.props.navigation.navigate('BemVindo');
        } else {
          this.setState({
            error: response.data.message,
          });
        }*/
        console.log('salvou de mentirinha');
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
        <Text style={styles.logo}>Semeadura</Text>
        
        <View style={styles.inputView}>
          <Picker
            selectedValue={this.state.cultura}
            style={{color: '#FFF'}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({cultura: itemValue})
            }>
            <Picker.Item label="Soja" value="soja" />
            <Picker.Item label="Milho" value="milho" />
          </Picker>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Variedade"
            placeholderTextColor="#a9cba1"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.variedade}
            onChangeText={this.handleVariedadeChange}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Data do Plantio"
            placeholderTextColor="#a9cba1"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.dataPlantio}
            onChangeText={this.handleDataPlantioChange}
          />
        </View>

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={this.handleCadastroPress}>
          <Text style={styles.loginText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Text style={styles.forgot}>Voltar para o talhão</Text>
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
