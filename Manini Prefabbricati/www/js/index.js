/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
	
	connnection : true,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //this.onDeviceReady();
   },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onOfflineStatus : function(){
    	$('div[id="tap_home_contatti"],div[id="tap_home_cerca_citta"],div[id="tap_home_map"],div[id="tap_home_azienda"]').css({'opacity' : '0.5'}).off('click');
    	app.connection = false;
    },
    
    onOnlineStatus : function(){
    	$('div[id="tap_home_contatti"],div[id="tap_home_cerca_citta"],div[id="tap_home_map"],div[id="tap_home_azienda"]').css({'opacity' : '1'});
    	app.connection = true;
    },
    
    backButtonHome : function(){
    	document.removeEventListener("backbutton", app.backButtonHome, false);
    	navigator.app.exitApp();
    },

    onDeviceReady: function() {

        StatusBar.overlaysWebView(false);

		document.addEventListener('offline', app.onOfflineStatus, false);
	    document.addEventListener('online', app.onOnlineStatus, false);
	    document.addEventListener("backbutton", app.backButtonHome, false);
        $(function() {
            FastClick.attach(document.body);
        });
        
        if(app.checkConnection){
        	app.getListaCitta();
        	app.onOnlineStatus();
        } else {
        	app.onOfflineStatus();
        }
        
        $(window).resize(function() {
			resize_container();
		});
        
        function resize_container(){
        	var footer_h = $('#box-footer-index').height()+1;
        	$('#box-wrap-index').css('margin','0px auto -'+footer_h+'px auto');
        	$('#push').height(footer_h);
        	
        	$('.box_button_menu_home').find('h1').css('font-size', ($(window).width()*0.07)+'px');
        	$('.box_button_menu_indietro').find('h3').css('font-size', ($(window).width()*0.04)+'px');
        }
        
        resize_container();
                
        var box_menu_1 = $('div[id="box_menu_first"]');
        var box_menu_2 = $('div[id="box_menu_second"]');
        
        var home_realizzazioni = $('div[id="tap_home_realizzazioni"]');
        var home_map = $('div[id="tap_home_map"]');
        var home_azienda = $('div[id="tap_home_azienda"]');
        var home_contatti = $('div[id="tap_home_contatti"]');
        var home_cerca_citta = $('div[id="tap_home_cerca_citta"]');
        
        var button_back = $('div[id="tap_home_indietro"]');
        var button_back = $('div[id="tap_home_indietro"]');
                       
        home_realizzazioni.on('click',function(){
        	
        	if(app.connection == false) return false;
        	
        	box_menu_1.fadeToggle('fast', function(){
        		box_menu_2.fadeToggle('fast');
        	});
        	
        }).dblclick(function(e){
        	  e.stopPropagation();
        	  e.preventDefault();
        	  return false;
        });
        
        button_back.on('click',function(){
        	
        	box_menu_2.fadeToggle('fast', function(){
        		box_menu_1.fadeToggle('fast');
        	});
        	
        }).dblclick(function(e){
      	  e.stopPropagation();
    	  e.preventDefault();
    	  return false;
        });
        
        home_map.on('click',function(){
        	if(box_menu_1.is(":animated") || app.connection == false) return false;
        	$('body').append('<div class="preloader"><p>Caricamento...</p></div>');
        	window.sessionStorage.setItem('section', 'mappa');
        	document.removeEventListener("backbutton", app.backButtonHome, false);
        	window.open('main.html', '_self', 'location=no')
        	        	
        }).dblclick(function(e){
        	  e.stopPropagation();
        	  e.preventDefault();
        	  return false;
        });
        home_cerca_citta.on('click',function(){
        	if(box_menu_1.is(":animated") || app.connection == false) return false;
        	$('body').append('<div class="preloader"><p>Caricamento...</p></div>');
        	window.sessionStorage.setItem('section', 'cerca_citta');
        	document.removeEventListener("backbutton", app.backButtonHome, false);
        	window.open('main.html', '_self', 'location=no')
        	
        }).dblclick(function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	return false;
        });
        home_azienda.on('click', function(){
        	window.open('http://www.manini.it', '_system', 'location=yes')
        });
        
        home_contatti.on('click', function(){
        	window.location.href = 'mailto:com@manini.it';
        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    getListaCitta : function(){
    	$.ajax({
	       	url : 'http://manini.overcapital.eu/?app=1&operation=lista_citta',
	   		type : 'GET',
	   		dataType : 'jsonp',
	   		success : function(json){
	   			if(json == undefined || json == null){
	   				return;
	   			}else{
	   				window.localStorage.setItem('lista_citta', JSON.stringify(json));
	   			}
	   		}

		});
    },
    
    checkConnection : function(){
    	var networkState = navigator.network.connection.type;
    	console.log(networkState);
    	if(networkState != 'none'){
    		return true;
    	} else {
    		return false;
    	}
    }
    
};
