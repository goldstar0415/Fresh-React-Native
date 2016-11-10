"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/21/16
 Author:            
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/21/16               TaskNumber          Created
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
	
	} = React;
	
//import MapView from 'react-native-maps';
	
var Profilecomponent = React.createClass({
   getInitialState: function() { 
     var context=this;
	// var paymenttxt= context.getwallet();
    return {     	  
	  footbar:<Text>{""}</Text>,
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
  onaddwallet:function(){
	 this.props.navigator.push({ name: 'walletfull' });//
	 
  }, 
    componentDidMount:function(){
	  this.ongetprofile();
   },
	 ongetprofile:function(){
	  var context=this;
	  
	  context.getdata("https://rivo.herokuapp.com/client/addresses?active=0").then((res) => {
		   console.log(res);
		   var response = JSON.parse(res._bodyInit);	
		     // console.log(response.total_price);
			 // console.log(response.payment_type);
			 //  console.log(response.id);           
			 //context.props.navigator.push({ name: 'payment' });
			
        }).catch((err) => {  
			context.setState({error:"faild  place order"});           		
        });			
	 
   },
   getdata:function(apiurl){
	  var context=this;
	  return new Promise(function(resolve, reject) {
			var location_route = apiurl;
			var tokentype=context.props.tokentype;
		
		   // var txt = '{ "order" : { "address_id":3 , "line_items_attributes": [{ "product_id": 5, "amount": 3,"wanted_date":"2016-04-07" }] } }';	
		    console.log(apiurl);
			fetch(location_route, {
				 method: "GET",
				 headers: {
						'Accept': 'application/json',
						'Token-Type': tokentype,	
						'Client': context.props.client,
						'Expiry': context.props.expiry,	
						'Content-Type': 'application/json',	
						'Access-Token': context.props.accesstoken,						
						'Uid':  context.props.uid,
						'Cookie': ''						
					}					
			}).then((response) => {
				console.log(response);
			 if(response.status==201){				
							
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
  render: function() {
	   
       return (           
									
		  <View style={styles.container}>       
		  
				 <View style={styles.header_havbar}>       
				 
					   <View style={styles.left_navbar}>
						   <TouchableOpacity  onPress={this.onBackPress}>
							 <Image style={styles.Menu_btn} source={require('../images/back.png')}></Image>
						   </TouchableOpacity>		  
					   </View>	
					   
					   <View style={styles.center_navbar}>
						 <Text style={{color:'#f47239',fontSize:20}}>{'Profile'}</Text>
					   </View>

					   <View style={styles.right_navbar}>
						 <Text>{''}</Text>
					   </View>
					   
				 </View>		
			
				 <View style={{flex:0.42,margin:8, backgroundColor:'white', borderBottomColor: '#CCC', borderBottomWidth:2,}}>
					
					<View style={{flex:1,margin:26,}}>
						<View style={{flex:1,margin:3, paddingLeft:5, borderBottomWidth:1, borderBottomColor:'#ddd'}}>
							<Text style={{color:'#ccc',fontSize:15}}>{'Name'}</Text>
							<Text style={{color:'#999',fontSize:15}}>{'Tinjo Thomas'}</Text>
						</View>
						<View style={{flex:1,margin:3, paddingLeft:5, borderBottomWidth:0.8, borderBottomColor:'#ddd'}}>
							<Text style={{color:'#ccc',fontSize:15}}>{'Email Address'}</Text>
							<Text style={{color:'#999',fontSize:15}}>{'tinjothomas@gmail.com'}</Text>
						</View>
						<View style={{flex:1,margin:3, paddingLeft:5,}}>
							<Text style={{color:'#ccc',fontSize:15}}>{'Registered mobile no'}</Text>
							<Text style={{color:'#999',fontSize:15}}>{'+917259693630'}</Text>
						</View>
					</View> 
					
				 </View> 			
				 
				 <View style={{flex:0.58,margin:8, marginTop: 0,backgroundColor:'white', borderBottomColor: '#CCC', borderBottomWidth:3,}}>  
						<View style={{flex:1, flexDirection: 'row', marginLeft:25,marginRight:25, paddingLeft:5, alignItems:'center', }}>
							<Text style={{flex:0.60,color:'#999',fontSize:15}}>{'Save Addresses'}</Text>
							
							<View style={styles.addnew}>   
							  <TouchableOpacity style={{paddingLeft:50,paddingRight:50}} onPress={this.login_check}>				
								<Text style={{color:'white'}}>Add new</Text>	
							  </TouchableOpacity>					
							</View>
						</View>
						
						<ScrollView  key={'scrollView1'} horizontal={false} 
						 automaticallyAdjustContentInsets={false}
						  style={{backgroundColor:'#FFF', flex:3.5}}>
						  
							<View style={styles.homeoffice}>
								<Text style={{color:'#ccc',fontSize:15}}>{'Home'}</Text>
								<Text style={{color:'#999',fontSize:15}}>{'16/2.Krishnappa Garden'}</Text>
								<Text style={{color:'#999',fontSize:15}}>{'BTM 1st Stage, Bangalore'}</Text>
							</View>
							<View style={styles.homeoffice}>
								<Text style={{color:'#ccc',fontSize:15}}>{'Office'}</Text>
								<Text style={{color:'#999',fontSize:15}}>{'#2778,27th Main Road, Hsr Layout'}</Text>
								<Text style={{color:'#999',fontSize:15}}>{'Opposite to NIFT college'}</Text>
								<Text style={{color:'#999',fontSize:15}}>{'Bangalore'}</Text>
							</View>
						</ScrollView>
						
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
        borderWidth:2,     
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
	  marginLeft:20
	},
	 center_navbar:{
		paddingLeft:40,
		paddingRight:40,
		flexDirection:'row',		
		flex:.70,
		justifyContent: 'center',
		alignItems:'center', 
		
	 },
	
	 addnew: {
		flex: 0.40,
        backgroundColor: '#f46527',
        padding: 6,        
		alignItems: 'center',
		borderRadius :5,
		marginTop:3,
		marginBottom:3,
    },
	
	 homeoffice: {
		 marginLeft:25,
		 marginRight:25,
		 marginBottom:10,		 
		 borderWidth:1, 
		 borderColor:'#ddd',
		 borderRadius :4,
		 padding :13,
		 justifyContent: 'center',
	 }
})

AppRegistry.registerComponent('Profilecomponent', () => Profilecomponent);
module.exports = Profilecomponent;