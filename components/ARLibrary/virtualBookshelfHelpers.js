import Expo from 'expo';
import React from 'react';
import firebase from 'firebase'
import * as THREE from 'three'; // 0.87.1
import ExpoTHREE from 'expo-three'; // 2.0.2

export const bookOnShelfCreator = async (scene, dimensions, maxBookHeight, coverUrl, pagesUrl, xPos) => {
  // TODO: change all of these args to a config. 
  console.log('this gets run')
  let length = dimensions[0] * .01
  let height = dimensions[1] * .01
  let width = dimensions[2] * .01

  const geometry = new THREE.BoxGeometry(width, height, length);

  const texture = await ExpoTHREE.loadAsync(coverUrl); 
  const material = new THREE.MeshBasicMaterial({ map: texture })

  const book = new THREE.Mesh(geometry, material);
  book.position.x = xPos
  book.position.y = (height/2) - ((maxBookHeight * 0.01)/2)
  book.position.z = -.3
  scene.add(book); 
}

export const shelfCreator = async (scene, dimensions, anchor) => {
  // the scene is the scene the books are on. The dimensions are in the form: 
  // [shelfLength = startXpos - endXpos, shelfDepth = maxBookDepth]. The anchor
  // is an object with the x y positions determined from the size of the books.
  shelfThickness = 0.01
  shelfLength = dimensions[0] 
  shelfDepth = dimensions[1] + 0.005 // to add bevel on the shelf. 

  const geometry = new THREE.BoxGeometry(shelfLength, shelfThickness, shelfDepth);

  const woodURL = 'https://hmp.is.it/wp-content/uploads/2013/08/empty-bookcase.jpg'
  const texture = await ExpoTHREE.loadAsync(woodURL); 
  const material = new THREE.MeshBasicMaterial({ map: texture })
  
  const shelf = new THREE.Mesh(geometry, material);

  shelf.position.x = anchor.x 
  shelf.position.y = anchor.y - (shelfThickness/2) // this will put it on the bottom of the tallest book. 
  shelf.position.z = -.3 // this is just the same as what we see

  scene.add(shelf)
}

export const putBooksOnShelf = (scene, gl, renderer, camera, uid, bookOnShelfCreator, shelfCreator) => {
  firebase.database().ref(`items-scanned/${uid}`).on('value', bookData => {
    let books = bookData.val()
    let startXPos = xPos = 0; 
    let maxBookDepth = 0; 
    let lastBookWidth = 0; 
    let maxBookHeight = Object.keys(books).reduce((acc, key) => {
      let book = books[key]
      let dimensions = book.dimensionsLWH
      return dimensions[1] > acc ? dimensions[1] : acc 
    }, 0)
    
    Object.keys(books).forEach(key => {
      let book = books[key]
      let dimensions = book.dimensionsLWH
      let width = dimensions[0]
      let height = dimensions[1]
      maxBookDepth = maxBookDepth < width ? width : maxBookDepth
      // to add different pictures for each of the sides, look to https://www.npmjs.com/package/expo-three 
      // at the end of the page. Could create a picture with the text using some library, but it would also
      // have to be the correct size do be a 'binding.'
      let pagesUrl = 'https://orig00.deviantart.net/ef42/f/2012/350/d/1/texture_book_paper_side_by_nihil_xiii-d5o6s6x.jpg' 
      let coverUrl = book.images[0]

      bookOnShelfCreator(scene, dimensions, maxBookHeight, coverUrl, pagesUrl, xPos)
      // this increments the xPos by the width of the book, plus a gap of a centimeter. 
      xPos -= ((dimensions[2] * 0.01) + 0.005)
      lastWidth = width * 0.01
    })
    let finalXPos = xPos 
    let shelfLength = startXPos - finalXPos;
    maxBookDepth = maxBookDepth * 0.01 // scale to match rest of the books. 
    let shelfAnchor = {
                        x : (shelfLength - 0.01) / -2, //
                        y : -.01 * maxBookHeight/2 // to scale it multiply by -.01
                      }

    shelfCreator(scene, [shelfLength, maxBookDepth], shelfAnchor)

    const animate = () => {
      requestAnimationFrame(animate);


      // book.rotation.x += 0.07;
      // book.rotation.y += 0.04;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  })
}


