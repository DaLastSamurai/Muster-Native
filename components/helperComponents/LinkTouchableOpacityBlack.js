import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements'
// generic component for link buttons. Used multple times, very straightforward.
// takes an optional argument for type. 

console.disableYellowBox = true;

export default class LinkTouchableOpacity extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(e) {
    if(typeof this.props.clickFunction(e) !== 'undefined') {
      this.props.clickFunction(e).then(data => data)
    }
  }

  render() {
   return (
    <TouchableOpacity
      style={{
        flex: 1, 
        padding: 5, 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
      loading={this.props.loading}
      onPress={this.handlePress}  
    >
      <Text style={{ color: 'black', fontSize: 15, textAlign: 'center' }}> 
        {this.props.title} 
      </Text> 
    </TouchableOpacity> 
    )
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});