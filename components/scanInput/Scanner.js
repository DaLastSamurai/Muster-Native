import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LinkButton from '../helperComponents/LinkButton'

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleScan = this.handleScan.bind(this)
  }

  handleScan() {
    // this will take whatever data is recieved from the scanner and handle it lol.

  }

  render() {
    return (
      <View>
        <Text> You are authed and on the Scanner </Text> 


        <LinkButton
          title='Scan' 
          clickFunction={this.handleScan} 
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
