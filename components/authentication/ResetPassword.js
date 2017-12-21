import React from 'react';
import { StyleSheet, Text, View, Button, Keyboard } from 'react-native';
import firebase from 'firebase'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { herokuUrl, localhost } from '../../config/serverConfig.js'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';
import { provider } from '../../config/firebase/firebaseAuthCredentials';
import LinkButton from '../helperComponents/LinkButton'
import axios from 'axios'

export default class ResetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      error : "", // misnomer, also shows the success response. 
      email : "",
    }; 
    this.resetPassword = this.resetPassword.bind(this)
  }

  resetPassword(e) {
    e.preventDefault(); 
    // replace with localhost or herokuUrl to run on heroku or locally. 
    axios.post(`https://floating-eyrie-29015.herokuapp.com/auth/login/email/reset`, {
      "email" : this.state.email, 
    })
    .then(res => this.setState({error: res.data.error} ))
    .catch(error => {
      console.error(`responded with a ${error} error`)
    })
  }

  render() {
    return (
      <View> 
        <FormInput
          autoCapitalize={"none"}
          keyboardType={'email-address'}
          autoFocus={true}
          autoCorrect={false}
          onChangeText={(text) => this.state.email = text} 
          placeholder="Enter Your Email To Reset Password"
          placeholderTextColor="#b2b1b0"
          inputStyle={{
            color: 'white', 
            textAlign: 'center'
          }}
        />

        <LinkButton
          title="Send Me Reset Password Instructions"
          clickFunction={this.resetPassword} 
        /> 
        <Text style={{
          padding: 20, 
          color: 'red', 
          fontSize: 15, 
          textAlign: 'center', 
        }}> 
          {this.state.error} 
        </Text>  
      </View> 
    )
  }
}