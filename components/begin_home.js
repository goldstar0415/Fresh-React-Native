"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/10/16
 Author:            Osipe
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/13/16     Osipe          TaskNumber          Created
 ==================================================================================
 */

var React = require('react-native');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ToolbarAndroid,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  Navigator,
  DrawerLayoutAndroid,
  ScrollView,
  Animated

} = React;

var {NativeModules} = require('react-native');
var FBLogin = require('react-native-facebook-login');
var server_auth = require('./server_auth');
var FBLoginManager = NativeModules.FBLoginManager; // if needed
var Todaymenu = require('./todaymenu');
var Chiken = require('./chiken');
var Collapsible = require('react-native-collapsible');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var nav;
// var GridView = require('react-native-grid-view');
var ROUTES = {
  first: Todaymenu,
  second:Chiken,
  //third:Mute,
  //forth:Fish,
 // fifth:Egg,
};

var Swiper = require('react-native-swiper');

var Beginhomecomponent = React.createClass({

  getInitialState: function() {
	   var context=this;
       var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		 context.getlocation("https://rivo.herokuapp.com/").then((res) => {
		 context.setState({locationlist:res})

			//var firstlocatname=res[0].name;
			//var firstlocatid=res[0].id;

		    context.setState({locationname:context.props.areaname});

	      var locat_items=[];
			for (let i = 0; i < res.length-1; i++) {
			//  locat_items.push(res[i].name);
			}
	       //context.setState({dataSource: ds.cloneWithRows((locat_items))});


        }).catch((err) => {
			console.log(err);
			//context.setState({error1:"no user with such phone registered"});
        });

		context.getfoodimages();
        return {login_required:true,
		image_url:[],
		cartnum:0,
		flagmenu:false,
		locationname:'Select Area...',
		dataSource: ds.cloneWithRows({}),
		loadview:true,
		catydatasource: null,
		keynum:0,
		};
  },
  getlocation:function(locate){
	  var context = this;
		return new Promise(function(resolve, reject) {
			var location_route = locate+"cities/"+context.props.ourlocateid+"?include[]=areas";

			fetch(location_route, {
				 method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',

					}
			}).then((response) => {

			 if(response.status==200){
				var response = JSON.parse(response._bodyInit);
					return resolve(response['areas']);
			  }
			 else{
				   return reject();

			  }
			}).catch(function(err) {
				return reject();
			});
		});
  },
  getfoodimages : function(){
	  var context=this;
	 if(context.props.firstlocatid==undefined)
		var apiurl="https://rivo.herokuapp.com/products?city_id="+1;
	 else
		var apiurl="https://rivo.herokuapp.com/products?city_id="+context.props.firstlocatid;



	  context.getdata(apiurl).then((res) => {

			 var response = JSON.parse(res._bodyInit);

			  context.setState({image_count:response.length});
			 var imageurl=[];
			  for (var i=0;i<response.length;i++){
				  imageurl.push(response[i].image_url);
			  }

			  context.setState({image_url:imageurl});
			  context.getcategories();


        }).catch((err) => {
			console.log(err);
			//context.setState({error1:"no user with such phone registered"});
        });
  },
  getcategories:function(){
	    var context=this;
	 //if(context.props.firstlocatid==undefined)
		var apiurl="https://rivo.herokuapp.com/categories";
	// else
	//	var apiurl="https://rivo.herokuapp.com/products?city_id="+context.props.firstlocatid;

	 // var apiurl="https://rivo.herokuapp.com/products?city_id="+1;

	  context.getdata(apiurl).then((res) => {

			 var response = JSON.parse(res._bodyInit);
			 var imageurl=[];
			 var imageurl1=[];
			 var oldid='';
			 var oldimageurl="";
			  for (var i=0;i<response.length;i++){

				  imageurl.push(response[i].image_url);
			      oldimageurl=response[i].image_url;
			      oldid=response[i].id;
				  imageurl1[oldid]=oldimageurl;
			  }

			  //context.setState({catydatasource:imageurl});
			  context.setState({catydatasource:response});

			  context.setState({loadview:false});

		 }).catch((err) => {
			console.log(err);
			//context.setState({error1:"no user with such phone registered"});
        });
  },

   getdata:function(apiurl){
	  var context = this;
		return new Promise(function(resolve, reject) {
			var location_route = apiurl;

			fetch(location_route, {
				 method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',

					}
			}).then((response) => {

			 if(response.status==200){

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
  onBackPress:function(){	 //right nav click
    //this.props.navigator.pop();
	var context=this;
	if(!context.state.flagmenu){
	 context.drawer.openDrawer();
	 context.setState({liststate:'viewmenu'});
	 context.setState({flagmenu:true});
	}
	else{
		context.drawer.closeDrawer();
		context.setState({flagmenu:false});
	}

  },


  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
	nav=navigator;
    return <Component route={route}
	     navigator={navigator}
		 locationname={this.state.locationname}
		 firstlocatid={this.state.locationid}
		 />;
  },
 showlist:function(){   // when location is clicked

	var context=this;
	if(!context.state.flagmenu){
	 context.drawer.openDrawer();
	 context.setState({liststate:'locate'});
	 context.setState({flagmenu:true});
	}
	else{
		context.drawer.closeDrawer();
		context.setState({flagmenu:false});
	}

 },
 showcart:function(){
	var context=this;

	if(!context.state.flagmenu){
	 context.drawer.openDrawer();
	 context.setState({liststate:'cart'});
	 context.setState({flagmenu:true});
	}
	else{
		context.drawer.closeDrawer();
		context.setState({flagmenu:false});
	}

 },
location_list:function (){
  var context=this;
  if(context.state.liststate=='locate')	{
	return(
			<View style={{height:230,paddingLeft:10,paddingRight:10}}>

			<ListView
			  dataSource={this.state.dataSource}
			  renderRow={this._renderRow}
			  keyboardDismissMode="on-drag"
			/>
		  </View>
	);
  }
  else if(context.state.liststate=='cart'){
	 return(
	 <View style={{paddingLeft:5,paddingRight:5,height:150,flexDirection:'column'}}>
		   <View style={{flex:.15,backgroundColor:'#FFF',paddingLeft:15,paddingRight:15,justifyContent:'center'}}>

			 <View style={{justifyContent:'center',height:21,flexDirection:'row',borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',}}>
			   <View style={{flex:.37,}}>
			     <Text style={{padding:4,color:'#000'}}>{'Items your Carts -'}</Text>
			   </View>
			   <View style={{flex:.63}}>
			     <Text style={{padding:4,color:'#ffab00'}}>{'3'}</Text>
			   </View>
			 </View>

		   </View>
		   <View style={{flex:.52,justifyContent:'center',}}>
			  <ScrollView key={'scrollView'} horizontal={false}
			  style={{backgroundColor:'#FFF',borderWidth:1,
			  paddingLeft:15,paddingRight:15,paddingTop:10
			  }}>
				<View style={{flexDirection:'column',}}>
						 <View style={{justifyContent:'center',flexDirection:'row'}}>
						    <View style={{flex:.37,}}>
								 <Text style={{padding:1,color:'#000'}}>{'Items your Carts -'}</Text>
							   </View>
							   <View style={{flex:.63}}>
								 <Text style={{padding:1,color:'#ffab00'}}>{'3'}</Text>
							   </View>
						 </View>

						  <View style={{justifyContent:'center',flexDirection:'row'}}>
						    <View style={{flex:.37,}}>
								 <Text style={{padding:1,color:'#000'}}>{'Items your Carts -'}</Text>
							   </View>
							   <View style={{flex:.63}}>
								 <Text style={{padding:1,color:'#ffab00'}}>{'3'}</Text>
							   </View>
						 </View>

						 <View style={{justifyContent:'center',flexDirection:'row'}}>
						    <View style={{flex:.37,}}>
								 <Text style={{padding:1,color:'#000'}}>{'Items your Carts -'}</Text>
							   </View>
							   <View style={{flex:.63}}>
								 <Text style={{padding:1,color:'#ffab00'}}>{'3'}</Text>
							   </View>
						 </View>
				</View>
			  </ScrollView>

		   </View>

	       <View style={{flex:.33,backgroundColor:'#FFF',justifyContent:'center',paddingLeft:15,paddingRight:15}}>
		     <View style={{justifyContent:'center',
			 paddingTop:5,  borderWidth:1,
			 borderColor:'#FFF',borderTopColor:'#CCC',
			 borderStyle:'dotted',flexDirection:'row'}} >
                <View style={{flex:.50}}>
				  <Text style={{fontSize:15}}>{'Total'}</Text>
				</View>
				<View style={{flex:.50,alignItems: 'flex-end'}}>
				  <Text style={{paddingRight:20,fontSize:15}}>{'Rs .385'}</Text>
				</View>

			 </View>
		   </View>

	 </View>
	);
  }
  else {

	 return(
	 <View style={{height:118,padding:7,paddingTop:0,flexDirection:'row'}}>
	    <View style={{backgroundColor:'#FFF',borderRadius:5,flexDirection:'column',flex:.60,justifyContent: 'center',
		paddingTop:10,paddingLeft:30,paddingRight:30,paddingBottom:5}}>
	      <View style={{height:33,borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',justifyContent: 'center',}}>

		  <TouchableOpacity  onPress={this.onmyorder}>
		    <Text style={{color:'#f47239'}}>{'My orders'}</Text>
		   </TouchableOpacity>

		  </View>
	      <View style={{height:33,borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',justifyContent: 'center',}}>

		   <TouchableOpacity  onPress={this.onprofile}>
		    <Text style={{color:'#f47239'}}>{'Profile'}</Text>
		   </TouchableOpacity>

		  </View>
	      <View style={{height:34,justifyContent: 'center',}}>
		    <TouchableOpacity  onPress={this.onwallet}>
		     <Text style={{color:'#f47239'}}>{'Wallet'}</Text>
		    </TouchableOpacity>
		  </View>

	   </View>
	   <View style={{flex:.60}}></View>
	 </View>
	);
  }

},
onmyorder:function(){
	this.props.navigator.push({ name: 'myorder' });
},
onprofile: function(){
	 this.props.navigator.push({name:'profile'})
},
onwallet:function(){
	 this.props.navigator.push({ name: 'wallet' });
},
_renderRow:function(rowData: string, sectionID: number, rowID: number){
	var context=this;

	return(
	   <View style={{backgroundColor:'#FFF', justifyContent: 'center', alignItems: 'center',
	   shadowColor:'red',shadowOpacity:0.8,shadowRadius:5,shadowOffset:{height:4,width:0}}}>

	    <View style={{width:270,height:30,justifyContent: 'center', alignItems: 'center',
		borderColor:'#FFF',borderBottomColor:'#CCC', borderWidth:1,
		}}>
		 <TouchableHighlight onPress={() => this._pressRow_submenu(rowID,rowData)}>
		   <Text style={styles.text}>
		     {rowData}
		   </Text>
		  </TouchableHighlight>
		 </View>
	   </View>
	);

},
_pressRow_submenu :function (rowID,rowData){  //when location is clicked

	var context=this;
	context.setState({locationname:rowData});
	context.setState({locationid:rowID});

	//if(context.setState.tabname=='first')
		 nav.push({ name: 'first' });

	context.drawer.closeDrawer();
},
go_ahead: function(){
	console.log("go ahdead");

	this.props.setareaname(this.state.locationname);
	this.props.setcaties(this.state.catydatasource);

	this.props.navigator.push({ name: 'middlehome'});
},

onSelectcategory:function(){
	console.log("onselected");
},
onaddcart:function(){
	console.log("onaddcart");
	var context=this;
	var cart_num=context.state.cartnum+1;
	context.setState({cartnum:cart_num})
},
ongetproducts: function(){
	var context=this;
	var intem=[];

	for(var i=0;i<context.state.image_url.length;i++){
		 var poduct= <TouchableOpacity onPress={this.onSelectcategory} key={i} style={{padding:3,paddingTop:5,paddingRight:5}}>

							<View style={styles.slide}>
							   <Image style={styles.bg} source={{uri: context.state.image_url[i]}} />
							    <View style={{flex:.73,backgroundColor: 'transparent'}}>
							    </View>
								<View style={{flex:.27,backgroundColor: '#000',opacity: 0.8, flexDirection: 'row',}}>
								     <View style={{flex:.35,  justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>
											  <Image style={styles.home_left} source={require('../images/Home_left.png')} />
											  <Text style={{marginLeft:15,width:50, textAlign :'center' }}>{'middle'}</Text>

											  </View>
											  <View style={{flex:.25, }}><Text>{''}</Text></View>
											  <View style={{flex:.40,justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>

												  <Image style={styles.home_minus} source={require('../images/home_minus.png')} />
													<Text style={{width:25, textAlign :'center',color:'#FFF' }}>{'2'}</Text>
												  <TouchableOpacity onPress={this.onaddcart}>
												   <Image style={styles.home_minus} source={require('../images/home_plus.png')} />
												  </TouchableOpacity >
											  </View>

								</View>
							 </View>
				 </TouchableOpacity >
				 intem.push(poduct);
	}
		return intem;

},
  render() {
	  var context=this;
	  if(context.state.loadview){
		  return(<View style={styles.container}>
		      <Text style={styles.welcome}>{'Loading ....!'}</Text>
			</View>);
	  }
	  else{
		return (
		<ScrollView key={'scrollView'} horizontal={false}
				 automaticallyAdjustContentInsets={false}
				  style={{backgroundColor:'#FFF', flex:1}}>
		  <View style={styles.container}>
			<View style={styles.header_havbar}>

			  <View style={styles.left_navbar}>
			   <TouchableOpacity  onPress={this.onBackPress}>
			     <Image style={styles.Menu_btn} source={require('../images/Menu_btn.png')}></Image>
			   </TouchableOpacity>
			  </View>

			  <View style={styles.center_navbar}>
			   <Image style={styles.Mark_top} source={require('../images/Mark_top.png')} />


				<View style={{ flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
				  <TouchableOpacity  onPress={this.showlist}>
				    <Text style={{color:'#ffab00'}}>{this.state.locationname}</Text>
				  </TouchableOpacity>
				</View>

			     <Image style={{left:15,height:15,width:15}} source={require('../images/up.png')} />

			  </View>


			   <View style={styles.right_navbar}>
					<TouchableOpacity onPress={this.showcart}>
					 <Image style={styles.bucket_top} source={require('../images/bucket_top.png')} />
					</TouchableOpacity>

					<View style={styles.count_circle}>
						<Text style={styles.whiteFont}>{this.state.cartnum}</Text>
					</View>
			   </View>

			</View>



			<View style={{height:180,borderWidth:1,borderColor:'green',backgroundColor:'#CCC'}}>
			          <Swiper style={styles.wrapper}
						 onMomentumScrollEnd={this._onMomentumScrollEnd}
							  showsButtons={true} index={0} >
								  {this.ongetproducts()}
					  </Swiper>
			</View>

			   <GridView
					items={this.state.catydatasource}
					itemsPerRow={2}
					renderItem={this.renderItem}
					style={styles.listView}
				  />

		  </View>

		</ScrollView>
		);
	  }
  },
  renderItem: function(item) {

      return <Movie movie={item}  key={item.id} onback={this.go_ahead}/>
  },
});
var Movie = React.createClass({
  render: function() {

      return <TouchableOpacity onPress={this.onselectcategory}>
	  <View style={styles.movie} >
        <Image
          source={{uri: this.props.movie.image_url}}
          style={styles.thumbnail}
        />
        <View style={{flex:.82}}>
		</View>

		<View style={styles.barview}>
		  <Text style={{color:'#FFF',}}>{this.props.movie.name}</Text>
		</View>

      </View>
	   </TouchableOpacity >
  },
  onselectcategory:function(){
	  console.log("onselect gategroy");
	  this.props.onback();
  },
});

 var icons = {     //Step 2
       'up'    : require('../images/up.png'),
       'down'  : require('../images/down.png')
  };
const styles = StyleSheet.create({
  container: {
     flexDirection: 'column',
      flex: 1,

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
 toolbar: {
	backgroundColor: 'red',
	height: 50,
  },
  /** nav bar **/
    header_havbar: {
        flexDirection: 'row',
		height:53,
	   //justifyContent: 'space-between',
       //alignItems: 'center',
       //flex: .25,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderBottomColor: '#CCC',
        borderWidth:2
     },
	left_navbar:{
		flex:.15,
		justifyContent: 'center',
		alignItems:'center',
	},
	right_navbar:{
	   flexDirection: 'row',
	   flex:.20,
	   justifyContent: 'center',
	   alignItems:'center',
	   paddingLeft:5
	 },
	 center_navbar:{
		paddingLeft:40,
		paddingRight:40,
		flexDirection:'row',
		flex:.65,
		justifyContent: 'center',
		alignItems:'center',

	 },
	Menu_btn:{
	  width: 20,
	  height: 15,

	},
	icon: {
	   top:10,
		width: 10,
		height: 10,
	 },
	 bucket_top:{
		width: 25,
		height: 20,
		justifyContent: 'center',
	    alignItems:'center',

	 },
	  whiteFont:{
	   color:'#FFF',
	   fontSize:12,
	   width:15,
	   height:15,
	   textAlign:'center',

    },
	count_circle:{
	  borderRadius :10,
	  backgroundColor: '#ffab00',
	  justifyContent: 'center',
	  alignItems:'center',
	  right:30,
	  bottom:5
	},
	Mark_top:{
		height:20,
		width:15,
	},
	/** list view  **/
	text: {
    flex: 1,
    fontSize:12,
	color:'#f47239',
   },
   /** tabbar  **/

   tabbar:{
	  flexDirection: 'row',
      height:40,
      backgroundColor: '#FFF',
	  borderColor: '#FFF',
	  borderBottomColor: '#CCC',
      borderWidth:1    ,


   },
   tab:{
	   flex:.25,
	   justifyContent: 'center',
	   alignItems:'center',
	   paddingLeft:15,

   },
   separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
   },
    row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
   },
  slide: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
     flexDirection:'column',
	 height:180,


  },

  bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width-10,
        height:200,
		//justifyContent: 'center',
		//alignItems: 'stretch',
    },
	 home_minus:{
		height:18,
		width:18,
	},
	home_left:{
		height:16,
		width:16,
	},
	thumbnail: {
     width: (windowSize.width-10)/2,
     height: (windowSize.height-265)/2,
	 position: 'absolute',
	 left:2,
  },
   movie: {
    height: (windowSize.height-260)/2,
    flex: 1,
    alignItems: 'center',
	justifyContent: 'center',
    flexDirection: 'column',
	paddingBottom:3,

  },
    listView: {
    paddingTop: 3,

    backgroundColor: '#F5FCFF',
  },
  barview:{
	flex:.18,
	 backgroundColor:'#000',
	opacity:0.8,
	justifyContent: 'center',
	alignItems: 'center',
	width:	(windowSize.width-20)/2,
	flexDirection:'row',
	paddingBottom:3 ,
    borderWidth:1,
	},
});

AppRegistry.registerComponent('Beginhomecomponent', () => Beginhomecomponent);

module.exports = Beginhomecomponent;
