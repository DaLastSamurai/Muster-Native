import React from 'react';
import { Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase'
import LinkButton from '../helperComponents/LinkButton'
import CarouselInputFields from './CarouselInputFields'
// this component takes props from ScanScreen and sets state in ScanScreen to 
// render this screen or the Scanner. 

export default class ManualScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData : null, 
      location : null, 
    };
    this.parseItemData = this.parseItemData.bind(this)
    
    // this is added to this directly so that I could make it a async function.
    this._getLocationAsync = async (cb) => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        let location = 'Permission to access location was denied'
      }
      let location = await Location.getCurrentPositionAsync({});
      // the callback here is the parseItem. setState was not working becauase of 
      // the 'this' context. Passing these as args fixes this problem. 
      cb(this.props.itemData, location);
    };
  }

  componentWillMount() {
    // this will run the parseItemData only after location data is gathered, and
    // only if the user was directed to the page after scanning an item. 
    this._getLocationAsync((data, location) => {
      if (!this.props.sentFromButton) {this.parseItemData(data, location)}
    }); 
  }

  parseItemData(data, location) {
    console.log('this is what comes into parseItemData: ', data)
    // this takes data from this.props.itemData and looks up that item in the db.
    // this data is the same format as the addItems (web client). 
    let parsedObj = {}
    parsedObj['title'] = data.name || ''
    parsedObj['author'] = data.author || data.publisher || ''
    parsedObj['subject'] = data.features.Subject || ''
    parsedObj['notes'] = data.features.blob || ''
    parsedObj['images'] = data.images || ['https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg']
    parsedObj['upc'] = data.ean || 0
    parsedObj['onlinePrice'] = data.price || ''
    parsedObj['storeLinks'] = data.sitedetails[0].latestoffers || {}
    parsedObj['timeAdded'] = Date.now()
    parsedObj['dimensionsLWH'] = (data.features['Assembled Product Dimensions (L x W x H)'] || "5.10 x 7.8 x 0.50 Inches")
      .replace('Inches', '')
      .split(' x ')
      .map(dimension => Number(dimension))
    let _geoloc = {}
    // this only sets the location if the location was correctly created. 
    if (typeof location === 'object') {
      _geoloc['lat'] = location.coords.latitude
      _geoloc['lng'] = location.coords.longitude
    } else {_geoloc['error'] = location}
    parsedObj['_geoloc'] = _geoloc

    console.log('this is what leaves parsedObj', parsedObj)

    firebase.database().ref(`items-scanned/${this.props.userObj.uid}`).push(parsedObj)
  }

  render() {
    return ( 
      <View>
        <CarouselInputFields 
          uid = {this.props.userObj.uid}
          toggleManualScreenLoaded = {this.props.toggleManualScreenLoaded}
        /> 
        <View style={styles.buttonContainer}>
          <LinkTouchableOpacity
            title = "Go To Virtual Bookshelf"
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
    )
  }
}


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   // justifyContent: 'center',
  // },
});
