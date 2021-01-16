import React from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import Connection from '../services/connection';
import api from '../services/api';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
export default class Inicio extends React.Component {
  componentDidMount() {
    if (Connection.isConnected()) {
      this.synchronizeUser();
    }
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
        console.log(JSON.stringify(talhoesPolyline));
        this.saveFile(
          JSON.stringify(talhoesPolyline),
          id_usuario + '_prop' + propriedade.nome + '_polyline.txt',
        );
      });
    }
  };

  saveFile = async (content, name) => {
    const path = RNFS.DocumentDirectoryPath + '/magnafarm/';

    // write the file
    RNFS.writeFile(path + name, content, 'utf8');
  };

  readFile = async (name) => {
    const path = RNFS.DocumentDirectoryPath + '/magnafarm/';

    // write the file
    const data = await RNFS.readFile(path + name, 'utf8');
  };

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
