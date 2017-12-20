import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'
// generic component for link buttons. Used multple times, very straightforward.
// takes an optional argument for type. 
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

      <Button 
        style={this.props.style || null}
        loading={this.props.loading}
        type={this.props.type || "button"} 
        onPress={this.handlePress}
        title={this.props.title}
      />

    )
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});