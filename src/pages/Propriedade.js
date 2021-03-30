import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import api from '../services/api';
import Connection from '../services/connection';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';

export default class Propriedade extends React.Component {
  state = {
    propriedades: [],
    error: '',
  };

  componentDidMount() {
    if (Connection.isConnected()) {
      this.synchronizeUser();
    }

    this.loadPropriedades();
  }

  synchronizeUser = async () => {
    const id_usuario = await AsyncStorage.getItem('@save_id');

    if (!id_usuario) {
      return;
    }

    //salvar os arquivos da propriedade
    const responsePropriedade = await api.post(
      '/arquivo/sincronizar/propriedades',
      {
        caminho: id_usuario + '/',
      },
    );

    if (responsePropriedade.data) {
      const propriedades = responsePropriedade.data.propriedades;

      propriedades.forEach(async (propriedade) => {
        //salva os arquivos da propriedade
        propriedade.arquivos.forEach(async (arquivo) => {
          this.saveFile(
            arquivo.data,
            id_usuario + '_prop' + propriedade.nome + '_' + arquivo.nome,
          );
        });

        //busca os arquivos dos talhoes
        const responseTalhoes = await api.post('/arquivo/sincronizar/talhoes', {
          caminho: id_usuario + '/' + propriedade.nome + '/',
        });

        const talhoesPolyline = [];

        if (responseTalhoes.data) {
          //para cada talhao salva os arquivos
          const talhoes = responseTalhoes.data.talhoes;
          talhoes.forEach(async (talhao) => {
            talhao.arquivos.forEach(async (arquivo) => {
              this.saveFile(
                arquivo.data,
                id_usuario +
                  '_prop' +
                  propriedade.nome +
                  '_th' +
                  talhao.nome +
                  '_' +
                  arquivo.nome,
              );

              //adiciona o mapa do talhao a um arquivo com todos os demais talhoes
              if (arquivo.nome === 'field_' + talhao.nome + '_json.txt') {
                const jsonTalhao = JSON.parse(arquivo.data);

                const talhaoPolyline = [];

                jsonTalhao['coordinates'][0].forEach(coord => {
                  talhaoPolyline.push({
                      latitude: coord[1],
                      longitude: coord[0],
                  });
                });

                talhoesPolyline.push({
                  talhao: talhao.nome,
                  coordenadas: talhaoPolyline,
                });
              }
            });
          });
        }

        //salva o arquivo de mapas dos talhoes
        this.saveFile(
          JSON.stringify(talhoesPolyline),
          id_usuario + '_prop' + propriedade.nome + '_polyline.txt',
        );

        //salva um arquivo com informacoes das propriedades
        const responseProps = await api.get('/propriedade/listar/' + id_usuario);
        if (responseProps) {
          this.saveFile(
            JSON.stringify(responseProps.data),
            id_usuario + '_propiedades.txt',
          );
        }
      });
    }
  };

  saveFile = async (content, name) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    RNFS.writeFile(path + name, content, 'utf8');
  };

  loadPropriedades = async () => {
    const id_usuario = await AsyncStorage.getItem('@save_id');

    if (!id_usuario) {
      this.setState(
        {
          error:
            'Não encontramos o ID do seu usuário, tente sair e entrar novamente em sua conta!',
        },
        () => false,
      );
    }

    const data = await this.lerArquivo(id_usuario + '_propiedades.txt');
    const propriedades = JSON.parse(data);
    this.setState({propriedades: propriedades.propriedades});

    /*if(Connection.isConnected()) {
      const response = await api.get('/propriedade/listar/' + id_usuario);

      const {propriedades} = response.data;
      this.setState({propriedades});
    } else {

    }*/
  };

  setarPropriedade = async (id) => {
    await AsyncStorage.setItem('@open_propriedade', id.toString());
    this.props.navigation.navigate('AbrirPropriedade');
  }

  lerArquivo = async (caminho) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    const data = await RNFS.readFile(path + caminho, 'utf8');
    return data;
  }

  renderItem = ({item}) => (
    
      <View style={styles.propriedadeContainer}>
        <Text style={styles.propriedadeNome}>{item.nome}</Text>
        <Text style={styles.propriedadeArea}>Área: {item.area.toString()} hectares</Text>
        <Text style={styles.propriedadeArea}>{item.endereco}</Text>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => {
            this.setarPropriedade(item.id)
          }}>
          <Text style={styles.botaoText}>Visualizar</Text>
        </TouchableOpacity>
      </View>
    
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Propriedades</Text>

        <View style={styles.listaContainer}>
          <FlatList
            data={this.state.propriedades}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
          />
        </View>
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
    height: '60%',
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
