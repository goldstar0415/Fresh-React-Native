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
	Animated,
	PropTypes,
	 Platform,
	} = React;
	
var MapView = require('react-native-maps');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
/***/
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
var locate_name=[];
var locate_id=[];

var Searchlocationcomponent = React.createClass({
   getInitialState: function() {

	 var context=this;

      context.getlocation("https://rivo.herokuapp.com/").then((res) => {

		  for (let i = 0; i < res.length-1; i++) {
			  locate_name.push(res[i].name);
			  locate_id.push(res[i].id);
		  }
	        console.log(locate_name);

			//context.setState({dataSource: ds.cloneWithRows((locat_items))});
        }).catch((err) => {
			console.log(err);
        });


   return {
	   unserver:false,locationstr:"",markview:false,
	   LATITUDE :11.0154863,LONGITUDE :76.9538486,searchtxt:'Search for Location',markshow:false,collapse:true,textview:true,
     }
  },

  getlocation:function(locate){
	  var context = this;
		return new Promise(function(resolve, reject) {
			var location_route = locate+"cities?activity=1";

			fetch(location_route, {
				 method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',

					}
			}).then((response) => {

			 if(response.status==200){
				var response = JSON.parse(response._bodyInit);
					return resolve(response);
			  }
			 else{
				   return reject();

			  }
			}).catch(function(err) {
				return reject();
			});
		});
  },
  onBackPress:function(){
	   this.props.navigator.push({ name: 'behome' });
	   this.props.selectedlocation(this.state.sellocation);
	   this.props.setareaname(this.state.locationstr);
	   console.log(this.state.sellocation);
	   console.log("this.state.sellocation");
  },
  onsearchlocation:function(){
	this.setState({textview:false});
  },
  marker_make :function(){
  var context=this;
	if(context.state.textview){

	   if(context.state.unserver){
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
				<View style={{height:25,justifyContent: 'center',
				alignItems:'center', }}>
					   <Text>{'Not servailable'}</Text>
				   </View>
			  </View>
			);
	   }
		else{
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
		}


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
					console.log(data['description']);
					console.log( data['description'].search('India'));
					console.log(details);
					var context=this;
					this.setState({textview:true});

					console.log(details['name']);
					var areaname=details['name'];

					var res_name = areaname.toUpperCase();
					console.log(res_name);


					//console.log(details['address_components'][4]['long_name']);
					//var country=details['address_components'][4]['long_name'];

					this.setState({markview:false});
					this.setState({unserver:true});
					this.setState({locationstr:data['']});
					for (var i=0;i<locate_name.length;i++){
						if(res_name.search(locate_name[i])!=-1 && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				            this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							this.setState({locationstr:data['description']});
							this.setState({sellocation:locate_id[i]});

								break;
						}
						else if(locate_name[i].search(res_name)!=-1 && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				            this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							console.log('address_components');
							this.setState({locationstr:data['description']});
							this.setState({sellocation:locate_id[i]});
								break;
						}
						else if(locate_name[i]==res_name && data['description'].search('India')!=-1){
							this.setState({LATITUDE:details['geometry']['location']['lat']});
  				            this.setState({LONGITUDE:details['geometry']['location']['lng']});
							this.setState({unserver:false});
							this.setState({markview:true});
							this.setState({locationstr:data['description']});
							this.setState({sellocation:locate_id[i]});
							break;
						}

					}
					   if(this.state.markview)
						  this.onBackPress();

					   this.setState({collapse:false});

					  }}
					getDefaultValue={() => {
					  return ''; // text input default value
					}}
					query={{
					  // available options: https://developers.google.com/places/web-service/autocomplete
					  key: 'AIzaSyBO3Jc2pDHH1NunQTridZJuqDX2vPgCAy4',
					  language: 'en', // language of the results
					  types: 'geocode', // default: 'geocode',

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
onRegionChange:function(region) {
  this.state.region.setValue(region);
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
			/>);
	}
	else{


	}
},
  render: function() {
	     var iiivree=this.marker_make();
         return (

		  <View style={styles.container}>


            <View style={styles.header_havbar}>

				 <View style={styles.left_navbar}>
                   <TouchableOpacity  onPress={this.onBackPress}>
					 <Text></Text>
				   </TouchableOpacity>

				  </View>
				   <View style={styles.center_navbar}>
					 <Text style={{color:'#f47239',fontSize:20}}>{'Enter your location'}</Text>
				   </View>

				   <View style={styles.right_navbar}>
					 <Text>{''}</Text>
				   </View>
			</View>
		  <View style={{flex:1,flexDirection:'column'}}>


			     <View style={{flex:.80}} >
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
				 >

					{this.make_mark()}
					</MapView>
				  </View>


				 </View>

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

})

AppRegistry.registerComponent('Searchlocationcomponent', () => Searchlocationcomponent);
module.exports = Searchlocationcomponent;
