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
      itemData: {} // this is the object that comes from the scanner.
    };
    this.passItemDataToScanScreen = this.passItemDataToScanScreen.bind(this)
    this.toggleManualScreenLoaded = this.toggleManualScreenLoaded.bind(this)
  }

  passItemDataToScanScreen(itemData) { this.setState({ itemData }) }
  toggleManualScreenLoaded(manualScreenLoaded = !this.state.manualScreenLoaded) {
    this.setState({manualScreenLoaded})
  }



  render() {
    console.log('this is the state of itemData', this.state.itemData)
    return this.state.manualScreenLoaded 
    ? ( 
      <View>
        <Text> You are authed and on the ManualScreen </Text> 
        {/* This is the manual add items (or add information) */}
        <ManualScreen 
          itemData = {this.state.itemData} 
          userObj = {this.props.userObj}
          toggleManualScreenLoaded = {this.toggleManualScreenLoaded}
        /> 
      </View>
    ) : (
      <View>
        <Scanner 
          userObj = {this.props.userObj}
          passItemDataToScanScreen = {this.passItemDataToScanScreen}
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
