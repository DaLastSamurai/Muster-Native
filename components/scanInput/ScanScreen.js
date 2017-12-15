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
      itemData: {}, // this is the object that comes from the scanner.
      sendingFromButton: false,
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
        {/* The new line is there purely for styling. */}
        <Text> {"    "} </Text> 
        {/* This is the manual add items (or add information) */}
        <ManualScreen 
          sentFromButton = {this.state.sendingFromButton}
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
        <LinkButton
          title = "Go To Your Items"
          clickFunction = {() => {
            this.setState({manualScreenLoaded : true}, 
              this.setState({sendingFromButton : true}))
            }
          }
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
