import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';

import Signup from './Signup'
import Login from './Login'

// THIS IS THE ENTRY POINT FOR AUTHENTICATION
/*
AuthScreen
  \___Signup (if this.props.isSigningUp === true)
   \__Login (if this.props.isSigningUp === false)
        \___ResetPassword
         
*/

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigningUp: this.props.isSigningUp,// this will load the login page by default.
      loading: false, 
    }; 
    this.loadSignupPage = this.loadSignupPage.bind(this); 
    this.loadLoginPage = this.loadLoginPage.bind(this);
  }

  componentWillReceiveProps() {
    // these props come down from the app.js and are toggled by clicking the 
    // 'login' button in the unprotected nav. 
    this.setState({isSigningUp : this.props.isSigningUp})
  }

  loadSignupPage() {
    this.setState({isSigningUp: true})
  }

  loadLoginPage() {
    this.setState({isSigningUp: false})
  }

  render() {
    return this.state.isSigningUp 
    ? (
      <View> 
        <Text>                  </Text> 
        <Signup 
          loadLoginPage = {this.loadLoginPage}
          sendUserInfoToApp = {this.props.sendUserInfoToApp}
        />
      </View> 
      ) 
    : (
      <View> 
        <Login 
          user = {this.props.user} 
          loadSignupPage = {this.loadSignupPage}
          sendUserInfoToApp = {this.props.sendUserInfoToApp}
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
  //   justifyContent: 'center',
  // },
});
