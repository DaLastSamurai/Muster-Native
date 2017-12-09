import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthScreen from './components/authentication/AuthScreen'
import { checkAuthStatus } from './components/authentication/authHelpers';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authed: false,
      user: null,
    };
    this.checkAuthStatus = checkAuthStatus.bind(this);
  }

  componentWillMount() {
    this.checkAuthStatus()
  }


  render() {

    return (
      <View style={styles.container}>
        {this.state.authed 
          ? <Text>This is what an Authenticated User Sees</Text>
          : <AuthScreen isSigningUp = {false}/> 
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
