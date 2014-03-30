// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare"

], function(declare) {
	// Return the declared class!
	return declare("de.vommond.Logger", [], {

    
	debugLevel : 1,
	
	prefix : "",
	
	constructor: function(params){		
		this.className = params.className;		
	},
	
	error: function(method, message){
		var m = this.className + "."+method;
		console.error(m + " >> " + message);
	},
	
	warning: function(level,method, message){
		var m = this.className + "."+method;
		if(this.debugLevel >= level){
			if(this.prefix){
				if(m.indexOf(this.prefix) == 0){
					console.debug(m + " >> " + message);
				}
			}else{
				console.debug(m + " >> " + message);
			}
		}	
	},	
	
	log:function(level, method, message){
		var m = this.className + "."+method;
		if(this.debugLevel > level){
			if(this.prefix){
				if(m.indexOf(this.prefix) == 0){
					console.debug(m + " >> " + message);
				}
			}else{
				console.debug(m + " >> " + message);
			}
		}		
	},
	
	
	
	});
});