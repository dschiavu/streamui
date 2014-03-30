// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare",  
         "dojo/request/xhr",
         "dojo/request", 
		 "dojo/json",
		 "dojo/cookie",
		 "dojo/_base/event",
		 "de/vommond/Logger"

], function(declare, xhr, request,json,cookie,event, Logger) {

	return declare("de.vommond._Widget", [], {
		
		_statusMap: {},
		
		_cookieName : "VommondWidgetCookie",

		_setStatus:function(key, value){
			this._statusMap[key] = value;
			var j = json.stringify(this._statusMap);
			//console.debug(j);
			cookie(this._cookieName,j);
		},
		
		_getStatus:function(key){
			var j = cookie(this._cookieName);
			//console.debug(j);
			if(j && j!=""){
				this._statusMap = json.parse(j);
				return this._statusMap[key];
			}
			return 0;
		},
		
		_doGet:function(url, callback){
			return this._request(url, null, callback, "GET");
		},
		
		
		_doPost:function(url, data, callback){			
			return this._request(url, data, callback, "POST");			
		},
		
		_doPut:function(url, data, callback){			
			return this._request(url, data, callback, "PUT");			
		},
		
		_doDelete:function(url, data, callback){			
			return this._request(url, data, callback, "DELETE");			
		},
		
		
		_request:function(url, data, callback, method){
			var sync = true;
			if(callback){
				sync = false;
			}
			
			var params = {  
							handleAs: "json",
						    method : method,
						    sync: sync
						};
			
			if(data){
				params.data = json.stringify(data);
			}
		
			var me = this;
			var result = null;
			request(url, params).then(function(data){				  					
				  if(!callback){
				
					  result = data;
				  } else {						
					  if(me[callback]){
						  me[callback](data);
					  } else {						
						  callback(data);
					  }							
				  }				  
			  }, function(err){
				  console.debug(err);
			  }, function(evt){
			    
			  });
			
			return result;
		},
		
		
		cleanUpTempListener:function(){
			
			if(this._tempListeners){
				
				for(var i=0; i < this._tempListeners; i++){
					this._tempListeners[i].remove();
				}
				
				this._tempListeners = null;
			}
			
		},
		
		tempOwn:function(listener){
			
			if(!this._tempListeners){
				this._tempListeners = [];
			}
			this._tempListeners.push(listener);
		},
		
		
		stopEvent:function(e){
			if(e){
				event.stop(e);
				
				  
				 e.preventDefault();
				 e.stopPropagation();
			}
		},
		
	
		
		

		
	});
});
