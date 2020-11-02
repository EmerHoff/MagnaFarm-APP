import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
} from 'react-native';

import api from '../services/api';

export default class Propriedade extends React.Component {
  state = {
    propriedades: [],
    error: '',
  };

  componentDidMount() {
    this.loadPropriedades();
  }

  loadPropriedades = async () => {
    const id_usuario = await AsyncStorage.getItem('id_usuario');

    if (!id_usuario) {
      this.setState(
        {
          error:
            'Não encontramos o ID do seu usuário, tente sair e entrar novamente em sua conta!',
        },
        () => false,
      );
    }

    const response = await api.get('/propriedade/listar/' + id_usuario);

    const {propriedades} = response.data;
    this.setState({propriedades});
  };

  renderItem = ({item}) => (
    <View style={styles.listaContainer}>
      <View style={styles.propriedadeContainer}>
        <Text style={styles.propriedadeNome}>{item.nome}</Text>
        <Text style={styles.propriedadeArea}>Área: {item.area} hectares</Text>
        <Text style={styles.propriedadeArea}>{item.endereco}</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Propriedades</Text>

        <FlatList
          data={this.state.propriedades}
          keyExtractor={(item) => item.id}
          renderItem={this.renderItem}
        />

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => {
            this.props.navigation.navigate('NovaPropriedade');
          }}>
          <Text style={styles.botaoText}>Adicionar Propriedade</Text>
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
    justifyContent: 'flex-start',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ebf3e8',
    marginTop: '10%',
    padding: 10,
  },
  botaoAdicionar: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  botaoText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listaContainer: {
    padding: 10,
    backgroundColor: '#2e7d42',
    width: '80%',
    height: '80%',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 5,
  },
  propriedadeContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#656a6e',
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
  },
  propriedadeNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  propriedadeArea: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
    lineHeight: 24,
  },
  botaoEditar: {
    height: 30,
    width: '50%',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 13,
    marginTop: 15,
    fontWeight: 'bold',
  },
});
