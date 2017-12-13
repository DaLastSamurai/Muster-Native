import { BarCodeScanner, Permissions } from 'expo';
import React from 'react';
import axios from 'axios'; 
import { StyleSheet, Text, View, Alert } from 'react-native';
import LinkButton from '../helperComponents/LinkButton'
import { herokuUrl } from '../../config/serverConfig'

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null, 
      alreadyScanned : false
    };
    this.handleScan = this.handleScan.bind(this)
  }


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  handleScan({type, data}) {
    // this will take whatever data is recieved from the scanner and handle it lol.
    // alert(`Bar code with type ${type} and data ${data} has been alreadyScanned!`);
    if (type === 'org.gs1.EAN-13') {
      const upcCode = data
      const uid = this.props.userObj.uid
      axios.get(`${herokuUrl}/scan/sem3/upc/${upcCode}`)
        .then(res => {
          if (res.data.code !== "OK") {
            alert(`There was an error parsing this UPC. Please try again. res code: ${res.status}`)}
          // console.log('this is the data that comes back from the axios request: ', res.data.results[0])
          // console.log('this is the status code: ', res.status)
          this.props.passItemDataToScanScreen(res.data.results[0])
          this.props.toggleManualScreenLoaded()
        })
    }
  }

  render() {
    console.log('this is the userObj.uid in the Scanner: ', this.props.userObj.uid )
    return this.state.hasCameraPermission === null 
    ? <Text>Requesting camera permission...</Text> 
    
    : this.state.hasCameraPermission === false 
    ? <Text>You cannot use this feature if you do not allow camera use</Text> 
    
    : <View style={{ flex: 1 }}>
        <Text> You are authed, have given permission, and are ready to scan</Text> 
        <BarCodeScanner
          onBarCodeRead={(obj) => {
              if (!this.state.alreadyScanned) {
                this.state.alreadyScanned = true; 
                this.handleScan(obj)
              }
            }
          }
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








