// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-class", 
         "dijit/_TemplatedMixin",  
		 "de/vommond/_Widget",
		 "de/vommond/Logger",

], function(declare, WidgetBase, css, TemplateMixin,_Widget,Logger) {

	return declare("de.vommond.NumberLabel", [ WidgetBase, TemplateMixin,_Widget], {
		
		templateString : '<div class="VommondTimeLabel">'+
							'<div class=" VommondDashletLabel" data-dojo-attach-point="label">'+
							'</div>'+
							'<div class="VommondDashletWidgetContainer">'+
								'<div class="VommondDashletLabelValue" data-dojo-attach-point="valueLabel">'+
								'</div>'+
							'</div>'+
						
						'</div>',
			
		defaultMethod : "showHome",
		
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.NumberLabel"});
		},
		
		setLabel:function(name){
			this.label.innerHTML = name;
		},
		
		setValue:function(value){
			
			if(value > 1000000){
				value = Math.floor(value / 1000000) + "M";
				this.valueLabel.innerHTML = value;
				return;
			}
			
			if(value > 1000){
				value = Math.floor(value / 1000) + "K";
				this.valueLabel.innerHTML = value;
				return;
			}
			
			if(value > 1 ){
				value = Math.floor(value) ;
				this.valueLabel.innerHTML = value;
				return;
			}
			
		
				value = (Math.round(value * 1000)) / 1000;
				this.valueLabel.innerHTML = value;
				return;
			
			
		}
		
		
	});
});