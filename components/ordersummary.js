"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/20/16
 Author:            
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/20/16               TaskNumber          Created
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
 var totalprice=0;	
var Ordersummarycomponent = React.createClass({
   getInitialState: function() { 
   console.log(this.props.foodidlist);
   console.log(this.props.foodnamelist);
   console.log(this.props.foodpricelist) ;
   console.log(this.props.productsalenum);
  
  
  console.log(this.props.expiry);
  console.log(this.props.tokentype);
    return {     
	   mapRegion: undefined,
      mapRegionInput: undefined,
      annotations: [],
    }
  },
  onBackPress:function(){
	   this.props.navigator.pop();
  },
  onproceedpayment:function(){
	  var context=this;
	  
	  context.onpalcesummery("https://rivo.herokuapp.com/client/orders").then((res) => {
		   console.log(res);
		   var response = JSON.parse(res._bodyInit);	
		      console.log(response.total_price);
			  console.log(response.payment_type);
			  console.log(response.id);
                        
			context.props.settotalprice(response.total_price);
			context.props.setpaymenttype(response.payment_type);
			context.props.setorderid(response.id);
			
			context.props.navigator.push({ name: 'payment' });
			
        }).catch((err) => {  
			context.setState({error:"faild  place order"});           		
        });	
		
	 // this.props.navigator.push({ name: 'payment' });
  },
  onpalcesummery:function(apiurl){
	  var context=this;
	  return new Promise(function(resolve, reject) {
			var location_route = apiurl;
			var tokentype=context.props.tokentype;
		
		    var txt = '{ "order" : { "address_id":3 , "line_items_attributes": [{ "product_id": 5, "amount": 3,"wanted_date":"2016-04-11" },{ "product_id": 8, "amount": 4,"wanted_date":"2016-04-11" }] } }';	
		    console.log(apiurl);
			fetch(location_route, {
				 method: "POST",
					headers: {
						'Accept': 'application/json',
						'Token-Type': tokentype,	
						'Client': context.props.client,
						'Expiry': context.props.expiry,	
						'Content-Type': 'application/json',	
						'Access-Token': context.props.accesstoken,						
						'Uid':  context.props.uid,
						'Cookie': ''						
					},
					body: txt
					
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
  getordersummery:function(){
	  var context=this;
	  let idlist=[];
	  let orderlist=[];
	  idlist=context.props.foodidlist;
	  //idlist=[];
	  let productsalenum=[];
	  productsalenum=context.props.productsalenum;
	  console.log(productsalenum);
	  console.log("productsalenum");
	  let foodnamelist=context.props.foodnamelist;
	  let foodpricelist=context.props.foodpricelist;
	 
	  for(var i=0;i<idlist.length;i++){
		  var foodid=idlist[i];
		 if(productsalenum[foodid]==undefined || productsalenum[foodid]==0)
			  continue;
		 if (productsalenum[foodid]>1){
			 var number="    ×    "+productsalenum[foodid];
			
		 }
		 else
		 {
			 var number="";
			
		 }
		  var price=foodpricelist[foodid]*productsalenum[foodid];
		  
		 let tagstr=<View style={{flex:1,  flexDirection: 'column',height:25,paddingLeft:8,paddingRight:10}} key={foodid}>				  
					   <View style={{flexDirection: 'row'}}>				     
							 <View style={{flex:.50,paddingRight:12}}>
							  <Text style={{fontSize:18}}>{foodnamelist[foodid] + number}</Text>
							 </View>
							 
							 <View style={{flex:.50,alignItems: 'flex-end',}}>
							 
							   <Text  style={{left:10,fontSize:18}}>{'RS.   ' +price}</Text>
							 </View>					 
					   </View>				   
				  </View>
		  totalprice+=price;
		 orderlist.push(tagstr) ;
	  }
	  return orderlist
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
					 <Text style={{color:'#f47239',fontSize:20}}>{'Order Summery'}</Text>
				   </View>

				   <View style={styles.right_navbar}>
					 <Text>{''}</Text>
				   </View>			 			   
			</View>			   
			 <View style={{flex:.40,padding:6,paddingBottom:0,}}>
			  <ScrollView  key={'scrollView1'} horizontal={false} 
				 automaticallyAdjustContentInsets={false}
				  style={{backgroundColor:'#FFF', flex:1}}>
				  
			  <View style={{backgroundColor:'#FFF',flex:1,padding:12,paddingLeft:15,paddingRight:15,paddingTop:18}}>
				  {this.getordersummery()}
				
				  
			   
			   </View>
			  </ScrollView> 
			  
			  
			 </View> 
			 <View style={{flex:.10,padding:6,paddingTop:0}}>
			   <View style={{flex:1,paddingTop:15,flexDirection: 'row'}}>
			     <Image style={styles.bg} source={require('../images/order_barbottom.png')}/>
				
				<View style={{flex:.50}}>
				  <Text style={{fontSize:20,fontWeight:'bold',marginLeft:15,borderWidth:1}}>{'Total'}</Text>
				</View>
				
				<View style={{ alignItems: 'flex-end',flex:.50}}>
				   <Text style={{fontSize:20,fontWeight:'bold',marginRight:10,right:10}}>{'RS.  '+ totalprice}</Text>
				</View>
			   </View>
			   
			 </View> 
			 
			 <View style={{flex:.25,flexDirection: 'row',backgroundColor:'#EDEDED'}}>
			    <View style={{flex:.40,justifyContent: 'center',left:25 }}>
				  <Text>{'Deliver to'}</Text>
				</View>
				 
				<View style={{flex:.60,justifyContent: 'center',alignItems:'center',paddingRight:25 }}>
				  <Text style={{width:200}}>{'16/2 Krishnappa garden 28th Main, Puttappa layout, New Thippasadra Bengalluru'}</Text>
				</View>
			 </View>
			 
			 <View style={{flex:.25,paddingBottom:20}}>
			   <View style={{backgroundColor:'#FFF',flex:1,flexDirection: 'column'}}>
			     <View style={{flex:.20,flexDirection: 'row',paddingTop:10}}>
				    <Text style={{left:20,fontSize:15,fontWeight:'bold'}}>{'Comments'}</Text>
					<Text style={{left:20}}>{'(optional)'}</Text>
				 </View>
				 <View style={{flex:.80,justifyContent: 'center',
		                alignItems:'center'}}>
				    <TextInput 
                        style={{height:250,width:340,}}
                        placeholder="Typle your comments here"
                        placeholderTextColor="#d6d4d4"
						multiline ={true}
						autoCapitalize="none"
						 autoCorrect={false}
						clearButtonMode="always"
						
                        onChangeText={(text) => this.setState({searchtxt:text})}
						
                     />
				 </View>
				 
			   </View>
			 </View>
			
			
			 
			 <View style={{backgroundColor:'#f47239',flex:.10, justifyContent: 'center',alignItems:'center',}}>
			    <TouchableOpacity  onPress={this.onproceedpayment}>
			      <Text style={{fontSize:15,color:'#FFF',fontWeight:'bold'}}>{'Place Order'}</Text>
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
	 bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        height:55,
		width:348,
        right:5,
		overflow: 'visible'
		//justifyContent: 'center',      
		//alignItems: 'stretch',
    },
	
	 
})

AppRegistry.registerComponent('Ordersummarycomponent', () => Ordersummarycomponent);
module.exports = Ordersummarycomponent;