import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Container } from 'react-native';
import firebase from 'firebase'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import { FormLabel, FormInput } from 'react-native-elements'
import LinkButton from '../helperComponents/LinkButton'


export default class CarouselInputFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoaded : false, // see renderFirst function. 
      itemData: null, 
      fieldData: null, 
      fieldDataHash: null, 
    };
    this.getItemsScannedData = this.getItemsScannedData.bind(this)
    // this._renderItem = this._renderItem.bind(this)
    this.renderFirst = this.renderFirst.bind(this)
    this.renderInputFields = this.renderInputFields.bind(this)
    this.updateDatabase = this.updateDatabase.bind(this)
    this.saveItemToUsersItems = this.saveItemToUsersItems.bind(this)
  }

  componentWillMount() {
    this.getItemsScannedData(this.props.uid)
  }

  getItemsScannedData(uid) { 
    // this runs in componentWillMount(). It gets the initial scanned data, 
    // including the barcode that was just scanned (if sendingFromButton in 
    // ManualScreen is false).
    firebase.database().ref(`items-scanned/${uid}`).on('value', (snap) => {
      let itemObj = snap.val() 
      let itemData = []
      // want an array of objects. Need to convert from what firebase has (object with keys)
      Object.keys(itemObj).map(key => {
        let tempObj = {}
        tempObj[key] = JSON.parse(JSON.stringify(itemObj[key]))
        itemData.push(tempObj)
      })
      itemData.sort((a, b) => a.timeAdded - b.timeAdded)
      this.setState({ itemData })
    })
  }

  renderFirst() {
    console.log('THIS IS GETTING RUN !!!!!!!!!!!!!!!!!')
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
    this.setState({fieldData})
  }

  updateDatabase(field) {
    let key = this.state.fieldDataHash
    let text = this.state.fieldData[field]
    firebase.database().ref(`items-scanned/${this.props.uid}/${key}/${field}`)
      .set(text)
  }

  saveItemToUsersItems() {

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
    console.log('this.state.fieldData in CarouselInputFields:', this.state.fieldData, 
      '\nthis.state.fieldDataHash in CarouselInputFields', this.state.fieldDataHash)
    return this.state.itemData === null 
    ? <Text> Loading Your Items </Text> 

    : this.state.itemData.length > 0
    ? ( 
      <View>
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
  {/*
        <Container> 
          <LinkButton
            title='Scan A New Item' 
            clickFunction={() => {this.props.toggleManualScreenLoaded(false)} } 
          /> 

          <LinkButton
            title='Add to Your Collection'
            clickFunction={() => {this.saveItemToUsersItems}}
          /> 
        </Container>  

  */}
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
                onChangeText = {text => this.updateState(text, 'title')}
                onEndInput = {this.updateDatabase('title')}
                placeholder = {'Title'}
                value = {this.state.fieldData.title}
              /> 

              <FormLabel>Subject</FormLabel>
              <FormInput 
                onChangeText = {text => this.updateState(text, 'subject')}
                onEndInput = {this.updateDatabase('subject')}
                placeholder = {'Subject'}
                value = {this.state.fieldData.subject}
              /> 

              <FormLabel>Price (Default is Best Online Price)</FormLabel>
              <FormInput 
                onChangeText = {text => this.updateState(text, 'onlinePrice')}
                onEndInput = {this.updateDatabase('onlinePrice')}
                placeholder = {'Online Price'}
                value = {this.state.fieldData.onlinePrice}
              /> 

              <FormLabel>Notes</FormLabel>
              <FormInput 
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
