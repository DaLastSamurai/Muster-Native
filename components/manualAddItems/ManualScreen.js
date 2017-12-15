import React from 'react';
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
    };
    this.parseItemData = this.parseItemData.bind(this)
  }


  componentWillMount() {
    if (!this.props.sentFromButton) {this.parseItemData(this.props.itemData)}
  }

  parseItemData(data) {
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
    // console.log('this is the parsedObj in the parseItemData: ', parsedObj)
    firebase.database().ref(`items-scanned/${this.props.userObj.uid}`).push(parsedObj)
  }

  render() {
    return ( 
      <View>
        <CarouselInputFields 
          uid = {this.props.userObj.uid}
          toggleManualScreenLoaded = {this.props.toggleManualScreenLoaded}
        /> 
        <LinkButton
          title='Scan Another Item' 
          clickFunction={() => {this.props.toggleManualScreenLoaded(false)} } 
        /> 
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
