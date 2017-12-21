import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Keyboard } from 'react-native';
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
              this.handleEmailSubmit(e, true) 
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


  handleEmailSubmit(e, createdWithOAuth) {
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
        let userObj = res.data.currentUser
        userObj['createdWithOAuth'] = createdWithOAuth ? createdWithOAuth : false
        // this is sent down from app through authScreen. It sets state in App, 
        // which in turn calls checkAuthStatus from authHelpers. 

        this.props.sendUserInfoToApp(userObj)
      }
    }) 
  }  


  render() {
    return (
      <View style={styles.formContainer}> 
        {/* This is the google authentication: */}
        <LinkButton 
          title="Sign Up With Google"
          clickFunction={this._signUpWithGoogle}
        /> 

        <Text style={{
          padding: 20, 
          color: 'white', 
          fontSize: 20, 
          textAlign: 'center', 
        }}>
            -or-
        </Text> 
        {/* This is the email auth*/}
        <FormInput 
          style={styles.textInput}
          autoCapitalize={"none"}
          keyboardType={'email-address'}
          // autoFocus={true}
          autoCorrect={false}
          onChangeText={(text) => this.state.email = text} 
          placeholder="Email Address"
          placeholderTextColor="#b2b1b0"
          inputStyle={{
            color: 'white', 
            textAlign: 'center'
          }}

        />

        <FormInput
          style={styles.textInput} 
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={true}
          placeholder="Password" 
          onChangeText={(pw) => this.state.pw = pw}
          placeholderTextColor="#b2b1b0" 
          inputStyle={{
            color: 'white', 
            textAlign: 'center'
          }}
        />

        <LinkButton 
          title='Sign Up With Email' 
          clickFunction={this.handleEmailSubmit} 
        />

        <Text style={{
          padding: 20, 
          color: 'red', 
          fontSize: 15, 
          textAlign: 'center', 
        }}> 
          {this.state.error} 
        </Text>  
        <View style={{
            position: 'absolute', 
            bottom: 10, 
            left: Dimensions.get('window').width/2
        }}> 
          <LinkButton 
            title='Login Page' 
            clickFunction={this.props.loadLoginPage}
          />
        </View> 
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  formContainer : {
    flex : 1, 
    padding : 30, 
  }, 
  textInput: {
    color: 'white', 
    fontSize: 20, 
    height: 80,
    fontSize: 20,
    borderRadius: 20, 
  },
  decisionText: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight:20,
    fontSize:13
  }, 
});
