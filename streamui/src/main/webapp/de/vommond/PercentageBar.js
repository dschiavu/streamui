// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-class", 
         "dijit/_TemplatedMixin",  
		 "de/vommond/_Widget",
		 "de/vommond/Logger",
		 "de/vommond/_Color",

], function(declare, WidgetBase, css, TemplateMixin,_Widget,Logger,Color) {

	return declare("de.vommond.PercentageBar", [ WidgetBase, TemplateMixin,_Widget,Color], {
		
		templateString : '<div class="VommondPercentageBar">'+
							'<div class="VommondPercentageBarLabel VommondDashletLabel" data-dojo-attach-point="label">'+
							'</div>'+
							'<div class="VommondPercentageBarContainer VommondDashletWidgetContainer">'+
								'<div class="VommondPercentageBarLine VommondDashletBar" data-dojo-attach-point="bar">'+
								'</div>'+
							'</div>'+
						
						'</div>',
			
		defaultMethod : "showHome",
		
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.PercentageBar"});
		},
		
		setLabel:function(name){
			this.label.innerHTML = name;
		},
		
		setValue:function(value){
			this.bar.style.width = value*100 +"%";
			
			if(this.dynamicColor){
				this.bar.style.backgroundColor = this.mixColor(value);
			}
			
		}
		
		
	});
});