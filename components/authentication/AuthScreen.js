import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Image } from 'react-native';
import firebase from 'firebase'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';

import bookShelf from '../../assets/lights.jpg'


import Signup from './Signup'
import Login from './Login'

// THIS IS THE ENTRY POINT FOR AUTHENTICATION
/*
AuthScreen
  \___Signup (if this.props.isSigningUp === true)
   \__Login (if this.props.isSigningUp === false)
        \___ResetPassword
         
*/

console.disableYellowBox = true;

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigningUp: this.props.isSigningUp,// this will load the login page by default.
    }; 
    this.loadSignupPage = this.loadSignupPage.bind(this); 
    this.loadLoginPage = this.loadLoginPage.bind(this);
  }

  componentWillReceiveProps() {
    // these props come down from the app.js and are toggled by clicking the 
    // 'login' button in the unprotected nav. 
    this.setState({isSigningUp : this.props.isSigningUp})
  }

  loadSignupPage() { this.setState({isSigningUp: true}) }
  loadLoginPage() { this.setState({isSigningUp: false}) }

  render() {
    return (
      <View style={{backgroundColor: 'rgba(0,0,0,0)',}}> 
        <ImageBackground
          blurRadius={3}
          source={bookShelf} 
          style={styles.background}
        > 
        {this.state.isSigningUp 
            ? (
              <View style={{ flex: 1 }}> 
                <Text>                  </Text> 
                <Signup 
                  loadLoginPage = {this.loadLoginPage}
                  sendUserInfoToApp = {this.props.sendUserInfoToApp}
                />
              </View> 
            ) : (
              <View style={{ flex: 1 }}> 
                <Login 
                  user = {this.props.user} 
                  loadSignupPage = {this.loadSignupPage}
                  sendUserInfoToApp = {this.props.sendUserInfoToApp}
                />
              </View> 
            )
        }
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
});
