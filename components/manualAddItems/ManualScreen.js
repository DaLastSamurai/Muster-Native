import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LinkButton from '../helperComponents/LinkButton'

// this component takes props from ScanScreen and sets state in ScanScreen to 
// render this screen or the Scanner. 

export default class ManualScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.parseItemData = this.parseItemData.bind(this)
    this.sendItemDataToWebClient = this.sendItemDataToWebClient.bind(this)
    this.addItemToDatabase = this.addItemToDatabase.bind(this)
  }


  componentWillMount() {
    this.parseItemData()
  }

  parseItemData() {
    // this takes data from this.props.itemData and parses it so that it is of 
    // the same format as the addItems (web client). 

  }

  sendItemDataToWebClient() {

    // this will be sent in the callback of the data this.props.toggleManualScreenLoaded()
  }

  addItemToDatabase() {
    // this will add the item directly to the database. 
    
  }

  render() {
    return ( 
      <View>

        <LinkButton 
          title='Send Data To Web' 
          clickFunction={this.sendItemDataToWebClient} 
        />

        <LinkButton
          title='Add Item' 
          clickFunction={this.addItemToDatabase} 
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
