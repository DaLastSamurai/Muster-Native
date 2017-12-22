import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Container, PickerIOS } from 'react-native';
import firebase from 'firebase'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import { FormLabel, FormInput } from 'react-native-elements'
import { Select, Option } from 'react-native-chooser';

import LinkButton from '../helperComponents/LinkButton'
import LinkTouchableOpacityBlack from '../helperComponents/LinkTouchableOpacityBlack'
import LoadingPage from '../helperComponents/LoadingPage'

console.disableYellowBox = true;

export default class CarouselInputFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: null, 
      firstLoaded: false, // see renderFirst function. 
      fieldData: null, 
      fieldDataHash: null, 
    };

    this.getItemsScannedData = this.getItemsScannedData.bind(this)
    this.renderFirst = this.renderFirst.bind(this)
    this.renderInputFields = this.renderInputFields.bind(this)
    this.updateDatabase = this.updateDatabase.bind(this)
  }

  componentWillMount() {
    this.getItemsScannedData(this.props.uid)
  }

  getItemsScannedData(uid) { 
    // this runs in componentWillMount(). It gets the initial scanned data, 
    // including the barcode that was just scanned (if sendingFromButton in 
    // ManualScreen is false).
    firebase.database().ref(`items-scanned/${uid}`).on('value', (snap) => {
      if (snap.val() !== null) {
        let itemObj = snap.val() 
        let itemData = []
        // want an array of objects. Need to convert from what firebase has (object with keys)
        Object.keys(itemObj).map(key => {
          let tempObj = {}
          tempObj[key] = JSON.parse(JSON.stringify(itemObj[key]))
          itemData.push(tempObj)
        })
        itemData.sort((a, b) => b.timeAdded - a.timeAdded)
        this.setState({ itemData })
      } else {
        this.setState({ itemData : [] })
      }
    })
  }

  renderFirst() {
    // This runs several times (onLayout seems to run every two or three items), 
    // to make it so that it only runs to render the first item, the below flag is set.
    this.setState({firstLoaded : true})
    let fieldDataHash = Object.keys(this.state.itemData[0])[0]
    let fieldData = this.state.itemData[0][fieldDataHash]
    this.setState({fieldDataHash, fieldData})
  }

  renderInputFields(idx) {
    // this populates fieldData state which determine what is rendered in the
    // input fields. It is called every time someone snaps to a new item in the 
    // carousel. 
    let fieldDataHash = Object.keys(this.state.itemData[idx])[0]
    let fieldData = this.state.itemData[idx][fieldDataHash]
    this.setState({ fieldDataHash, fieldData }) 
  }

  updateState(text, field) {
    let fieldData = JSON.parse(JSON.stringify(this.state.fieldData))
    fieldData[field] = text
    this.setState({ fieldData })
  }

  updateDatabase(field) {
    let key = this.state.fieldDataHash
    let text = this.state.fieldData[field]
    firebase.database().ref(`items-scanned/${this.props.uid}/${key}/${field}`)
      .set(text)
  }

  // this is used for the rendering of different items. 
  _renderItem ({item, index}) {
    let itemData = item[Object.keys(item)[0]]
    return (
      <View>
        <Image 
          source={{uri : itemData.images[0] || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}}
          style={{height: 120, width: 120}} // the width needs to be the same as the 'item width '
          parallaxFactor={0.4}
        /> 
      </View>
    );
  }


  render() {
    // console.log('this.state.itemData: ', this.state.itemData, 'this.state.collections: ', this.state.collections)
    // waits to render carousel until itemData and collections is loaded. 
    return this.state.itemData === null 
    ? <LoadingPage loadingText={"Loading Your Items"} /> 

    : this.state.itemData.length > 0
    ? ( 
      <View style={{padding : 5}}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.itemData}
          renderItem={this._renderItem}
          sliderWidth={400}
          itemWidth={120}
          enableMomentum={true}
          sliderHeight={300}
          onSnapToItem={this.renderInputFields}
          onLayout={!this.state.firstLoaded ? this.renderFirst : () => {}}
        />

        <View style={styles.buttonContainer}>
          <LinkTouchableOpacityBlack
            title = "Virtual Bookshelf"
            clickFunction = {() => {this.props.navigateToVirtualBookshelf()}}
          /> 
          <Text style = {{ color: 'white', fontSize: 20, textAlign: 'center' }}> 
            |
          </Text> 
          <LinkTouchableOpacityBlack
            title = "Book Scanner"
            clickFunction = {() => {this.props.toggleManualScreenLoaded(false)}}
          />
        </View> 
 
        {this.state.fieldData === null 
          ? <Text> Loading Your Data </Text> 
          : (          
            <ScrollView
              // overScrollMode = {'always'}
              keyboardDismissMode = {'on-drag'}
              contentInset={{bottom:49}}
            > 
            
              <FormLabel>Title</FormLabel>
              <FormInput 
                returnKeyType={'done'}
                onChangeText = {text => this.updateState(text, 'title')}
                onEndInput = {this.updateDatabase('title')}
                placeholder = {'Title'}
                value = {this.state.fieldData.title}
              /> 

              <FormLabel>Subject</FormLabel>
              <FormInput 
                returnKeyType={'done'}
                onChangeText = {text => this.updateState(text, 'subject')}
                onEndInput = {this.updateDatabase('subject')}
                placeholder = {'Subject'}
                value = {this.state.fieldData.subject}
              /> 

              <FormLabel>Price (Default is Best Online Price)</FormLabel>
              <FormInput 
                returnKeyType={'done'}
                onChangeText = {text => this.updateState(text, 'onlinePrice')}
                onEndInput = {this.updateDatabase('onlinePrice')}
                placeholder = {'Online Price'}
                value = {this.state.fieldData.onlinePrice}
              /> 

              <FormLabel>Notes</FormLabel>
              <FormInput 
                returnKeyType={'done'}
                onChangeText = {text => this.updateState(text, 'notes')}
                onEndInput = {this.updateDatabase('notes')}
                placeholder = {'Notes'}
                value = {this.state.fieldData.notes}

                multiline = {true} 
                numberOfLines = {4000}
              /> 

              <Text> 
              {/* this is for the spacing at the end of the ScrollView */}
              {"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}
              </Text> 

            </ScrollView> 
            )
        }

      </View>
    ) 

    : (
      <View style = {{flex: 1, justifyContent: 'center'}}> 
        <Text> You do not have any scanned items! </Text> 
        <View style={styles.buttonContainer}>
          <LinkTouchableOpacityBlack
            title = "Scan A Book"
            clickFunction = {() => {this.props.toggleManualScreenLoaded(false)}}
          />
        </View> 
      </View> 
      )
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
  },
  slideInnerContainer: {
      width: slideWidth,
      flex: 1
  },
  image: {
    borderRadius: entryBorderRadius,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  buttonContainer : {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  }, 
  emptyItemsButtonContainer : {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    height : 5
  }
})
