import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class BemVindo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Bem Vindo!</Text>

        <Text style={styles.textoInicial}>
          Agradecemos pelo seu cadastro no aplicativo e agora que conhecemos um
          pouco mais sobre você, gostariamos de saber algumas informações sobre
          as suas propriedades.{' '}
        </Text>

        <Text style={styles.textoInicial}>
          Na proxima tela você poderá cadastrar as suas propriedades.
        </Text>

        <Text style={styles.textoInicial}>
          Assim que finalizar o cadastro nossa equipe entrará em contato,
          podendo dar prosseguimento a sua solicitação e interesse em utilizar
          nossos serviços.
        </Text>

        <TouchableOpacity
          style={styles.botaoProsseguir}
          onPress={() => {
            this.props.navigation.navigate('Propriedade');
          }}>
          <Text style={styles.botaoText}>Prosseguir</Text>
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
    marginTop: '10%',
    padding: 10,
  },
  textoInicial: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#ebf3e8',
    marginBottom: 40,
    width: '80%',
  },
  botaoProsseguir: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  botaoText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
