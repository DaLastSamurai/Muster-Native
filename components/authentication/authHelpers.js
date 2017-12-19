import { firebaseAuth, users } from '../../config/firebase/firebaseCredentials';
import firebase from 'firebase'

// this is used in the app.js to check to see if there is a userObj signed in. 
// this function is wrapped in an if statement in the componentDidUpdate where
// it should only update if authed === false. 

export const checkAuthStatus = function(userObj) {
  console.log('checkAuthStatus called!')
  if (userObj) {
    this.setState({
      authed: true,
      userObj: userObj,
    }, () => {
      firebase.database().ref(`/users/${userObj.uid}/defaultsSet`).on('value', 
        (snapshot) => {
        // if the defaults have not been set (the user is signing up): 
        if (!snapshot.val()) { 
          // set defaults:
          let basicInfo = {
            email: userObj.email, 
            isPaiduser: false, 
          }
          let profileInfo = {
            profilePhoto: 'http://bit.ly/2BoCV0Y', 
            bio: 'no profile bio yet', 
            following: ['RKBeM50YH3VBRY6Io8UUL8eojPo1'], // =seamus lol 
            followers: ['RKBeM50YH3VBRY6Io8UUL8eojPo1'], // =seamus lol 
            username : userObj.email, 
          }
          let updates = {};
          updates[userObj.uid + '/defaultsSet'] = true; 
          updates[userObj.uid + '/profileInfo'] = profileInfo
          updates[userObj.uid + '/info'] = basicInfo;
          return users.update(updates)
        }
      })
    })
  } else {
    this.setState({
      authed : false,
      userObj : null,
    })
  }
}