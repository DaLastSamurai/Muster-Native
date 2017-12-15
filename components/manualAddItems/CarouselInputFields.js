import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Container, PickerIOS } from 'react-native';
import firebase from 'firebase'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import { FormLabel, FormInput } from 'react-native-elements'
import { Select, Option } from 'react-native-chooser';
import LinkButton from '../helperComponents/LinkButton'


export default class CarouselInputFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: null, 
      collections: null, 
      selectedCollection: null, 
      firstLoaded: false, // see renderFirst function. 
      fieldData: null, 
      fieldDataHash: null, 
    };
    // first two called on componentDidMount
    this.getItemsScannedData = this.getItemsScannedData.bind(this)
    this.getUserCollections = this.getUserCollections.bind(this)
    // this._renderItem = this._renderItem.bind(this)
    this.renderFirst = this.renderFirst.bind(this)
    this.renderInputFields = this.renderInputFields.bind(this)
    this.updateDatabase = this.updateDatabase.bind(this)

    // this is added to this directly so that I could make it a async function.
    this.saveItemToCollection = this.saveItemToCollection.bind(this)
  }

  componentDidMount() {
    this.getItemsScannedData(this.props.uid)
    this.getUserCollections(this.props.uid)
  }

  shouldComponentUpdate(next) {
    console.log('this is the next props: ', next)
    return true
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

  saveItemToCollection() {
    // 1. add {itemKey : itemData} to item. 
    // 2. add {itemKey : itemKey} to users/this.props.uid/itemIds
    // 3. add {itemKey : itemData} to collection/${this.state.selectedCollection}
    // 4. remove item at itemKey from items-scanned. 

    console.log('saveItemToCollection running')
    let itemKey = this.state.fieldDataHash
    let itemData = this.state.fieldData
    itemData['uid'] = this.props.uid

    firebase.database().ref(`item/${itemKey}`).set(itemData, () => {
      firebase.database().ref(`users/${this.props.uid}/itemIds/${itemKey}`)
      .set(itemKey, () => {
        console.log('this.state.selectedCollection.value', this.state.selectedCollection.value)
        firebase.database().ref(`collection/${this.state.selectedCollection.value}/itemId/${itemKey}`)
        .set(itemKey, () => {
          // console.log('this is not invalid')
          firebase.database().ref(`items-scanned`).child(this.props.uid)
            .child(itemKey).remove()
        })
      })
    })
  }

  getUserCollections(uid) {
    firebase.database().ref(`users/${uid}/collectionIds`).on('value', snap => {
      let collectionsObj = snap.val(); 
      let keys = Object.keys(collectionsObj)
      firebase.database().ref(`collection`).on('value', allCols => {
        let allCollections = allCols.val()
        let collections = keys.map(colId => {
          colObj = {}
          colObj['value'] = colId 
          colObj['name'] = allCollections[colId].name
          return colObj
          })
        return this.setState({ collections })
      })
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
    this.setState({fieldData})
  }

  updateDatabase(field) {
    let key = this.state.fieldDataHash
    let text = this.state.fieldData[field]
    // check to see if item still exists to prevent this from setting values when 
    // you delete an item. If the item does not exist, don't update.  
    firebase.database().ref(`items-scanned/${this.props.uid}/${key}`).on('value', snap => {
      // console.log('this is the value of the snap: ', snap.val())
      if (snap.val() !== null) {
        firebase.database().ref(`items-scanned/${this.props.uid}/${key}/${field}`)
          .set(text)
      }
    })
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
    // console.log('this.state.collections: ', this.state.collections)
    // console.log('this.state.selectedCollection: ', this.state.selectedCollection)
    // console.log('this.state.fieldData in CarouselInputFields:', this.state.fieldData, 
      // '\nthis.state.fieldDataHash in CarouselInputFields', this.state.fieldDataHash)
    return this.state.itemData === null || this.state.collections === null 
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

          <LinkButton
            title='Scan A New Item' 
            clickFunction={() => {this.props.toggleManualScreenLoaded(false)} } 
          /> 
 
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

              <View style={{flexDirection: 'row'}}>
                <Select
                  onSelect = {
                    (value, name) => {
                      let selectedCollection = {}
                      selectedCollection['value'] = value; 
                      selectedCollection['name'] = name; 
                      this.setState({ selectedCollection }) 
                    }
                  }
                  defaultText = {this.state.selectedCollection 
                    ? this.state.selectedCollection.name 
                    : "select a collection"}
                  style = {{borderWidth : 1, borderColor : "green"}}
                  // textStyle = {{}}
                  backdropStyle  = {{backgroundColor : "#d3d5d6"}}
                  optionListStyle = {{backgroundColor : "#F5FCFF"}}
                >
                  {this.state.collections
                    .map(colEl => {
                      return (
                        <Option key = {colEl.value} value = {colEl.value}> 
                          {colEl.name} 
                        </Option>
                        )
                    })
                  }
                </Select>
            
                <LinkButton
                  title='Save to Collection' 
                  clickFunction={() => {this.saveItemToCollection()} } 
                /> 
              </View>


              <Text> 
              {/* this is for the spacing at the end of the ScrollView */}
              {"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}
              </Text> 

            </ScrollView> 
            )
        }

      </View>
    ) 

    : <Text> You do not have any scanned items! </Text> 
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
