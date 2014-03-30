// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-style", 
         "dojo/_base/lang", 
         "dojo/dom-class", 
         "dojo/dom-attr", 
         "dijit/registry", 
         "dojo/dom-construct",
         "dojo/query", 
         "dijit/_TemplatedMixin",  
         "dojo/request/xhr",
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
		 "dojo/json",
		 "de/vommond/_Widget",
		 "de/vommond/Logger"

], function(declare, WidgetBase, domStyle, lang, css, domAttr, dijit, domConst, query, TemplateMixin, xhr, request, 
			window, baseWindow, css, dom, touch, event, date, cookie, hash, topic, ioQuery, parser,json,_Widget,Logger) {

	return declare("de.vommond.Page", [ WidgetBase, TemplateMixin,_Widget], {

		templateString : '<div class="page start">'+
							'<div class="content"  data-dojo-attach-point="content">'+
							'</div>'+
						'</div>',
						
		defaultMethod : "showHome",


		postCreate: function(){
			this.log = new Logger({className : "de.vommond.Page"});
		},

		startup : function() {
			this.log.log(2,"startup","enter");

			topic.subscribe("/dojo/hashchange", lang.hitch(this,"onHashChange"));
			
			this.initURL();
		
	
		},

		initURL:function(){
			var href = location.href;
			
			var params = {method : this.defaultMethod};
			
			if(href.indexOf("#") >=0){
				var hash = href.substring(href.indexOf("#") + 1, href.length);
				params = ioQuery.queryToObject(hash);
			}
			this.dispatchHash(params);
		},
	
		setHash:function(h){
			hash(h);
		},
		
		onHashChange:function(hash){
			this.log.log(2,"onHashChange","enter > " + hash);
			
			var params = {method : this.defaultMethod};
			if(hash  && hash!=""){
				params = ioQuery.queryToObject(hash);
			} 
			
			this.dispatchHash(params);
		},
		
		dispatchHash:function(params){
			this.log.log(3,"dispatchHash","enter");
			
			if(params.method){
				if(this[params.method]){
					this[params.method](params);
				} else {
					this.log.error("onHashChange", "No method with name " + params.method);
				}
			}
		},
		
		onContenContainerCreated:function(div){
			
		},
		
		loadView : function(url, callBack, customCSS) {
			this.log.log(3,"loadView","enter > "  + url);
			
			/**
			 * Set custom style to body.
			 */
			if(this._lastBodyCSS){
				css.remove(baseWindow.body(),this._lastBodyCSS );
				this._lastBodyCSS = null;
			}
			
			if(customCSS){
				css.add(baseWindow.body(),customCSS);
				this._lastBodyCSS = customCSS;
			}
			
		
			/**
			 * For some shity reason dojo does not do this!
			 */
			dojo.forEach(dijit.findWidgets(this.content), function(w) {
			    w.destroyRecursive();
			});
			
			/**
			 * CleanUp
			 */
			this.cleanUpTempListener();
			this.content.innerHTML="Loading";
			  
			/**
			 * Do the loading
			 */
			var container = this.content;
			var me  = this;
			request(url, {
				    handleAs: "text",
				    method : "GET",
					preventCache : true,
				    sync: true
			}).then(function(data){
				
				  container.innerHTML="";
					
				  var div= document.createElement("div");
				  css.add(div,"VommondContentContainer");
				  me.onContenContainerCreated(div);
				  div.innerHTML = data;
				  me._tempContainer = div;
			
				  container.appendChild(div);
				  parser.parse(container);
					
				  if(callBack){
							// TODO if string
				  if(me[callBack]){
							me[callBack]();
						} else {
							// TODO: check if function
							callBack();
						}
						
					}
			  }, function(err){
			   
			  }, function(evt){
			    
			  });
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
		}
		
		

		
	});
});
