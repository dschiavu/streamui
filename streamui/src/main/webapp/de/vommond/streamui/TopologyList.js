// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-class", 
  	   	 "dojo/dom-geometry",
         "dijit/_TemplatedMixin",  
		 "de/vommond/_Widget",
		 "de/vommond/Logger",
	
		 "de/vommond/streamui/Topology",

], function(declare, WidgetBase, css, domGeom, TemplateMixin,_Widget,Logger,Topology) {

	return declare("de.vommond.streamui.TopologyList", [ WidgetBase, TemplateMixin,_Widget], {
		
		templateString : '<div class="StreamUIToplogyList">'+
							'<div class="StreamUIToplogyListContainer" data-dojo-attach-point="container">'+
							
							'</div>'+
						
						'</div>',
			
	
		rows : 2,
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.streamui.TopologyList"});
		},
		


		
		setValue:function(value){
			
			this.container.innerHTML ="";
			var parent = document.createElement("div");
			css.add(parent, "container");
			var i = 0;
			var row = null;
			
			var widgets = {};
			for(var id in value ){
				
				if(i % this.rows == 0){
					row = document.createElement("div");
					css.add(row, "row StreamUIToplogyListRow");
					parent.appendChild(row);
				}
				
			
				
				var item = document.createElement("div");
				css.add(item, "col-md-6 StreamUIToplogyListItem");
				row.appendChild(item);
				
				
				var div = document.createElement("div");
				css.add(div, "col-md-6 StreamUIToplogyListItemContainer");
				item.appendChild(div);
			
				
			
				
				var wrapper = document.createElement("a");
				css.add(wrapper, "StreamUIToplogyListTopologyWrapper");
				wrapper.href ="#method=showToplogy&id="+id;
				div.appendChild(wrapper);
				
				var widget = new Topology();
				widget.placeAt(wrapper);
				widgets[id] = widget;
			
				
				
				var info = document.createElement("div");
				css.add(info, "StreamUIToplogyListInfoWrapper");
				div.appendChild(info);
				
				var a =href=document.createElement("a");
				css.add(a,"StreamUIToplogyListLabel");
				a.href ="#method=showToplogy&id="+id;
				a.innerHTML = id;
				info.appendChild(a);
				
		
			
//				
//				var del =href=document.createElement("a");
//				del.href ="#method=emptyToplogy&id="+id;
//				del.innerHTML = "[ Clean ]";
//				div.appendChild(del);
				
				
				i++;
			}
		
			// add stuff to domso it is drawn. then we can to the autoscalling stuff
			this.container.appendChild(parent);
			
			
			for(var id in value ){
				widgets[id].setAutoScale(true);
				widgets[id].setTopology(value[id]);
			}
			
		},
		
		
		
		
		
	});
});