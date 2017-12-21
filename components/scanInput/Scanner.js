import { BarCodeScanner, Permissions } from 'expo';
import React from 'react';
import axios from 'axios'; 
import { StyleSheet, Text, View, Alert, Dimensions } from 'react-native';
import LinkButton from '../helperComponents/LinkButton'
import LinkTouchableOpacity from '../helperComponents/LinkTouchableOpacity'
import { herokuUrl } from '../../config/serverConfig'

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null, 
      alreadyScanned : false, 
      layout: null
    };
    this.handleScan = this.handleScan.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    const layout = {
          width : Dimensions.get('window').width, 
          height : Dimensions.get('window').height
    }
    this.setState({layout})  
  }

  handleScan({type, data}) {
    // this will take whatever data is recieved from the scanner and handle it lol.
    // alert(`Bar code with type ${type} and data ${data} has been alreadyScanned!`);
    if (type === 'org.gs1.EAN-13') {
      const upcCode = data
      const uid = this.props.userObj.uid
      axios.get(`${herokuUrl}/scan/sem3/upc/${upcCode}`)
        .then(res => {
          // console.log('this is the data on handle scan', res.data)
          if (res.data.code !== "OK") {
            console.log('there was an error parsing!')
            alert(`There was an error parsing this UPC. Please try again. Fail code: ${res.status}`)
          } else if (res.data.message === "No results found; please modify your request.") {
            console.log('there were no results for the UPC!')
            Alert.alert(`There were no results for this UPC. You can still add the item manually by going to 'Your Items'`,
              "", 
              [{
                text : 'Take Me To My Items', 
                onPress: () => this.props.toggleManualScreenLoaded()
              }]
            )
          } else {
            console.log( 'item successfully scanned.')
            this.props.passItemDataToScanScreen(res.data.results[0])
            this.props.toggleManualScreenLoaded() 
          }
        })
    }
  }

  render() {
    return this.state.hasCameraPermission === null || this.state.layout === null
    ? (<View> 
        <Text>Requesting camera permission. </Text> 
        <Text> If you have scanned several items, this may take a second. </Text>
      </View>)
    
    : this.state.hasCameraPermission === false || this.state.layout === null
    ? <Text>You cannot use this feature if you do not allow camera use</Text> 
    
    : <View style={{ flex: 1 }}> 
          {/* Need to actually manually set width and height here. If you don't,
              the width will be a little off. */}
        <BarCodeScanner 
          style={{width : this.state.layout['width'], height : this.state.layout['height']}}
          
          onBarCodeRead={(obj) => {
              if (!this.state.alreadyScanned) {
                this.state.alreadyScanned = true; 
                this.handleScan(obj)
              }
            }
          }
        />
        {/* This is all just for the overlay */}
        <View style={styles.topOverlay} />
        <View style={styles.leftOverlay} />
        <View style={styles.rightOverlay} />
        <View style={styles.bottomOverlay} />
        <View style={styles.topLeftCorner} />
        <View style={styles.topRightCorner} />
        <View style={styles.bottomLeftCorner} />
        <View style={styles.bottomRightCorner} />
        
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Scan a Book Barcode
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <LinkTouchableOpacity
            title = "Go To Details Editor"
            clickFunction = {this.props.navigateToYourItems}
          /> 
          <Text style = {{ color: 'white', fontSize: 20, textAlign: 'center' }}> 
            |
          </Text> 
          <LinkTouchableOpacity
            title = "Go To Virtual Library"
            clickFunction = {this.props.navigateToVirtualBookshelf}
          />
        </View> 
      </View>
    
  }
}


const BOX_MARGIN = 30;
const BOX_SIZE = Dimensions.get('window').width - BOX_MARGIN * 2;
const BOX_TOP = Dimensions.get('window').height / 2 - BOX_SIZE / 2;
const BOX_BOTTOM = BOX_TOP + BOX_SIZE;
const BOX_LEFT = BOX_MARGIN;
const BOX_RIGHT = Dimensions.get('window').width - BOX_MARGIN;

const overlayBaseStyle = {
  position: 'absolute',
  backgroundColor: 'rgba(0,0,0,0.5)',
};

const cornerBaseStyle = {
  position: 'absolute',
  borderColor: '#fff',
  backgroundColor: 'transparent',
  borderWidth: 2,
  width: 10,
  height: 10,
};

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

  container: {
    flex: 1,
  },
  topLeftCorner: {
    ...cornerBaseStyle,
    top: BOX_TOP - 1,
    left: BOX_MARGIN - 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRightCorner: {
    ...cornerBaseStyle,
    top: BOX_TOP - 1,
    right: BOX_MARGIN - 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeftCorner: {
    ...cornerBaseStyle,
    bottom: Dimensions.get('window').height - BOX_BOTTOM - 1,
    left: BOX_MARGIN - 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRightCorner: {
    ...cornerBaseStyle,
    bottom: Dimensions.get('window').height - BOX_BOTTOM - 1,
    right: BOX_MARGIN - 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  topOverlay: {
    ...overlayBaseStyle,
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get('window').height - BOX_TOP,
  },
  leftOverlay: {
    ...overlayBaseStyle,
    top: BOX_TOP,
    left: 0,
    right: BOX_RIGHT,
    bottom: Dimensions.get('window').height - BOX_BOTTOM,
  },
  rightOverlay: {
    ...overlayBaseStyle,
    top: BOX_TOP,
    left: BOX_RIGHT,
    right: 0,
    bottom: Dimensions.get('window').height - BOX_BOTTOM,
  },
  bottomOverlay: {
    ...overlayBaseStyle,
    top: BOX_BOTTOM,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    left: 0,
  },
  headerText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
});
