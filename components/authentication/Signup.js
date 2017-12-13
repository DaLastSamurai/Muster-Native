import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
import axios from 'axios'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';
import { herokuUrl, localhost } from '../../config/serverConfig.js'
import { iosClientId, emailSignInPass } from '../../config/firebase/loginWithGoogleCredentials'
import LinkButton from '../helperComponents/LinkButton'

export default class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      error : "", 
      email : "", 
      pw : "", 
    }; 
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this)
    
    // this has to go in the constructor so that I can use async.
    this._signUpWithGoogle = async (e) => {
      try {
        const result = await Expo.Google.logInAsync({
          iosClientId: iosClientId,
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          let email = result.user.email; 
          let pw = emailSignInPass; 
          this.setState({ email }, () => {
            this.setState({ pw }, () => {
              this.handleEmailSubmit() 
            })
          })
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
    }
    
    this._signUpWithGoogle = this._signUpWithGoogle.bind(this)
  }


  handleEmailSubmit(e) {
    // console.log('the handleEmailSubmit is running')
    e ? e.preventDefault() : null
    // replace with localhost or herokuUrl to run on heroku or locally. 
    axios.post(`${herokuUrl}/auth/signup/email`, {
      "username" : this.state.email, 
      "password" : this.state.pw
    })
    .then(res => {
      if (res.data.error) { this.setState({error : res.data.error}) }
      else {
        let userObj = res.data
        // this is sent down from app through authScreen. It sets state in App, 
        // which in turn calls checkAuthStatus from authHelpers. 
        this.props.sendUserInfoToApp(userObj.currentUser)
      }
    }) 
  }  


  render() {
    return (
      <View> 
        {/* This is the google authentication: */}
        <LinkButton 
          title="Sign Up With Google"
          clickFunction={this._signUpWithGoogle}
        /> 

        <Text style={styles.decisionText}> Or Sign Up With Email </Text> 
        {/* This is the email auth*/}
        <FormInput 
          style={styles.email}
          autoCapitalize={"none"}
          keyboardType={'email-address'}
          autoFocus={true}
          autoCorrect={false}
          onChangeText={(text) => this.state.email = text} 
          placeholder="Email Address"
          // placeholderTextColor="white"
        />

        <FormInput 
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={true}
          placeholder="Password" 
          onChangeText={(pw) => this.state.pw = pw} 
        />

        <LinkButton 
          title='Sign Up With Email' 
          clickFunction={this.handleEmailSubmit} 
        />

        <Text> {this.state.error} </Text>  

        <LinkButton 
          title='Login Page' 
          clickFunction={this.props.loadLoginPage}
        />
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  email: {
    color: '#000000', 
    justifyContent: 'center',
  },
  decisionText: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight:20,
    fontSize:13
  }, 
});
