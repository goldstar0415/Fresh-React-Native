"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/18/16
 Author:
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/18/16               TaskNumber          Created
 ==================================================================================
 */
var React = require('react-native');
var {NativeModules} = require('react-native');
var server_auth = require('./server_auth');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
	Image,
	ScrollView,
	TouchableOpacity,
	DrawerLayoutAndroid,
	ListView,
	TouchableHighlight,
} = React;

var MapView = require('react-native-maps');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
/***/
var locate_name=['ONDIPUDUR','VASANTHAMILL','NEELIKONAMPALAYAM','SINGANALLUR','UPPILIPALAYAM','RAMANATHA PURAM','NANJUNDAPURAM'
,'SOWRIPALYAM','PULIYAKULAM','OLAMBUS','SUNGAM','TOWNHALL','SELVAPURAM','TELUNGUPALAYA',
'KUNIYAMUTHUR','KALAVAI','ATHUPALAM','SUNDARAPURAM','KURUCHI','KARUMBUKADAI','UKKADAM','HOPES',
'THANEER PANTHAL','MASAKALIPALAYAM','PEELAMEDU','NAVA INDIA','AVARAMPALYAM','LAKSHMI MILLS','ANNA SILAI','PAPANAIKAM PALAYAM',
'RACE COURSE','SAIBABA COLONY','BARATHI PARK','NORTH COIMBATORE','POOMARKET','LOLLY ROAD','RS.PURAM','GANDHI PARK','SUKRAVAR PETTAI',
'GANAPATHY','SANGANOOR','SIDHAPUDUR','RATHINAPURI','TATABAD','GANDHIPURAM','NANJAPA ROAD','VOC','R.S. PURAM'
];

var DelivertoComponent = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var context=this;

    return {
      unserver:false,locationstr:"",markview:false,
      LATITUDE :11.0154863,LONGITUDE :76.9538486,searchtxt:'Search for Location',markshow:false,collapse:true,textview:true,
    }
  },

  onsubmitpress: function(){
	  var context = this;
	  console.log("submit");
	  context.password_recovery("https://rivo.herokuapp.com/", this.state.phone).then((res) => {
           //	context.props.setState.user_inf	=res;
			context.setState({error1:"555"});
      context.drawer.closeDrawer();
    }).catch((err) => {
		  context.setState({error1:"no user with such phone registered"});
    });
  },

  onBackPress:function(){
    this.props.navigator.pop();
  },

  onPlaceorder:function(){
    this.props.navigator.push({ name: 'ordersummary' });
  },

  onsearchlocation:function(){
	this.setState({textview:false});
},

  marker_make :function(){
  var context=this;
	if(context.state.textview){
	  //  if(context.state.unserver){
		// 	return(
		// 	  <View style={{flexDirection:'column'}}>
		// 		<View style={styles.search_bar}>
		// 		 <TouchableOpacity  onPress={this.onsearchlocation}>
		// 			<Text style={{color: (this.state.searchtxt=='Search for Location')?'#CCC':'#f47239',fontSize:15}}>{this.state.searchtxt}</Text>
		// 		 </TouchableOpacity>
		// 			<Image
		// 				style={{width:20,height:20,padding:1,left:10,right:2,}}
		// 				source={require('../images/search.png')}
		// 				/>
		// 		</View>
		// 		<View style={{height:25,justifyContent: 'center',
		// 		alignItems:'center', }}>
		// 			   <Text>{'Not servailable'}</Text>
		// 		   </View>
		// 	  </View>
		// 	);
	  //  }
		// else{
			return(
			  <View style={{flexDirection:'column'}}>
				<View style={styles.search_bar}>
				 <TouchableOpacity  onPress={this.onsearchlocation}>
					<Text style={{color: (this.state.searchtxt=='Search for Location')?'#CCC':'#f47239',fontSize:15}}>{this.state.searchtxt}</Text>
				 </TouchableOpacity>
					<Image
						style={{width:20,height:20,padding:1,left:10,right:2,}}
						source={require('../images/search.png')}
						/>
				</View>
			  </View>
			);
		// }
	}
	else{
		return(
		<View style={{height: 230}}>
		  <GooglePlacesAutocomplete
					placeholder='Search'
					minLength={2} // minimum length of text to search
					autoFocus={false}
					fetchDetails={true}

					onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
					// console.log(data['description']);
					// console.log( data['description'].search('India'));
					// console.log(details);

					this.setState({textview:true});
          //
					// console.log(details['name']);
					var areaname=details['name'];
          //
					var res_name = areaname.toUpperCase();
					// console.log(res_name);
          //
					// //console.log(details['address_components'][4]['long_name']);
					//var country=details['address_components'][4]['long_name'];
					 var newregion={
						latitude: this.state.LATITUDE,
						longitude: this.state.LONGITUDE,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA,
					}
					//   console.log(newregion);
					this.setState({region:newregion});
					this.setState({unserver:true});
					this.setState({locationstr:data['']});
					for (var i=0;i<locate_name.length;i++){
						if(res_name.search(locate_name[i])!=-1 && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				    this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							this.setState({locationstr:data['description']});

					// // 		console.log('address_components');
							break;
						}
						else if(locate_name[i].search(res_name)!=-1 && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				    this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							console.log('address_components');
							this.setState({locationstr:data['description']});
							break;
						}
						else if(locate_name[i]==res_name && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				            this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							console.log('address_components');
							this.setState({locationstr:data['description']});
							break;
						}
					}

					this.setState({collapse:false});
					  }}
					getDefaultValue={() => {
					  return ''; // text input default value
					}}
					query={{
					  // available options: https://developers.google.com/places/web-service/autocomplete
					  // key: 'AIzaSyBO3Jc2pDHH1NunQTridZJuqDX2vPgCAy4',
            // key: 'AIzaSyD14dPBCj7Gtbq1iVjL6SkC8ADyBHcbHwc',
            key: 'AIzaSyCxZObnVTj0mIE9Z9fjAO7WhtWWgz1susY',
					  language: 'en', // language of the results
					  types: 'geocode', // default: 'geocode',
					  country: 'russia',
					}}
					styles={{
					  description: {
						fontWeight: 'bold',
					  },
					  predefinedPlacesDescription: {
						color: 'green',
					  },
					}}

					currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
					currentLocationLabel="Current location"
					nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
					GoogleReverseGeocodingQuery={{

					 // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
					}}
					GooglePlacesSearchQuery={{
					  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
					  rankby: 'distance',
					  types: 'food',
					}}


					filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

					predefinedPlaces={[]}

					predefinedPlacesAlwaysVisible={true}
				  />
				</View>
		);
	}
},

make_mark:function(){
	var context=this;
	if(context.state.markview){

		return(
	    <MapView.Marker
  			coordinate={{
  			  latitude: this.state.LATITUDE + SPACE,
  			  longitude: this.state.LONGITUDE + SPACE,
  			}}
  			centerOffset={{ x: -18, y: -60 }}
  			anchor={{ x: 0.69, y: 1 }}
  			image={require('../images/flag-blue.png')}
  		/>
    );
	}else{
    return(
      <MapView.Marker
  			coordinate={{
  			  latitude: this.state.LATITUDE + SPACE,
  			  longitude: this.state.LONGITUDE + SPACE,
  			}}
  			centerOffset={{ x: -18, y: -60 }}
  			anchor={{ x: 0.69, y: 1 }}
  			image={require('../images/flag-blue.png')}
  		/>
    );
	}
},

onRegionChange(region) {
	console.log(region);
  this.setState({ region });
},
  render: function() {
	     var iiivree=this.marker_make();
         return (

		  <View style={styles.container}>
            <View style={styles.header_havbar}>

				 <View style={styles.left_navbar}>
				   <TouchableOpacity  onPress={this.onBackPress}>
					 <Image style={styles.Menu_btn} source={require('../images/back.png')}></Image>
				   </TouchableOpacity>
				  </View>
				   <View style={styles.center_navbar}>
					 <Text style={{color:'#f47239',fontSize:20}}>{'Deliver to'}</Text>
				   </View>

				   <View style={styles.right_navbar}>
					 <Text>{''}</Text>
				   </View>
			</View>
		  <View style={{flex:.75,flexDirection:'column'}}>
			     {iiivree}

			     <View style={{flex:.80}} >
				   <MapView
					  ref="map"
					  style={styles.map}
					  initialRegion={{
						latitude: this.state.LATITUDE,
						longitude: this.state.LONGITUDE,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA,
					  }}
					region={this.state.region}

					  >

					{this.make_mark()}
					</MapView>
				  </View>
			 </View>
			 <View style={{flex:.25,backgroundColor:'#FFF',flexDirection: 'column',}}>
			   <View style={{flex:.30,flexDirection: 'row',paddingLeft:15}}>
			      <Image style={{width:30,height:30,marginLeft:20,right:15,top:10}} source={require('../images/deliver_home.png')}/>
                    <TextInput
                        style={{ alignItems: 'flex-end',width:270,height:45,padding:3}}
                        placeholder="Mobile number"
                        placeholderTextColor="#d6d4d4"
					              value={this.state.mobilenumber}
                        onChangeText={(text) => this.setState({mobilenumber:text})}
                    />
				</View>
				<View style={{flex:.30}}>
				   <TextInput

                        style={{ left:65,alignItems: 'flex-end',width:270,height:45,padding:3}}
                        placeholder="Door number"
                        placeholderTextColor="#d6d4d4"
					     value={this.state.doornumber}
                        onChangeText={(text) => this.setState({doornumber:text})}
                    />
				</View>
				<View style={{flex:.40}}>
				   <Text style={{ left:65,width:270,height:45,padding:3,top:15,fontSize:13,paddingBottom:10,}}
                   >{this.state.locationstr}</Text>
				</View>
			 </View>
			 <View style={{backgroundColor:'#f47239',flex:.10, justifyContent: 'center',alignItems:'center',}}>
			    <TouchableOpacity  onPress={this.onPlaceorder}>
			      <Text style={{fontSize:15,color:'#FFF',fontWeight:'bold'}}>{'Proceed to Payment'}</Text>
			   </TouchableOpacity>
			 </View>
          </View>

         );
  },
});

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    header_havbar: {
        flexDirection: 'row',
		height:53,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderBottomColor: '#CCC',

     },
	left_navbar:{
		flex:.15,
		justifyContent: 'center',
		alignItems:'center',

	},
	right_navbar:{
		flex:.15,
		justifyContent: 'center',
		alignItems:'center',
	},
	Menu_btn:{
	  width: 20,
	  height: 15,
	  marginLeft:20,
	},
		text: {
    flex: 1,
    fontSize:12,
    color:'#f47239',
   },
	 center_navbar:{
		paddingLeft:40,
		paddingRight:40,
		flexDirection:'row',
		flex:.70,
		justifyContent: 'center',
		alignItems:'center',
	 },
	 search_bar:{
		height:30,
		backgroundColor: '#FFF',
		//borderBottomColor: '#CCC',
		justifyContent: 'center',

		flexDirection: 'row',

		borderColor:'red',

	 },
	 search_input:{
        right:0,
        height: 40,
        fontSize: 13,
	    left:18,
		width:250,
	 },
	  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
	   inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent',
	    height:50,

    },
})

AppRegistry.registerComponent('DelivertoComponent', () => DelivertoComponent);
module.exports = DelivertoComponent;
