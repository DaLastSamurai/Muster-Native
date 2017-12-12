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
      itemData: [],
    };
    this.passItemDataToScanScreen = this.passItemDataToScanScreen.bind(this)
    this.toggleManualScreenLoaded = this.toggleManualScreenLoaded.bind(this)
  }

  passItemDataToScanScreen(itemData) { this.setState({ itemData }) }
  toggleManualScreenLoaded(manualScreenLoaded = !this.state.manualScreenLoaded) {
    this.setState({manualScreenLoaded})
  }



  render() {
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

          passItemDataToScanScreen = {this.passItemDataToScanScreen}
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
