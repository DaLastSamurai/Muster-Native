import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
import axios from 'axios'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
// import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';
import { provider } from '../../config/firebase/firebaseAuthCredentials';
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
    this.handleGoogleSubmit = this.handleGoogleSubmit.bind(this)
  }

  handleGoogleSubmit(e) {
    console.log('that is getting run')
    // var dat = this
    e.preventDefault(); 
    // firebaseAuth().signInWithRedirect(provider)
    //   .catch(function(error) {
    //     dat.setState({error: error.toString()})
    //   });
  }

  handleEmailSubmit(e) {
    e.preventDefault()
    axios.post('http://localhost:1337/auth/signup/email', {
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
          title='Signup With Google' 
          clickFunction={this.handleGoogleSubmit} 
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