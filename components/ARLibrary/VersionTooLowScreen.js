import Expo from 'expo';
import React from 'react';
import LinkTouchableOpacity from '../helperComponents/LinkTouchableOpacity'
import { ImageBackground, PanResponder, Text, View, StyleSheet, Dimensions} from 'react-native'

import bookShelf from '../../assets/lights.jpg'

export default class VersionTooLowScreen extends React.Component {
  constructor() {
    super();
    this.state = {
    }; 
  }
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}> 
        <ImageBackground
          blurRadius={3}
          source={bookShelf} 
          style={styles.background}
        > 
          <Text style = {{ color: 'white', fontSize: 20, textAlign: 'center', justifyContent: 'center' }}> 
            You need to update to iOS 11 or later to experience your virtual bookshelf
          </Text> 
          <View style={styles.buttonContainer}>
            <LinkTouchableOpacity
              title = "Go To Details Editor"
              clickFunction = {() => this.props.navigateToScanScreen(null, 'ManualScreen')}
            /> 
            <Text style = {{ color: 'white', fontSize: 20, textAlign: 'center' }}> 
              |
            </Text> 
            <LinkTouchableOpacity
              title = "Go To Book Scanner"
              clickFunction = {() => {this.props.navigateToScanScreen(null, 'Scanner')}}
            />
          </View> 
        </ImageBackground> 
      </View>   
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer : {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
  }, 
});
