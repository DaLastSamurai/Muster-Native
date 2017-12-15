import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';
import { provider } from '../../config/firebase/firebaseAuthCredentials';
import LinkButton from '../helperComponents/LinkButton'

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
    // TODO: need to move this to the express server. 
    e.preventDefault(); 
    firebaseAuth().sendPasswordResetEmail(this.state.email.value)
      .then(() => this.setState({error : 
        `Password reset email sent to ${this.state.email.value}.`}))
      .catch(() => this.setState({error : 
        `Email Address ${this.state.email.value} not found`}))
  }

  render() {
    return (
      <View> 
        <FormInput
          autoCapitalize={"none"}
          keyboardType={'email-address'}
          autoFocus={true}
          autoCorrect={false}
          OnChangeText={(email) => this.state.email = email} 
          placeholder="Enter Your Email To Reset Password"
        />

        <LinkButton
          title="Send Me Reset Password Instructions"
          clickFunction={this.resetPassword} 
        /> 
        <Text> {this.state.error} </Text> 
      </View> 
    )
  }
}