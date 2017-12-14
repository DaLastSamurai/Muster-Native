import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import firebase from 'firebase'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'

import LinkButton from '../helperComponents/LinkButton'


export default class CarouselInputFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: null, 
    };
    this.renderInputFields = this.renderInputFields.bind(this)
    this.getItemsScannedData = this.getItemsScannedData.bind(this)
    // this._renderItem = this._renderItem.bind(this)
  }


  componentWillMount() {
    this.getItemsScannedData(this.props.uid)
  }

  getItemsScannedData(uid) { 
    firebase.database().ref(`items-scanned/${uid}`).on('value', (snap) => {
      let itemObj = snap.val() 
      let itemData = []
      // want an array of objects. Need to convert from what firebase has (object with keys)
      Object.keys(itemObj).map(key => {
        let tempObj = {}
        tempObj[key] = JSON.parse(JSON.stringify(itemObj[key]))
        itemData.push(tempObj)
      })
      this.setState({ itemData })
    })
  }

  renderInputFields(data) {
    console.log('this is what is passed to renderInputFields: ', data)
  }


  // this is used for the rendering of different items. 
  _renderItem ({item, index}) {
    // console.log('this is what gets passed to _renderItem: ', item)
    let itemData = item[Object.keys(item)[0]]
    console.log('this is the itemData in _renderItem: ', itemData)
    return (
        <View>
          <Text> 
            {itemData.title.split('').reverse().slice(itemData.title.length - 15)
              .reverse().join('')} 
            </Text> 
          <Image 
            source={{uri : itemData.images[0] || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}}
            style={{height: 120, width: 120}}
            parallaxFactor={0.4}
          /> 
        </View>
    );
  }


  render() {
    // console.log('this is the itemData in CarouselInputFields: ', this.state.itemData)
    return this.state.itemData === null 
    ? <Text> Loading Your Items </Text> 

    : this.state.itemData.length > 0
    ? ( 
      <View>
        <Text> The Carousel should be displaying </Text> 
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.itemData}
          renderItem={this._renderItem}
          sliderWidth={400}
          itemWidth={120}
          enableMomentum={true}
          sliderHeight={300}
          onSnapToItem={this.renderInputFields}
        />


        {/* these are the input fields 
        <ScrollView

        /> 
        */}
  

      </View>
    ) 

    : <Text> You have not scanned any items yet! </Text> 
  }
}

const horizontalMargin = 20;
const slideWidth = 280;

const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 200;

const entryBorderRadius = 8;

const styles = StyleSheet.create({
    slide: {
        width: itemWidth,
        height: itemHeight,
        paddingHorizontal: horizontalMargin
        // other styles for the item container
    },
    slideInnerContainer: {
        width: slideWidth,
        flex: 1
        // other styles for the inner container
    },
    image: {
      // ...StyleSheet.absoluteFillObject,]

      borderRadius: entryBorderRadius,
      borderTopLeftRadius: entryBorderRadius,
      borderTopRightRadius: entryBorderRadius
    },
})
