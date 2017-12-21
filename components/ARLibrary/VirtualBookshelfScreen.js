import Expo from 'expo';
import React from 'react';
import firebase from 'firebase'
import { PanResponder, Text, View, StyleSheet} from 'react-native'
import LinkTouchableOpacity from '../helperComponents/LinkTouchableOpacity'
import * as THREE from 'three'; // 0.87.1
import ExpoTHREE from 'expo-three'; // 2.0.2
import { bookOnShelfCreator, shelfCreator, putBooksOnShelf } from './virtualBookshelfHelpers' 


console.disableYellowBox = true;

export default class VirtualBookshelfScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touching : false
    };
    this.bookOnShelfCreator = bookOnShelfCreator.bind(this)
    this.shelfCreator = shelfCreator.bind(this)
    this.putBooksOnShelf = putBooksOnShelf.bind(this)
  }

  componentWillMount() { 
    // none of this gets used, but this could potentially be the key to changing 
    // what is rendered. 
    this.touching = false;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, loc) => {
        this.setState({touching : true});
        // could add extra information about where the touch is here. 
      },
      onPanResponderRelease: () => {
        this.setState({touching : false});
      },
      onPanResponderTerminate: () => {
        this.setState({touching : false});
      },
      onShouldBlockNativeResponder: () => false,
    });
  }

  _onGLBookShelfContextCreate = async (gl) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const arSession = await this._glView.startARSessionAsync();

    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(width, height);

    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);

    // this is where the items get added. 
    let uid = this.props.userObj.uid

    await this.putBooksOnShelf(scene, gl, renderer, camera, uid, this.bookOnShelfCreator, this.shelfCreator)
  }

  render() {
    // console.log('this.state.touching', this.state.touching)
    return ( 
      <View style={{ flex: 1 }}> 
        <Expo.GLView
          {...this.panResponder.panHandlers}
          ref={(ref) => this._glView = ref}
          style={{ flex: 1 }}
          onContextCreate={this._onGLBookShelfContextCreate}
        /> 
        <View style={styles.buttonContainer}>
          <LinkTouchableOpacity
            title = "Go To Your Items"
            clickFunction = {() => this.props.navigateToScanScreen(null, 'ManualScreen')}
          /> 
          <Text style = {{ color: 'white', fontSize: 20, textAlign: 'center' }}> 
            |
          </Text> 
          <LinkTouchableOpacity
            title = "Go To Book Scanner"
            clickFunction = {() => {this.props.navigateToScanScreen(null, 'Scanner')}}
          />
        </View>  
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer : {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
  }, 
})

