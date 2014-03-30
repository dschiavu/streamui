// Include basic Dojo, mobile, XHR dependencies along with
/**
 * Copyright Klaus Schaefers
 * http://www.vommond.de
 */
define([ "dojo/_base/declare", 
         "dojo/dom-style", 
         "dojo/_base/lang", 
         "dojo/on",
         "dojo/dom",
         "dojo/hash", 
         "dojo/cookie",
         "dojo/topic",
         "dojo/dom-class", 
         "dojo/dom-geometry",
         "dijit/registry", 
         "dojo/query", 
         "dojo/io-query",
         "dijit/_TemplatedMixin",  
		 "dojo/_base/window", 
		 "dojo/dom-class", 
		 "dojo/touch", 
		 "dojo/on", 
		 "dojo/_base/event", 
		 "dojo/request/xhr",
		 "dojo/dom-geometry",
		 "de/vommond/Page",
		 "de/vommond/Logger",
		 // imported in page
		 "de/vommond/streamui/Topology",
		 "de/vommond/streamui/TopologyList"
		 
], function(declare, domStyle, lang,on,dom, hash,cookie, topic, css,domGeom, registry, query, ioQuery, TemplateMixin,  
			baseWindow, css, touch, on, event, xhr, domGeom, Page, Logger) {
	// Return the declared class!
	return declare("de.vommond.streamui.Page", [ Page], {

		templateString : '<div class="StreamUI">'+
		
							'<div class="StreamUIMainMenu" data-dojo-attach-point="queryMenu">' + 
								'<div class="StreamUIMainMenuHeader">'+
									'<a href="#method=showHome" class="StreamUIMainMenuItem">StreamUI</a>'+	
									'<div data-dojo-attach-point="breadcrumbs" class="StreamUIMainMenuBreadCrumbs">'+
									'</div>' +		
									'<div data-dojo-attach-point="submenu" class="StreamUISubMenu">'+
									'</div>' +	
								'</div>' +		
								
//								'<div class="StreamUIMainMenuBody">'+
//									'<a href="#method=showTopology&id=1" class="StreamUIMainMenuItem">Topology 1</a>'+
//									'<a href="#method=showTopology&id=2" class="StreamUIMainMenuItem">Topology 2</a>'+
//									'<a href="#method=showTopology&id=3" class="StreamUIMainMenuItem">Topology 3</a>'+
//									'<a href="#method=showTopology&id=4" class="StreamUIMainMenuItem">Topology 4</a>'+
//								'</div>' +
							'</div>' +
							'<div class="StreamUIContainer" data-dojo-attach-point="content"></div>' +
						  '</div>',

		
		dataWidgetExpanded : false,
		
		headerHeight : 40,
		
		debug : false,
		
		postCreate: function(){
			this.log = new Logger({className : "cde.vommond.streamui.Page"});
		},
		
		startup: function(){
			this.log.log(0,"startup", "entry > " + this.debug);
			this.inherited(arguments);
		
			var pos = domGeom.position(baseWindow.body());
			
			this.content.style.minHeight = pos.h-this.headerHeight +"px";
			//this.content.style.minWidth = pos.w +"px";
			
			 
		},
		
		onContenContainerCreated:function(div){
			
			
			this.containerNode = div;
			this.breadcrumbs.innerHTML ="";
			this.submenu.innerHTML="";
		},
		
		makeFullScreen:function(){
			
			var pos = domGeom.position(baseWindow.body());
			this.containerNode.style.height = pos.h-this.headerHeight+"px";
		},
		
		
		setBreadCrumbs:function(crumbs){
			
			for(var i=0; i < crumbs.length; i++){
				
				var span = document.createElement("span");
				span.innerHTML = "&#62";
				this.breadcrumbs.appendChild(span);
				
				var a = document.createElement("a");
				a.href = crumbs[i].href;
				a.innerHTML = crumbs[i].name;
				this.breadcrumbs.appendChild(a);
			}
			
			
		},
		
		/***************************************************************************
		 * Home :Show list of contents
		 ***************************************************************************/
		showHome:function(){
			
		
			
			this.loadView("html/main.html");
			
			var topologies = this._doGet("rest/v1/topology");
			
			var w = registry.byId("topologyList");
			w.setValue(topologies);
			
			
			//this.showToplogy();
		},
		
		showToplogy:function(params){
			
			this.loadView("html/topology.html", null, "StreamUITopologyView");
			this.makeFullScreen();
			
			this.setBreadCrumbs([{"href" : "#method=showToplogy&id=" +params.id, "name" : params.id }]);
			
			this.createTopologySubmenu();
			
			var topology = this._doGet("rest/v1/topology/" +params.id +".json");
		
			var w = registry.byId("topologyWidget");
			w.setTopology(topology);
			w.own(on(w, "layoutChanged", lang.hitch(this, "onLayoutChange")));
			
			
			
			setTimeout(lang.hitch(this,"getStatus", topology),300);
		},
		
		emptyToplogy:function(params){
			
			var x = confirm("Do you really want to delete all events?");
			if(x){
				this._doDelete("rest/v1/topology/" + params.id + "/events");
			}
		
			this.setHash("method=showHome");
			
		},
		
		onLayoutChange:function(id, layout){
			this._doPost("rest/v1/topology/" + id+"/layout", layout);
		},
		
		createTopologySubmenu:function(){
			
			var div = document.createElement("div");
			css.add(div, "StreamUITopologySubMenu");
			
			var label = document.createElement("span");
			css.add(label, "StreamUITopologySubMenuLabel");
			label.innerHTML="<span class='glyphicon glyphicon-align-justify'>";
			div.appendChild(label);
			
			var pop = document.createElement("div");
			css.add(pop, "StreamUISubmenuPopup");
			div.appendChild(pop);
			
	
			var item = document.createElement("div");
			css.add(item, "StreamUISubmenuItem");
			item.innerHTML="Dark";
			pop.appendChild(item);
			
			item = document.createElement("div");
			css.add(item, "StreamUISubmenuItem");
			item.innerHTML="Light";
			pop.appendChild(item);
			
			
			item = document.createElement("div");
			css.add(item, "StreamUISubmenuItem");
			item.innerHTML="Graph";
			pop.appendChild(item);
			
			item = document.createElement("div");
			css.add(item, "StreamUISubmenuItem");
			item.innerHTML="Table";
			pop.appendChild(item);
			
			item = document.createElement("div");
			css.add(item, "StreamUISubmenuItem");
			item.innerHTML="Dashboard";
			pop.appendChild(item);
			
			
			this.submenu.appendChild(div);
			
			
			
		},
		
		getStatus:function(t){

			
			var w = registry.byId("topologyWidget");
			if(w){
				
				
				/**
				 * Simulate a little in here
				 */
				var status = {
						"id": "topologytest",
						"from": 0,
						"to": 1391809156950,
						components : {},
						instances: {}
						
				};
				var components = t.components;
				for(var i=0;i < components.length; i++){
					var comp = components[i];
					
					status.components[comp.id] = {
						id: comp.id,
						counts : {
							"Events" : Math.round(Math.random()* 100),
							"IO" : Math.round(Math.random()* 100)
						},
						receives:{},
						numberMean:{
							"Long" : Math.round(Math.random() *1000000 )
						},
						timeMean:{ 
							"Hours" : Math.round(Math.random() * 1000 * 60*60),
							"Seconds" : Math.round(Math.random() * 10000)
						},
						distribution:{},
						truesPercentage:{
							"Precision" : (Math.round(Math.random()* 100) /100),
							"Accuracy" : (Math.round(Math.random()* 100) /100)
						}
					};
					
					if(comp.sources){
						
						for(var j=0; j < comp.sources.length; j++){
							var source = comp.sources[j];
							status.components[comp.id].receives[source] = Math.round(Math.random()* 100);
						}
						
					}
					
				}
				
		
				w.setStatus(status);
				setTimeout(lang.hitch(this,"getStatus", t),3000);
			}			

			
		},
		
		
		
		

		
	});
});