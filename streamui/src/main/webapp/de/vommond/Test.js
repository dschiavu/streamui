// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-style", 
         "dojo/_base/lang", 
         "dojo/dom-class", 
         "dojo/dom-attr", 
         "dijit/registry", 
         "dojo/query", 
         "dijit/_TemplatedMixin",  
         "dojo/_base/xhr",
         "dojo/request", 
		 "dojo/window", 
		 "dojo/_base/window", 
		 "dojo/dom-class", 
		 "dojo/dom", 
		 "dojo/touch", 
		 "dojo/_base/event", 
		 "dojo/date", 
		 "dojo/cookie", 
		 "dojo/hash", 
		 "dojo/topic",
		 "dojo/io-query",
		 "dojo/parser",
		 "de/vommond/Logger"

], function(declare, WidgetBase, domStyle, lang, css, domAttr, registry, query, TemplateMixin, xhr, request, 
			window, baseWindow, css, dom, touch, event, date, cookie, hash, topic, ioQuery, parser, Logger) {

	return declare("de.vommond.Test", [ WidgetBase, TemplateMixin], {

		templateString : '<div class="VommondTest">'+
							'<div class="content"  data-dojo-attach-point="content">'+
							'</div>'+
						'</div>',
						

		postCreate: function(){
			this.log = new Logger({className : "de.vommond.Test"});
		},
		
		startup : function() {
			this.log.log(2,"startup","enter");

			for(key in this){
			
				if(key.indexOf("test") == 0){
					if(this[key] instanceof Function){
						
						this.onBeforeTestCase();
						
						this[key]();
						
						var result = this.getResult();
						
						var div = document.createElement("div");
						css.add(div, "VommondTestCase");
						div.innerHTML = key + " (" + result.ok + " / " + result.error + " / " + result.runs+")";
						
						
						for(var i=0; i< result.errorMessages.length; i++){
							
							var message = document.createElement("div");
							css.add(message, "VommondTestErrorMessage");
							message.innerHTML = result.errorMessages[i];
							div.appendChild(message);
						}
						
						this.content.appendChild(div);
					}
				}
			}
		
	
		},
		
		onBeforeTestCase:function(){
			
			this._result = {ok:0, error:0, runs : 0, errorMessages : []};
		},
		
		getResult:function(){
			return this._result;
		},
		
		
		assertTrue:function(result, message){
			this._result.runs++;
			if(result){
				this._result.ok++;
			} else {
				this._result.error++;
				this._result.errorMessages.push(message);
			}
		},

		
		

		

		
	});
});
