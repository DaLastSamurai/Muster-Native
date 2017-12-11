import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
import axios from 'axios'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';
import { provider } from '../../config/firebase/firebaseAuthCredentials';

import LinkButton from '../helperComponents/LinkButton'
import ResetPassword from './ResetPassword'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error : "", 
      email : "", 
      pw : "", 
      resettingPW: false, 
    }; 
    this.handleGoogleSubmit = this.handleGoogleSubmit.bind(this)
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this)
  }

  handleGoogleSubmit(e) {
    let loginThis = this
    e.preventDefault(); 
    firebaseAuth().signInWithRedirect(provider)
      .catch(function(error) {
        loginThis.setState({error: error.toString()})
      });
  }

  handleEmailSubmit(e) {
    e.preventDefault(); 
    axios.post('http://localhost:1337/auth/login/email', {
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
        <FormLabel> Login </FormLabel>
        
        {/* This is the google authentication: */}
        <LinkButton 
          title='Login With Google' 
          clickFunction={this.handleGoogleSubmit} 
        />

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
          title='Login' 
          clickFunction={this.handleEmailSubmit} 
        />
        <Text> {this.state.error} </Text> 
        
        {!this.state.resettingPW 
          ? (<LinkButton title='Reset Password' clickFunction={() => { this.setState({resettingPW : true}) } }/>)
          : (<ResetPassword />)
        }
        <LinkButton title='Signup Page' clickFunction={this.props.loadSignupPage}/>
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  email: {
    color: '#000000', 
    justifyContent: 'center',
  },
});
