import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LinkButton from '../helperComponents/LinkButton'
import ManualScreen from '../manualAddItems/ManualScreen'
import Scanner from './Scanner'

// this recieves the userObj from the app. 

export default class ScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manualScreenLoaded: false,
      itemId: '' // this is the hash that comes back from axios request on scanner.
    };
    this.passItemIdToScanScreen = this.passItemIdToScanScreen.bind(this)
    this.toggleManualScreenLoaded = this.toggleManualScreenLoaded.bind(this)
  }

  passItemIdToScanScreen(itemId) { this.setState({ itemId }) }
  toggleManualScreenLoaded(manualScreenLoaded = !this.state.manualScreenLoaded) {
    this.setState({manualScreenLoaded})
  }



  render() {
    console.log('this is the state of itemId', this.state.itemId)
    return this.state.manualScreenLoaded 
    ? ( 
      <View>
        <Text> You are authed and on the ManualScreen </Text> 
        {/* This is the manual add items (or add information) */}
        <ManualScreen 
          itemId = {this.state.itemId} 
          userObj = {this.props.userObj}
          toggleManualScreenLoaded = {this.toggleManualScreenLoaded}
        /> 
      </View>
    ) : (
      <View>
        <Scanner 
          userObj = {this.props.userObj}
          passItemIdToScanScreen = {this.passItemIdToScanScreen}
          toggleManualScreenLoaded = {this.toggleManualScreenLoaded}
        /> 
      </View>
    )
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
