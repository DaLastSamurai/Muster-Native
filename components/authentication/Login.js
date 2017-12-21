import Expo from 'expo'
import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Keyboard } from 'react-native';
import firebase from 'firebase'
import axios from 'axios'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { firebaseAuth, users} from '../../config/firebase/firebaseCredentials';

import { herokuUrl, localhost } from '../../config/serverConfig.js'
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
    
    this._signInWithGoogle = this._signInWithGoogle.bind(this)
  }


  handleEmailSubmit(e, createdWithOAuth) {
    // e ? e.preventDefault() : null ; 
    // replace with localhost or herokuUrl to run on heroku or locally. 
    axios.post(`${herokuUrl}/auth/login/email`, {
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
    .catch(res => console.log('there was an error: ', res))
    
  }

  render() {
    return (
      <View> 
        <View style={{
          position: 'absolute', 
          backgroundColor: 'rgba(0,0,0,0.1)'
        }} /> 
        <View style={styles.formContainer}> 
          <Text>     </Text> 
          
          {/* This is the google authentication: */}

          <LinkButton 
            title='Login With Google' 
            clickFunction={this._signInWithGoogle} 
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
              placeholderTextColor="#b2b1b0"
              placeholder="Email Address"
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
              placeholderTextColor="#b2b1b0"
              onChangeText={(pw) => this.state.pw = pw} 
              inputStyle={{
                color: 'white', 
                textAlign: 'center'
              }}
            />

            <LinkButton 
              title='Login With Email' 
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
            
            {!this.state.resettingPW 
              ? (<LinkButton title='Reset Password' clickFunction={() => { this.setState({resettingPW : true}) } }/>)
              : (<ResetPassword />)
            }

          <View style={{
            position: 'absolute', 
            bottom: 10, 
            left: Dimensions.get('window').width/2
          }}> 
            <LinkButton 
              title='Signup Page' 
              clickFunction={this.props.loadSignupPage}
            />
          </View> 
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
  textInputContainer: {
    height: 160,
    width: (Dimensions.get('window').width * .68),
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    color: 'white', 
    fontSize: 20, 
    height: 80,
    fontSize: 20,
    borderRadius: 20, 
  },

});
