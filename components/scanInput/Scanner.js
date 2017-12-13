import { BarCodeScanner, Permissions } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import LinkButton from '../helperComponents/LinkButton'
import { herokuUrl } from '../../config/serverConfig'

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null, 
    };
    this.handleScan = this.handleScan.bind(this)
  }


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  handleScan({type, data}) {
    // this will take whatever data is recieved from the scanner and handle it lol.
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (type === 'org.gs1.EAN-13') {
      let upcCode = data
      let uid = this.props.userObj.uid
      axios.get(`${herokuUrl}/scan/sem3/upc/${upcCode}/${uid}`)
        .then(res => {
          alert(`This is the data that comes back: ${res}`);
          // console.log('this is the data that comes back from the barcode scan: ', res)
          this.props.passItemIdToScanScreen(res.data.itemId)
          this.props.toggleManualScreenLoaded()
        })
    }
  }

  render() {
    console.log('this is the userObj: ', this.props.userObj.uid )
    return this.state.hasCameraPermission === null 
    ? <Text>Requesting camera permission...</Text> 
    
    : this.state.hasCameraPermission === false 
    ? <Text>You cannot use this feature if you do not allow camera use</Text> 
    
    : <View style={{ flex: 1 }}>
        <Text> You are authed, have given permission, and are ready to scan</Text> 
        <BarCodeScanner
          onBarCodeRead={this.handleScan}
          style={StyleSheet.absoluteFill}
        />
      </View>
    
  }
}


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   // justifyContent: 'center',
  // },
});
