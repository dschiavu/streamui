// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dojo/_base/lang", 
         "dojo/dom-class", 
         "dojo/dom-attr", 
         "dijit/_TemplatedMixin",  
		 "dojo/window", 
		 "dojo/_base/window", 
		 "dojo/dom-class", 
		 "de/vommond/Logger"

], function(declare, lang, css, domAttr, TemplateMixin, window, baseWindow, css, dom,_Widget,Logger) {

	return declare("de.vommond._Dialog", [], {
		
		
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond._Dialog"});
		},
		
		startup : function() {
			this.log.log(2,"startup","enter");
			
			
	
		},
		
		
		showDialog:function(node){
			this.log.log(0,"showDialog","enter");
			
			this._dialogBackground = document.createElement("div");
			css.add(this._dialogBackground, "VommondDialogBackground");
			
			
			var container = document.createElement("div");
			css.add(container, "VommondDialogContainer");
			this._dialogBackground.appendChild(container);
			
			container.appendChild(node);
			baseWindow.body().appendChild(this._dialogBackground);
			
		
		},
		
		closeDialog:function(){
			
			this.beforeCloseDialog();
			
			if(this._dialogBackground){
				baseWindow.body().removeChild(this._dialogBackground);
			}
			
			this._dialogBackground = null;
			
		},
		
		
	
		
		beforeCloseDialog:function(){
			
		},
		

		
		

		
		
	});
});