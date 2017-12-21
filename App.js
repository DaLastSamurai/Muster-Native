import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { checkAuthStatus } from './components/authentication/authHelpers';
import AuthScreen from './components/authentication/AuthScreen'
import ScanScreen from './components/scanInput/ScanScreen'
import VirtualBookshelfScreen from './components/ARLibrary/VirtualBookshelfScreen'

/*
App
 \___AuthScreen 
  \__VirtualBookShelfScreen
   \_ScanScreen
      \__Scanner
       \_ManualScreen
          \_CarouselInputFields

*/
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authed: false,
      user: null,
      userObj: null, 
      virtualBookshelfLoaded: false, 
      // this is used in navigateToScanScreen to specify which component in the 
      // scanScreen you want to navigate to. 
      manualScreenLoaded: true,  
    };

    this.checkAuthStatus = checkAuthStatus.bind(this);
    this.getUserInfoFromAuth = this.getUserInfoFromAuth.bind(this)
    this.navigateToVirtualBookshelf = this.navigateToVirtualBookshelf.bind(this)
    this.navigateToScanScreen = this.navigateToScanScreen.bind(this)
  }

  componentDidUpdate() {
    // only call the checkAuthStatus if a user is not authed. 
    if (!this.state.authed) {
      this.checkAuthStatus(this.state.userObj)
      this.render() 
    }
    // calling render here makes sure that the app gets the updated user 
    // information. THIS MIGHT BECOME A PROBLEM WHEN COMPONENTS BELOW THE APP 
    // STARTS RERENDERING, triggering rerendering on app updates. 
  }

  getUserInfoFromAuth(userObj) { this.setState({userObj}) }
  navigateToVirtualBookshelf(e, virtualBookshelfLoaded = !this.state.virtualBookshelfLoaded) {
    this.setState({ virtualBookshelfLoaded })
  }

  navigateToScanScreen(e, component) {
    console.log('this is the component that got passed into the navigateToScanScreen: ', component)
    // this function gets passed to VirtualBookShelfScreen. The second argument
    // defines which component on the ScanScreen the User wants to navigate to. 
    this.setState({virtualBookshelfLoaded : false}, () => {
      if (component === 'Scanner') {
        this.setState({manualScreenLoaded : false}, console.log('this.state.manualScreenLoaded', this.state.manualScreenLoaded ))
      } else if (component === 'ManualScreen') {
        this.setState({manualScreenLoaded : true })
      } else {
        console.log(`you need to choose either 'Scanner' or ManualScreen when you 
          call navigateToScanScreen`)
      }      
    })
  }


  render() {
    console.log('the manual screen will be loaded: ', this.state.manualScreenLoaded)
    console.log('this.state.authed', this.state.authed)
    return this.state.authed && this.state.virtualBookshelfLoaded ? (
      <VirtualBookshelfScreen 
        userObj = {JSON.parse(JSON.stringify(this.state.userObj))}
        navigateToScanScreen = {this.navigateToScanScreen}
      /> 
      ) : (

      <View style = {styles.container}>
        {this.state.authed
          ? <ScanScreen 
              manualScreenLoaded = {this.state.manualScreenLoaded}
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

