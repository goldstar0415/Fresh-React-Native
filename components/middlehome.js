"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/29/16
 Author:            
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/29/16               TaskNumber          Created
 ==================================================================================
 */
import React, {
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
   Alert,
} from 'react-native';

var {NativeModules} = require('react-native');

var server_auth = require('./server_auth');
var FBLoginManager = NativeModules.FBLoginManager; // if needed
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var nav;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var summycart=0;
var Middlecomponent = React.createClass({
  getInitialState: function() {	   
   
	var context=this;
	
	 
	 context.getcategories();       
	return {
      catieslength:"",  dataSource: ds.cloneWithRows({}), imagelist:[],  loadview:true,catydatasource:[],
	  productsalenum:[],sumcart:0,foodnamelist:[],foodpricelist:[],foodidlist:[],summysale:0,modalVisible:false,
    }
  },
   onBackPress:function(){
	 // this.props.navigator.push({ name: 'behome'}); 
	 	var context=this;
	 	 context.setState({liststate:'locate'});
		context.drawer.closeDrawer(); 
		context.hdrawer.openDrawer();
	/**
	if(!context.state.flagmenu){
	 context.drawer.openDrawer();
	 context.setState({liststate:'locate'});
	 context.setState({flagmenu:true});
	}
	else{
		context.drawer.closeDrawer(); 
		context.setState({flagmenu:false});
	}
	**/
	
	
   },
   getcategories:function(){
	    var context=this;	
		var apiurl="https://rivo.herokuapp.com/categories?city_id="+context.props.ourlocateid;
	
	  context.getdata(apiurl).then((res) => {
      
			 var response = JSON.parse(res._bodyInit);	
			 
			   console.log(response);
			   
			  context.setState({catydatasource:response});
			  context.setState({selcategory:response[0].id});
			  context.getfoodimages();
			  
		 }).catch((err) => {             
			console.log(err);			        		
        });	 
  },
  onselcategory:function(keyid){
	var context=this;
    context.setState({selcategory:keyid});
	context.getfoodimages();
	console.log(keyid);
	
  },  
   makemenus:function(){
	  var context=this;
	  var caties=context.state.catydatasource;
	  let childmenues=[];
	 
	 for(let i=0; i<caties.length;i++) {
		 let keyid=caties[i].id;
		 let keystr=caties[i].name;
		
		 let menu= <TouchableOpacity style={{width:120, borderColor:'#FFF',borderBottomColor:'#fAC36A',borderWidth:(keyid==context.state.selcategory)?2:0}} key={caties[i].id} onPress={() => this.onselcategory(keyid)}>
			        <Text style={{fontSize:14,textAlign :'center'}}>{keystr}</Text>
			      </TouchableOpacity>
			  
			  childmenues.push(menu);
	 }
	
	 return childmenues
   },
   getfoodimages : function(){
	  var context=this;
	  
	 if(context.state.selcategory==undefined)
		var apiurl="https://rivo.herokuapp.com/products?city_id="+context.props.ourlocateid+"&category_id=2";
	 else 
		var apiurl="https://rivo.herokuapp.com/products?city_id="+context.props.ourlocateid+"&category_id="+context.state.selcategory;
	
	 
	  console.log(apiurl);
	  context.getdata(apiurl).then((res) => {              
			 var response = JSON.parse(res._bodyInit);	             
			 this.setState({image_count:response.length});  
			  var imageurl=[];
			  var nameshadow=[];
			  var idshadow=[];
			  var foodid=[];
			  var foodprice=[];
			  nameshadow=context.state.foodnamelist;
			  foodid=context.state.foodidlist;
			  foodprice=context.state.foodpricelist;
			  
			   for (var i=0;i<response.length;i++){
				  
				  imageurl.push(response[i].image_url);	
				  
				  if(foodid.indexOf(response[i].id)==-1)
				    foodid.push(response[i].id);
				
				  var nid=response[i].id;
                   nameshadow[nid]=response[i].title;
				   
				   foodprice[nid]=response[i].price;
				 
				 
				  context.setState({foodpricelist:foodprice});
				  context.setState({foodidlist:foodid});
			  }				 
		 
					
			  context.setState({foodnamelist:nameshadow});			
			  context.setState({imagelist:response});
			  context.setState({loadview:false});
			  		
        }).catch((err) => {             
			console.log(err);			      		
        });
  },
   getdata:function(apiurl){
	 // var context = this;
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
  showminucart(productsum){
	  if(productsum>0)
	     return(<Image style={styles.home_minus} source={require('../images/home_minus.png')} />  );
	 
	   return(<Text>{''}</Text>);
  },
  getfoodlistview:function(){
	  var context=this;
	var imagelist  =this.state.imagelist
	var thumblist=[];
	
	let minusimageview= <Image style={styles.home_minus} source={require('../images/home_minus.png')} />
	
	let productsalenum=[];
	 productsalenum=this.state.productsalenum;
	for(var i=0;i<imagelist.length;i++ ){
		 let productid=imagelist[i].id;
		
		 
		 let cellimage=<View style={{width:windowSize.width,height:(windowSize.height-135)/2,flexDirection:'column',borderWidth:2,borderColor:'#FFF',borderTopColor:'#CCC'}} key={imagelist[i].id}>
			<View style={styles.view_part}> 			   
				<Image style={styles.bg} source={{uri: this.state.imagelist[i].image_url}} />				
				 <View style={{flex:.83,backgroundColor: 'transparent', }}>				 
				 </View>				 
				 <View style={styles.bar_part}>
				   <Text style={{color:'#FFF', top:6}}>{this.state.imagelist[i].title}</Text>
				 </View>			  
			</View>
		
			<View style={{ flex: .10, backgroundColor: '#FFF',flexDirection: 'row',}}> 
			  <View style={{flex:.35,  justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>
			  <Image style={styles.home_left} source={require('../images/Home_left.png')} />
			  <Text style={{marginLeft:15,width:50, textAlign :'center' }}>{this.state.imagelist[i].price}</Text>
			  
			  </View>
			  <View style={{flex:.25, }}><Text>{''}</Text></View>
			  <View style={{flex:.40,justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>
				  <TouchableOpacity onPress={() => this.onminuscart(productid)}>
					  {(productsalenum[productid]==0 || productsalenum[productid]==undefined)?<Text></Text>:minusimageview}
				  </TouchableOpacity>
					<Text style={{width:25, textAlign :'center' }}>{(productsalenum[productid]==0)?'':productsalenum[productid]}</Text>
				 <TouchableOpacity onPress={() => this.onaddcart(productid)}>
				  <Image style={styles.home_minus} source={require('../images/home_plus.png')} />
				 </TouchableOpacity>
			 </View>		  
			</View>			
		</View>
		
		thumblist.push(cellimage);
	}
	return thumblist;
  },
  onaddcart:function(productid){   // When click the plus
	   var context=this;
	   let shawdow=[];
	   var sumcartshadow;
	    shawdow=context.state.productsalenum;
	 
	 shawdow[productid]=(isNaN(shawdow[productid])?0:shawdow[productid])+1;
	 context.setState({productsalenum:shawdow});	
	 
	 sumcartshadow=context.state.sumcart+1;
	 context.setState({sumcart:sumcartshadow});
	 console.log(context.state.productsalenum);
  },
  onminuscart:function(productid){  //when click the minus
	   var context=this;
	   var shawdow=[];
	   var sumcartshadow;
		
	   shawdow=context.state.productsalenum;
	   if((isNaN(shawdow[productid])?0:shawdow[productid])<=0)
		   return;
	   shawdow[productid]=(isNaN(shawdow[productid])?0:shawdow[productid])-1;
	   context.setState({productsalenum:shawdow});	
	   
	   sumcartshadow=context.state.sumcart-1;
	   context.setState({sumcart:sumcartshadow});
  },
  go_ahead:function(){
	  var context=this;
	  context.props.setfoodidlist(context.state.foodidlist);
	  context.props.setfoodnamelist(context.state.foodnamelist);
	  context.props.setfoodpricelist(context.state.foodpricelist);
	  context.props.setproductsalenum(context.state.productsalenum);
	  console.log(context.state.productsalenum);
	  this.props.navigator.push({ name: 'deliverto'});
  },
  showcart(){
	  var context=this;
	  context.setState({liststate:'showcart'});
	  context.drawer.openDrawer();  
	  context.hdrawer.closeDrawer(); 
  },
  
  showviewcart(){
	  
	  if(this.state.sumcart==0)
		  return(
	   <View style={styles.right_navbar}>
	      <TouchableOpacity onPress={this.showcart}>
					 <Image style={styles.bucket_top} source={require('../images/bucket_top.png')} />
		  </TouchableOpacity>					
			
	   </View>
	  
	   );

	  return(
	        <View style={styles.right_navbar}>
					<TouchableOpacity onPress={this.showcart}>
					 <Image style={styles.bucket_top} source={require('../images/bucket_top.png')} />
					</TouchableOpacity>
					
					<View style={styles.count_circle}>			 			
						<Text style={styles.whiteFont}>{this.state.sumcart}</Text>				 				
					</View>
			 </View>	
	  );
  },
  location_list:function (){
  var context=this;
  if(context.state.liststate=='showcart'){
   return(	
	<View style={{flex:1,flexDirection:'column'}}>
	 <View style={{paddingLeft:5,paddingRight:5,height:150,flexDirection:'column',}}>
		   <View style={{flex:.20,backgroundColor:'#FFF',paddingLeft:15,paddingRight:15,justifyContent:'center',}}>
			 
			 <View style={{justifyContent:'center',height:30,flexDirection:'row',borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',paddingBottom:5}}> 
			   <View style={{flex:.37,paddingTop:6,}}>
			     <Text style={{paddingLeft:4,color:'#000'}}>{'Items your Carts -'}</Text>
			   </View>
			   <View style={{flex:.63,paddingTop:6,}}>
			     <Text style={{paddingLeft:4,color:'#ffab00'}}>{this.state.sumcart}</Text>
			   </View>
			 </View> 
			 		  
		   </View>
		   
		   <View style={{flex:.47,justifyContent:'center'}}>
			  <ScrollView key={'scrollView'} horizontal={false} 
			  style={{backgroundColor:'#FFF',borderWidth:1,
			  paddingLeft:15,paddingRight:15,paddingTop:10			 
			  }}>
				<View style={{flexDirection:'column',}}>
						
						{this.getcartlist()}

						 
				</View>
			  </ScrollView>   
			  
		   </View>
		   
	       <View style={{flex:.33,backgroundColor:'#FFF',justifyContent:'center',paddingLeft:15,paddingRight:15,borderWidth:3,
		   borderBottomColor:'#CCC', borderColor:'#FFF'}}>
		     <View style={{justifyContent:'center',
			 paddingTop:5,  borderWidth:1,
			 borderColor:'#FFF',borderTopColor:'#CCC',
			 borderStyle:'dotted',flexDirection:'row'}} >
                <View style={{flex:.50}}>
				  <Text style={{fontSize:15}}>{'Total'}</Text> 
				</View>
				<View style={{flex:.50,alignItems: 'flex-end'}}>
				  <Text style={{paddingRight:40,fontSize:15}}>{summycart}</Text> 
				</View>
				
			 </View>
		   </View>
	   
	   </View>
	    <TouchableOpacity onPress={this.oncloselocationlist}>
	     <View style={{height:400}}>
	     <Text></Text>
	     </View>
	   </TouchableOpacity>
	 
	 </View>
	);
  }
 
	
},
homemanu:function(){
	  return( 
	 <View style={{flexDirection:'row',flex:1,width:windowSize.width}}>
	      

	   <View style={{backgroundColor:'#FFF',borderRadius:2,flexDirection:'column',flex:.90,
		}}>
	      <View sytle={{flex:1,height:50}} >	

		     <Image style={{width:windowSize.width-20,height:150,}} source={require('../images/Log-top.png')} />
		  </View>
          
		 <View style={{height:40,borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',justifyContent: 'center',paddingLeft:30}}>
		  
		  <TouchableOpacity  onPress={this.onmyorder}>
		    <Text style={{color:'#f47239'}}>{'My orders'}</Text>
		   </TouchableOpacity>
		   
		  </View>
	      <View style={{height:40,borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',justifyContent: 'center',paddingLeft:30}}>
		   
		   <TouchableOpacity  onPress={this.onprofile}>
		    <Text style={{color:'#f47239'}}>{'Profile'}</Text>
		   </TouchableOpacity>
		   
		  </View>
	      <View style={{height:40,justifyContent: 'center',paddingLeft:30,borderWidth:1,borderColor:'#FFF',borderBottomColor:'#CCC',}}>
		    <TouchableOpacity  onPress={this.onwallet}>
		     <Text style={{color:'#f47239'}}>{'Wallet'}</Text>
		    </TouchableOpacity>
		  </View>
	      
	   </View>
	   <View style={{flex:.10}}>
	   
	   </View>
	 </View>
	);
},
oncloselocationlist:function(){
	var context=this;
	
	context.drawer.closeDrawer(); 
},
getcartlist : function(){
	var context=this;
	let foodlist=context.state.foodidlist;
	let cartlist=[];
	let summysale=0;
	for(var i=0;i<foodlist.length;i++){
		//let tagstr=
		let foodid=foodlist[i];
		let foodname=context.state.foodnamelist[foodid];
		let foodnum=context.state.productsalenum[foodid];	
		let foodprice=context.state.foodpricelist[foodid];	
		
		if(foodnum==undefined || foodnum==0)
			continue;
		
		foodprice=foodprice*foodnum;
		
		summysale+=foodprice;
		let tagstr=<View style={{justifyContent:'center',flexDirection:'row'}} key={foodid}> 
				<View style={{flex:.80,flexDirection:'row'}}>
					 <Text style={{padding:1,color:'#000'}}>{foodname}</Text>
					 <Text style={{padding:1,left:5,color:'#CCC'}}>{'×'}</Text>
					 <Text style={{padding:1,color:'#ffab00',left:15}}>{foodnum}</Text>
				 </View>				 
				 
				 <View style={{flex:.20,flexDirection:'row',paddingLeft:8}}>				    
					   <Text style={{color:'#AAA',}}>{'RS.'}</Text>
					   <Text style={{left:3,color:'#AAA',textAlign:'right'}}>{foodprice}</Text>						 
				 </View>				 
		       </View> 	
		 cartlist.push(tagstr);
	}
	
	summycart=summysale;
	
	return cartlist
	
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
ongobacklocation:function(){
	var context=this;
	var productsalenum=context.state.productsalenum;
	console.log(productsalenum.length);
	console.log(productsalenum);
	if(productsalenum.length!=0 ){
		Alert.alert(
				'Clear cart',
				"Seems like you are trying to browse other locations.Pressing OK will clear your cart. Do you want to proceed?",
				[
				  {text: 'Cancel', onPress: () => console.log('OK Pressed!')},
				  {text: 'OK',onPress:() => this.ongoback()},
				]
			  );
	}
	else{
      	this.props.navigator.push({ name: 'selectlocation' });	
	}
},
ongoback:function(){
	this.props.navigator.push({ name: 'selectlocation' });
},
  render(){
	  
	  var context=this;
	   var modalBackgroundStyle = {
         backgroundColor:'rgba(0, 0, 0, 0.5)',
      };
	  if(context.state.loadview){
		  return(<View style={styles.container}>
		      <Text style={styles.welcome}>{'Loading ....!'}</Text>
			</View>);
	  }
	  return (
		<DrawerLayoutAndroid drawerWidth={windowSize.width} style={{backgroundColor:'#FFF'}}				  			 
				                    drawerPosition={DrawerLayoutAndroid.positions.Left}
				                    ref={(hdrawer) => { this.hdrawer = hdrawer; }}				
				                    renderNavigationView={this.homemanu}>
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
				  <TouchableOpacity  onPress={this.ongobacklocation}>
				    <Text style={{color:'#f47239'}}>{this.props.areaname}</Text>
				  </TouchableOpacity>
				</View>	 
				
			     <Image style={{left:15,height:15,width:15}} source={require('../images/up.png')} />	
			  
			  </View>

			  
			  {this.showviewcart()}
			  
			  
			</View>
			
			
			<DrawerLayoutAndroid drawerWidth={windowSize.width} style={{backgroundColor:'#FFF'}}				  			 
				                    drawerPosition={DrawerLayoutAndroid.positions.Right}
				                    ref={(drawer) => { this.drawer = drawer; }}				
				                    renderNavigationView={this.location_list}>
									
			<ScrollView  key={'scrollView1'} horizontal={false} 
				 automaticallyAdjustContentInsets={false}
				  style={{backgroundColor:'#FFF', flex:1}}>
				  
			 
									
			  <ScrollView  key={'scrollView'} horizontal={true} 
				 automaticallyAdjustContentInsets={true}
				  style={{backgroundColor:'#FFF', flex:1,height:50,flexDirection:'row',overflow:'hidden',padding:5,paddingTop:3,paddingBottom:3}}>
			  
			
			     {this.makemenus()}	
			 
			   </ScrollView >			   
				  
			<View style={{flexDirection:'column',bottom:20}}>
				{this.getfoodlistview()}
			</View>		
		 
		   
		</ScrollView>	
		
			<View style={{height:35,backgroundColor:'#FFF'}}>
			      <View style={{ flex: 1, backgroundColor: '#FFF',flexDirection: 'row',borderColor:'#f47239',
					}}> 
					  <View style={{flex:.35,  justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>
					 <Text style={{marginLeft:15,width:50, textAlign :'center' }}>{'Total'}</Text>
					  <Text style={{marginLeft:15,width:30, textAlign :'center' }}>{'Rs. '}</Text>
					  <Text style={{width:50, textAlign :'left' }}>{summycart}</Text>
					  
					  </View>
					  <View style={{flex:.25, }}><Text>{''}</Text></View>
					  
					  <View style={{flex:.40,justifyContent: 'center',alignItems: 'center',flexDirection: 'row',}}>		      
						<TouchableOpacity  onPress={this.go_ahead}>
						 <View style={{flexDirection: 'row'}}>
						  <Text style={{width:60, textAlign :'center',color:'#f47239' }}>{'Checkout'}</Text>
						  <Image style={styles.home_go} source={require('../images/go.png')} />
						  </View>
					   </TouchableOpacity>
						 </View>		  
					</View>		  
			  </View>
			  
		  </DrawerLayoutAndroid>	 
			  
		  </View>
		  </DrawerLayoutAndroid>
		
		);
	  
  }
  
});


const styles = StyleSheet.create({
  container: {
     flexDirection: 'column',
      flex: 1,
	 
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
   bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 400,
        height: 250,
	    borderRadius:7
    },
	view_part:	{ 
	flex: .40,
	borderColor:'#FFF',
	borderWidth:2,
	flexDirection: 'column',
	borderRadius:7,
	paddingTop:2,
	},
	 home_minus:{
		height:20,
		width:20,
	},
	home_left:{
		height:16,
		width:16,
	},
	home_go:{
		height:16,
		width:16,
		left:3,
		top:2,
	},
		bar_part:{
		flex:.17,
		backgroundColor: '#000',
		opacity: 0.8, 
		borderRadius:4,
		paddingLeft:15},
});

AppRegistry.registerComponent('Middlecomponent', () => Middlecomponent);

module.exports = Middlecomponent;