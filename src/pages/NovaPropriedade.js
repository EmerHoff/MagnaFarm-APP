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
import DocumentPicker from 'react-native-document-picker';

//const [singleFile, setSingleFile] = useState(null);
export default class NovaPropriedade extends React.Component {
  state = {
    nome: '',
    endereco: '',
    comarca: '',
    matricula: '',
    area: '',
    error: '',
    selectedFile: '',
  };

  handleSalvarPress = async () => {
    if (
      this.state.nome.length === 0 ||
      this.state.endereco.length === 0 ||
      this.state.comarca.length === 0 ||
      this.state.matricula.length === 0 ||
      this.state.area.length === 0
    ) {
      this.setState(
        {
          error: 'Preencha todos os campos antes de salvar!',
        },
        () => false,
      );
    } else {
      try {
        if (!this.state.area.includes(',') && !this.state.area.includes('.')) {
          this.state.area = this.state.area + '.0';
        } else if (this.state.area.includes(',')) {
          this.state.area = this.state.area.replace(',', '.');
        }

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

        const response = await api.post('/propriedade', {
          nome: this.state.nome,
          endereco: this.state.endereco,
          comarca: this.state.comarca,
          matricula: this.state.matricula,
          area: this.state.area,
          id_usuario: id_usuario,
        });

        if (response.data.statusCode === 200) {
          uploadImage();
          this.props.navigation.navigate('Propriedade');
        } else {
          this.setState({
            error: response.data.message,
          });
        }
      } catch (_err) {
        this.setState({
          error:
            'Houve um problema ao salvar as informações, verifique se os todos os dados foram inseridos corretamente!',
        });
      }
    }
  };

  uploadImage = async () => {
    // Check if any file is selected or not
    if (this.state.selectedFile === '') {

      /*const fileToUpload = singleFile;
      const data = new FormData();
      data.append('name', 'file_send');
      data.append('file_attachment', fileToUpload);

      let res = await fetch(
        'http://localhost/usuario/arquivo',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }*/

      const data = new FormData();
      data.append('name', 'file_send');
      data.append('file', this.state.selectedFile);
      //data.append('file', this.state.selectedFile);

      api.post('/usuario/arquivo', data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
          console.warn(res);
      });


    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };

  selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      this.setState({ selectFile: res });
    } catch (err) {
      this.setState({ selectFile: '' });
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Seleção de documento cancelada!');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.menuText}>Nova Propriedade</Text>
        <Text style={styles.infoText}>
          Preencha nos campos abaixo todas as informações sobre a propriedade.
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Nome"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.nome}
            onChangeText={(nome) => {
              this.setState({nome});
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Endereço"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.endereco}
            onChangeText={(endereco) => {
              this.setState({endereco});
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Comarca"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.comarca}
            onChangeText={(comarca) => {
              this.setState({comarca});
            }}
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
            onChangeText={(matricula) => {
              this.setState({matricula});
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            keyboardType={'decimal-pad'}
            style={styles.inputText}
            placeholder="Área Total"
            placeholderTextColor="#a9cba1"
            autoCorrect={false}
            value={this.state.area}
            onChangeText={(area) => {
              this.setState({area});
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.fileBtn}
          activeOpacity={0.5}
          onPress={this.selectFile}>
          <Text style={styles.fileText}>Anexar Documento</Text>
        </TouchableOpacity>

        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={this.handleSalvarPress}>
          <Text style={styles.loginText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Inicio');
          }}>
          <Text style={styles.forgot}>Voltar para o Inicio</Text>
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
  fileBtn: {
    width: '60%',
    backgroundColor: '#374d34',
    borderRadius: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  fileText: {
    height: 20,
    color: '#ebf3e8',
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
