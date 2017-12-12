import Expo from 'expo'
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
import axios from 'axios'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';

import { iosClientId, emailSignInPass } from '../../config/firebase/loginWithGoogleCredentials'
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
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this)

    this._signInWithGoogle = async (e) => {
      try {
        const result = await Expo.Google.logInAsync({
          iosClientId: iosClientId,
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          console.log('this')
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
    
    this._signInWithGoogle = this._signInWithGoogle.bind(this)
  }


  handleEmailSubmit(e) {
    e ? e.preventDefault() : null ; 
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
          clickFunction={this._signInWithGoogle} 
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
