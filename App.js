import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { checkAuthStatus } from './components/authentication/authHelpers';
import AuthScreen from './components/authentication/AuthScreen'
import ScanScreen from './components/scanInput/ScanScreen'
import VirtualBookshelfScreen from './components/ARLibrary/VirtualBookshelfScreen'
// console.disableYellowBox = true; // gets rid of all warnings. 

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authed: false,
      user: null,
      userObj: null, 
      virtualBookshelfLoaded: false, 
    };

    this.checkAuthStatus = checkAuthStatus.bind(this);
    this.getUserInfoFromAuth = this.getUserInfoFromAuth.bind(this)
    this.navigateToVirtualBookshelf = this.navigateToVirtualBookshelf.bind(this)
  }

  componentDidUpdate() {
    // only call the checkAuthStatus if a user is not authed. 
    if (!this.state.authed) {
      this.checkAuthStatus(this.state.userObj)
    }
    // calling render here makes sure that the app gets the updated user 
    // information. THIS MIGHT BECOME A PROBLEM WHEN COMPONENTS BELOW THE APP 
    // STARTS RERENDERING, triggering rerendering on app updates. 
    this.render() 
  }

  getUserInfoFromAuth(userObj) { this.setState({userObj}) }
  navigateToVirtualBookshelf(virtualBookshelfLoaded = !this.state.virtualBookshelfLoaded) {
    this.setState({ virtualBookshelfLoaded })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.authed
          ? this.state.virtualBookshelfLoaded 
            ? <VirtualBookshelfScreen 
                userObj = {JSON.parse(JSON.stringify(this.state.userObj))}
              /> 
            : <ScanScreen 
                userObj = {JSON.parse(JSON.stringify(this.state.userObj))} 
                navigateToVirtualBookshelf = {this.navigateToVirtualBookshelf}
              />
            
          : <AuthScreen 
              isSigningUp = {false} 
              sendUserInfoToApp = {this.getUserInfoFromAuth}
            /> 
         }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
