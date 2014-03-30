// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-class", 
         "dijit/_TemplatedMixin",  
		 "de/vommond/_Widget",
		 "de/vommond/Logger",
		 "dojo/date/locale",

], function(declare, WidgetBase, css, TemplateMixin,_Widget,Logger,locale) {

	return declare("de.vommond.TimeLabel", [ WidgetBase, TemplateMixin,_Widget], {
		
		templateString : '<div class="VommondTimeLabel">'+
							'<div class=" VommondDashletLabel" data-dojo-attach-point="label">'+
							'</div>'+
							'<div class="VommondDashletWidgetContainer">'+
								'<div class="VommondDashletLabelValue" data-dojo-attach-point="valueLabel">'+
								'</div>'+
							'</div>'+
						
						'</div>',
			
		defaultMethod : "showHome",
		
		hour : 1000 * 60 * 60,
		
		minute : 1000 * 60,
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.TimeLabel"});
		},
		
		setLabel:function(name){
			this.label.innerHTML = name;
		},
		
		setValue:function(value){
		
			
			var h = Math.floor(value / this.hour);
			var m = Math.floor((value % this.hour) / this.minute);
			var s = Math.floor((value % this.minute) / 1000);
			var ms = Math.floor(value % 1000);
			
			var txt = "";
			if(h > 0){
				txt += h + "h ";
			}
			if(h > 0 || m > 0){
				txt += m + "m ";
			}
			if(s > 0){
				txt += s + "s ";
			}
			// show millis only if now hours
			if(h ==0 && m == 0 && ms > 0){
				txt += ms + "ms ";
			}
			
			
			this.valueLabel.innerHTML=txt;
			
		}
		
		
	});
});