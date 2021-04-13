import {StackActions} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
  };

  componentDidMount() {
    this.requestPermissions();
  }

  requestPermissions = async () => {
    const fineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    const coarseLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

    if (!fineLocation) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permissão de Localização",
          message: "O App precisa de acesso a sua localização.",
          buttonNeutral: "Pergunte-me depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
    }

    if (!coarseLocation) {
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Permissão de Localização Precisa",
          message: "O App precisa de acesso a sua localização mais precisa.",
          buttonNeutral: "Pergunte-me depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
    }
  }

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
    this.setState({loading: true});
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      console.log('Sem infos');
      this.setState({loading: false});
      this.setState(
        {
          error: 'Preencha os campos de email e senha para continuar!',
        },
        () => false,
      );
    } else {
      try {
        const response = await api.post('/usuario/login', {
          login: this.state.email,
          senha: this.state.password,
        });

        if (response.data.statusCode === 200) {
          console.log(response.data.usuario.id);
          await AsyncStorage.setItem('@save_id', response.data.usuario.id.toString());

          this.setState({loading: false});
          await this.synchronizeUser();
          this.props.navigation.navigate('Propriedade');
        } else {
          this.setState({loading: false});
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
    this.setState({loading: false});
  };

  synchronizeUser = async () => {
    const id_usuario = await AsyncStorage.getItem('@save_id');

    if (!id_usuario) {
      return;
    }

    //salva um arquivo com informacoes das propriedades
    const responseProps = await api.get('/propriedade/listar/' + id_usuario);
    
    console.log(responseProps.data);
    if (responseProps.data) {
      console.log('foii');
      await this.saveFile(JSON.stringify(responseProps.data), id_usuario + '_propriedades.txt');
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
      });
    }
  };

  saveFile = async (content, name) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    RNFS.writeFile(path + name, content, 'utf8');
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

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}

        {this.state.loading === true && (
          <View style={[styles.loading, styles.overlayLoading]}>
              <ActivityIndicator animating={this.state.loading} size="large" color="#00ff00" />
          </View>
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLoading: {
    backgroundColor: '#000',
    opacity: 0.5,
  }
});
