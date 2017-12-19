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
          // console.log('this is the data on handle scan', res.data)
          if (res.data.code !== "OK") {
            console.log('there was an error parsing!')
            alert(`There was an error parsing this UPC. Please try again. Fail code: ${res.status}`)
          } else if (res.data.message === "No results found; please modify your request.") {
            console.log('there were no results for the UPC!')
            Alert.alert(`There were no results for this UPC. You can still add the item manually by going to 'Your Items'`,
              "", 
              [{
                text : 'Take Me To My Items', 
                onPress: () => this.props.toggleManualScreenLoaded()
              }]
            )
          } else {
            console.log('item successfully scanned.')
            this.props.passItemDataToScanScreen(res.data.results[0])
            this.props.toggleManualScreenLoaded() 
          }
        })
    }
  }

  render() {
    // console.log('this is the userObj.uid in the Scanner: ', this.props.userObj.uid )
    return this.state.hasCameraPermission === null 
    ? (<View> 
        <Text>Requesting camera permission. </Text> 
        <Text> If you have scanned several items, this may take a second. </Text>
      </View>)
    
    : this.state.hasCameraPermission === false 
    ? <Text>You cannot use this feature if you do not allow camera use</Text> 
    
    : <View style={{ flex: 1 }}> 
        {/* This is where the tint frame will go. */}
        <Text> You are authed, have given permission, and are ready to scan</Text> 

        <BarCodeScanner 
          style={StyleSheet.absoluteFill}
          
          onBarCodeRead={(obj) => {
              if (!this.state.alreadyScanned) {
                this.state.alreadyScanned = true; 
                this.handleScan(obj)
              }
            }
          }
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








