// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-class", 
  	   	 "dojo/dom-geometry",
         "dijit/_TemplatedMixin",  
		 "de/vommond/_Widget",
		 "de/vommond/Logger",
	
		 "de/vommond/_Color",

], function(declare, WidgetBase, css, domGeom, TemplateMixin,_Widget,Logger,Color) {

	return declare("de.vommond.BarChart", [ WidgetBase, TemplateMixin,_Widget,Color], {
		
		templateString : '<div class="VommondBarChart">'+
							'<div class="VommondBarChartLabel VommondDashletLabel" data-dojo-attach-point="label">'+
							'</div>'+
							'<div class="VommondBarChartContainer VommondDashletWidgetContainer" data-dojo-attach-point="container">'+
							
							'</div>'+
						
						'</div>',
			
		bins : 30,
		
		max :0,
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.BarChart"});
		},
		
		startup : function() {
			this.log.log(2,"startup","enter");
			
	
			
	
		},
		
		setLabel:function(name){
			this.label.innerHTML = name;
		},
		
		setValue:function(value){
			
	
			
			this.init();
			
			if(!this.values){
				this.values =[];
				for(var i=0; i < this.bins; i++){
					this.values[i] = 0;
				}
			}
			
			
			this.values.shift();
			this.values.push(value);
			
			this.max = Math.max(this.max, value);
		
			for(var i=0; i < this.bins; i++){
				var bar = this.bars[i];
				bar.style.height = (this.values[i] / this.max)*100 +"%";
			}
			
		},
		
		
		init:function(){
			if(!this.bars){
				this.bars = [];
				
				var pos = domGeom.position(this.container);
				var barWidth = pos.w / (this.bins *2);
			
				
				for(var i=0; i < this.bins; i++){
					var bar = document.createElement("div");
					css.add(bar, "VommondDashletBar VommondBarChartLine");
					bar.style.left = i*barWidth*2 + "px";
					bar.style.width =barWidth+"px";
					this.container.appendChild(bar);
					this.bars[i] = bar;
				}

			}
		}
		
		
		
	});
});