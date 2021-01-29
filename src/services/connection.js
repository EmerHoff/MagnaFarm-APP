import NetInfo from '@react-native-community/netinfo';

export default class Connection {
  static async isConnected() {
    const response = await NetInfo.fetch();
    return response.isConnected;
  }
}
