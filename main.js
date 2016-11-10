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
 1      3/10/16     Osipe          TaskNumber          Created
 ==================================================================================
 */
// var React = require('react-native');

import React from 'react';

import {
    Navigator,
    StyleSheet,
    // Deliverto,
    // other React Native modules
} from 'react-native';

// var {
//   Navigator,
//   StyleSheet,
//   Deliverto,
// } = React;

var Login = require('./components/login');
var Beginhome = require('./components/begin_home');
var Deliverto = require('./components/deliverto');
var Ordersummary = require('./components/ordersummary');
var Payment = require('./components/payment');
var Confirmpay = require('./components/confirm');
var Trackmyorder = require('./components/trackmyorder');
var Wallet = require('./components/wallet');
var Walletfull = require('./components/walletfull');
var Myorder = require('./components/myorder');
var Profile = require('./components/profile');
var Placefold = require('./components/placefold');
var Midhome = require('./components/middlehome');
var Selectlocation = require('./components/selectlocation');
// var Test = require('./components/test');
var ROUTES = {
  login: Login,
  behome:Beginhome,
  deliverto:Deliverto,
  ordersummary:Ordersummary,
  payment:Payment,
  confirmpay:Confirmpay,
  trackmyorder:Trackmyorder,
  wallet:Wallet,
  walletfull:Walletfull,
  myorder:Myorder,
  profile:Profile,
  placefold:Placefold,
  middlehome:Midhome,
  selectlocation:Selectlocation,
  // test:Test
};

module.exports = React.createClass({
  getInitialState: function() {

	return {
      setlocation: 2,
      areaname:'Coikbatore'	 ,catiesname:[], foodnamelist:[],foodpricelist:[],
	  productsalenum:0,accesstoken:'',tokentype:'',expiry:'',client:'',uid:'',totalprice:0
    }
  },
  setlocatoin:function(setlocation){
	  this.setState({userlocation:setlocation});
	  console.log(setlocation);
	  console.log("placefold");
  },
  setarea:function(areaname){ //set an area name
	  this.setState({areaname:areaname});
  },
  setcaties:function(catiesarray){
	  this.setState({catiesname:catiesarray});// move the catiesnames to middle home
  },
  setfoodidlist:function(idarray){// get the food id array
	  this.setState({foodidlist:idarray});
  },
  setfoodnamelist:function(namearray){//get the food name list asin
	  this.setState({foodnamelist:namearray});
  },
  setfoodpricelist:function(pricearray){
	  this.setState({foodpricelist:pricearray})
  },
  setproductsalenum:function(salearray){
	  this.setState({productsalenum:salearray});
  },
  setaccesstoken:function(val){
	  this.setState({accesstoken:val});
  },
  settokentype:function(val){
	   this.setState({tokentype:val});
  },
  setexpiry:function(val){
	 this.setState({expiry:val});
  },
  setclient:function(val){
	 this.setState({client:val})  ;
  },
  setuid:function(val){
	this.setState({uid:val})  ;
  },
  settotalprice: function(val){
	this.setState({totalprice:val})  ;
  },
  setpaymenttype:function(val){
	this.setState({paymenttype:val})  ;
  },
  setorderid:function(val){
	 this.setState({orderid:val})  ;
  },
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator}

	selectedlocation={this.setlocatoin}
	ourlocateid={this.state.setlocation}

	setareaname={this.setarea}
	areaname={this.state.areaname}

    setcaties={this.setcaties}
	catiesname={this.state.catiesname}

	setfoodidlist={this.setfoodidlist}
	foodidlist={this.state.foodidlist}

	setfoodnamelist={this.setfoodnamelist}
	foodnamelist={this.state.foodnamelist}

	setfoodpricelist={this.setfoodpricelist}
	foodpricelist={this.state.foodpricelist}

	setproductsalenum={this.setproductsalenum}
	productsalenum={this.state.productsalenum}

	setaccesstoken={this.setaccesstoken}// access-token
	accesstoken={this.state.accesstoken}

	settokentype={this.settokentype}  //set-token
	tokentype={this.state.tokentype}

	setexpiry={this.setexpiry} //setexpiry
	expiry={this.state.expiry}

	setclient={this.setclient}
	client={this.state.client}

	setuid={this.setuid} //user id
	uid={this.state.uid}

	settotalprice={this.settotalprice}
	totalprice={this.state.totalprice}

	setpaymenttype={this.setpaymenttype}
	paymenttype={this.state.paymenttype}

	setorderid={this.setorderid}
	orderid={this.state.orderid}
	/>;
  },
  render: function() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
