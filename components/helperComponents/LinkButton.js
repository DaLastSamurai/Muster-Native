import React from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-elements'
// generic component for link buttons. Used multple times, very straightforward.
// takes an optional argument for type. 

console.disableYellowBox = true;

export default class LinkButton extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(e) {
    if(typeof this.props.clickFunction(e) !== 'undefined') {
      // console.log('invoked this.props.clickFunction: ', this.props.clickFunction(e));
      this.props.clickFunction(e).then(data => data)
    }
  }

  render() {
    // console.log('these are the props in the LinkButton: ', this.props)
   return (

      <TouchableOpacity 
        style={styles.defaultStyle}
        onPress={this.handlePress}
      >
        <Text style={{
         color: 'white', 
         fontSize: 20, 
         textAlign: 'center', 

        }}> 
            {this.props.title} 
        </Text> 
      </TouchableOpacity> 

    )
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    // flex: 1, 
    padding: 2, 
  },
});