import Expo from 'expo';
import React from 'react';

import * as THREE from 'three'; // 0.87.1
import ExpoTHREE from 'expo-three'; // 2.0.2

console.disableYellowBox = true;


export default class VirtualBookshelfScreen extends React.Component {

  
  bookCreator = async (scene, dimensions, imageUrl) => {
    // Edit the box dimensions here: 
    let length = dimensions[0] * .01
    let height = dimensions[1] * .01
    let width = dimensions[2] * .01

    const geometry = new THREE.BoxGeometry(length, height, width);

    const texture = await ExpoTHREE.loadAsync(imageUrl); 
    const material = new THREE.MeshBasicMaterial({ map: texture })
    
    const book = new THREE.Mesh(geometry, material);
    book.position.z = -.4;
    scene.add(book); 
  }



  _onGLContextCreate = async (gl) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const arSession = await this._glView.startARSessionAsync();

    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(width, height);

    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);

    // bookCreator takes in the scene, the dimensions (l, h, w), and the 
    // imageUrl and adds them to the ARScene. 
    this.bookCreator(scene, [5, 8, 1], 'https://i.imgur.com/mVhn1xd.jpg')

    const animate = () => {
      requestAnimationFrame(animate);

      // book.rotation.x += 0.07;
      // book.rotation.y += 0.04;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  }

  render() {
    return (
      <Expo.GLView
        ref={(ref) => this._glView = ref}
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }

}

// Helper functions: 




