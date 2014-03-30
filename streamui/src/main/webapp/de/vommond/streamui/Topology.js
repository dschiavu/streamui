// https://www.dashingd3js.com/table-of-contents

// https://github.com/mbostock/d3/wiki/Cluster-Layout
define([
         "dojo/_base/declare",
         "dojo/_base/event",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/dom-class",  
         "dojo/keys",
         "de/vommond/Logger", 
         "dojo/on",
         "dojo/_base/lang",
         "dojo/store/Memory",
         "dojo/dom-attr",
         "dojo/cookie",
         "dojo/json",
         "dojo/dom-geometry",
         "dojo/Evented",
         "de/vommond/_Color",
		 "de/vommond/_Widget",
		 "de/vommond/_DragNDrop",
		 "de/vommond/Dashlet"
         ], 
      

function(declare, event,_WidgetBase,_TemplateMixin, css,  keys, Logger,  on, lang, Store, attr,cookie,json, domGeom,Evented,
		Color, _Vommond, _DragNDrop, Dashlet){

    return declare("de.vommond.streamui.Topology", [_WidgetBase, _TemplateMixin,_Vommond,_DragNDrop, Color, Evented], {
    	
	
   	templateString:'<div class="StreamUITopology">' +
//   						'<div class="StormUITopologyConfig">' +
//		   					'<div class="StormUITopologyConfigHeader">'+
//								'<span class="glyphicon glyphicon-cog"></span>'+	
//								'<h3>Config</h3>'+									
//							'</div>' +		
//							'<div class="StormUITopologyConfigBody">'+
//							
//   								'<a data-dojo-attach-point="cleanButton" class="StormUIButton">Reset</a>'+
//   							'</div>' +	
//   						'</div>'+
   						'<div class="StreamUITopologyCanvas">' +
   							'<div data-dojo-attach-point="svgContainer" class="StreamUITopologySVG"></div>'+
   							'<div data-dojo-attach-point="boxContainer" class="StreamUITopologyBoxes"></div>'+
    					'</div>'+
    				'</div>',
    
    				   
    lineFunction : d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("basis"),
      	
    paddingH : 100,
    
    paddingV : 75,
    
    boxHeight : 100,
    
    boxWidth : 250,
    
    defaultLineColor : "#6D6D6D",
    
    zoom : 1,

    defaultLineWidth : 20,
    
    paddingTop : 10,
    
    paddingLeft : 10,
  
    
    
    
    /**
     * change what to show.
     * 
     */
    lineEventType :"receives", // emits
	
    
	constructor: function(){
		this.logger = new Logger({"className":"de.vommond.streamui.Topology"});
		this.logger.log(2,"constructor", "entry");	
	
	},
	
	
	postCreate: function(){
		this.logger.log(0,"postCreate", "entry");
		
		//this.own(on(this.simButton,"click", lang.hitch(this,"simulate")));
		if(this.cleanButton)
			this.own(on(this.cleanButton,"click", lang.hitch(this,"cleanup")));
	
	
		
		
	
		
	
		 
	},
	
	setAutoScale:function(scale){
		this.autoScale = true;
	},
	
	setZoom:function(zoom){
		this.zoom =zoom;
	},
	
	setLayout:function(layout){
		this.layout =layout;
	},
	
	onLayoutChanged:function(){
		this.emit("layoutChanged", this.topology.id, this.layout);
	},
	
	
	setTopology:function(topology){

		this.topology = topology;
		
		if(this.topology.layout){
			this.layout = this.topology.layout;
		}
			
		if(!this.layout){
			this.layout = this.getAutoLayout(topology);
		}
		
		if(this.autoScale){
			this.scale();
		}

		this.render(topology, this.layout);
	},
	

	
	render:function(t, layout){
		
		// get overall size
		
		this.cleanUpTempListener();
		
		this.boxDiv = {};
		
		this.dashlets = {};

		this.boxLines = {};
		
		this.boxInstance={};
		
		/**
		 * first layout the topology
		 */
		var pos = domGeom.position(this.domNode);

	
		// create svg
		var bodySelection = d3.select(this.svgContainer);		 
		this.svg = bodySelection.append("svg")
		                        .attr("width", pos.w)
		                        .attr("height",pos.h );
		

		var components = t.components;
		for(var i=0;i < components.length; i++){
			/**
			 * draw box
			 */
			var bolt = components[i];
			var pos  = layout.components[bolt.id];
			var box =this.drawBox(bolt.id, pos);
			css.add(box, "StormUITopology"+bolt.type);
			
			if(!this.autoScale){
				this.registerDragOnDrop(box, bolt.id , "onBoxStart", "onBoxMove", "onBoxMoveEnd", "onBoxClick");
			}
			
			
			/**
			 * Lines
			 */
			var sources = bolt.sources;
			if(sources){
				for(var j=0; j < sources.length; j++){
					var source = sources[j];
					var to = layout.components[bolt.id];
					var from = layout.components[source];
					
					var line = this.drawLine(from, to);
					
					if(!this.boxLines[bolt.id]){
						this.boxLines[bolt.id] = {from : {}, to : {}  };
					}
					this.boxLines[bolt.id].from[source]=line;
					
					if(!this.boxLines[source]){
						this.boxLines[source] = {from : {}, to : {} };
					}
					this.boxLines[source].to[bolt.id] = line;	
				}
			}

			
		}
		
		//this.layout  = layout;
		
	},
	
	
	setStatus:function(status){
		
		if(this._isDisabled){
			return;
		}
		
	
		//TODO put in request animation frame
		
		/**
		 * update lines
		 */
		this._updateLines(status);
		
		/**
		 * update dashlets
		 */
		var components = status.components;
		for(compId in components){
			
			if(this.dashlets[compId]){
				var component = components[compId];
				this.dashlets[compId].setStatus(component);
			}
		}
		
		this._lastStatus = status;
	},

	
	
	
	_updateLines:function(status){
		
		var max = 0;
		

		var components = status.components;
		for(compId in components){
			var component = components[compId];
			if(component[this.lineEventType]){
				events = component[this.lineEventType];
				for(sourceID in events){
					max = Math.max(events[sourceID], max);
				}	
			}
		}
		
		
		for(compId in components){
			var component = components[compId];
			if(component[this.lineEventType]){
				events = component[this.lineEventType];
				
				for(sourceID in events){
					
					var value = events[sourceID] / max;
					var color = this.getColor(value);
					
					var lines = this.boxLines[compId];

					var svg = lines.from[sourceID];
					svg.transition().
			        	attr("stroke", color).
			        	attr("stroke-width", 10 + 20* value);
				
				}
			}
		}
		
	},
	
	
	setDisabled:function(id){
		
		var t = this.topology;

		var components = t.components;

		for(var i=0;i < components.length; i++){
			var comp = components[i];
			if(id!= comp.id){
				var box = this.boxDiv[comp.id];
				css.add(box,"StormUITopologyBoxDisabled");
				
				
			}	
			
			if(comp.sources){
				sources = comp.sources;
				for(var j=0; j < sources.length; j++){
					var sourceID = sources[j];
					
					var lines = this.boxLines[comp.id];

					var svg = lines.from[sourceID];
					svg.transition().
			        	attr("stroke", this.defaultLineColor).
			        	attr("stroke-width", 5);
				}
			}
		}
		
		this._isDisabled = true;
	},
	
	
	setEnabled:function(){
		
		var t = this.topology;

		var components = t.components;

		for(var i=0;i < components.length; i++){
			var comp = components[i];
			var box = this.boxDiv[comp.id];
			css.remove(box,"StormUITopologyBoxDisabled");
				
		}
		this._isDisabled = false;
		this.setStatus(this._lastStatus);
		
	},
	

	/***************************************************************************
	 * Config
	 ***************************************************************************/
		
		
		
	onConfig:function(id,e){
		this.stopEvent(e);
		
	
		
		if(this._selectedComponent){
			this.onConfigDone();
			return;
		}
			
		if(this.dashlets[id]){
			this.setDisabled(id);
			this.dashlets[id].showConfig(lang.hitch(this,"onConfigDone"));
			this._selectedComponent = id;
		}
			
		
	},
	
	onConfigDone:function(comLayout){
		this.logger.log(2,"onConfigDone","enter");
		
	
		
		if(comLayout){
			if(this.layout.components[this._selectedComponent]){
				/**
				 * Change dashlet lazout
				 */
				this.layout.components[this._selectedComponent].dashletLayout = comLayout;
				

				
				
				/**
				 * The minheight is set during the initial drawing. To allow
				 * shrinking set now to default height!
				 */
				var node = this.boxDiv[this._selectedComponent];
				node.style.minHeight = this.boxHeight + "px";
				
				/**
				 * chnage also height for boxes after a 0.51 sec
				 * delay to let the animation finish. Somehow ugly :-(
				 */
				var pos  = this.layout.components[this._selectedComponent];
				var me = this;
				var id = this._selectedComponent;
				setTimeout(function(){
					
					/**
					 * update layout after resize is done, so the preview looks
					 * cool!
					 */
					var p = domGeom.position(node);
					pos.h = p.h;
					me.onLayoutChanged();
					
					/**
					 * Also update the lines. 
					 */
					me._updateLinePositions(id, pos,true);
					
				},510);
				
				
			
			} else {
				this.logger.error("onConfigDone","No component to set lazout");
			}
			
			
		}
		
		if(this.dashlets[this._selectedComponent]){
			this.dashlets[this._selectedComponent].closeConfig();
		}
		
		// TODO: update layout position and with readl domGeom and rerender lines
	
		
		this.setEnabled();
		this._selectedComponent = null;
	},

	/***************************************************************************
	 * DragNDrop
	 ***************************************************************************/
	
	onBoxStart:function(){
		
	},
	
	onBoxClick:function(id, node){
	
	},
	
	onBoxMove:function(id, node, newPos){
		//console.debug("onBoxMove", newPos);
		
		var pos = this.layout.components[id];
		pos.x = newPos.x;
		pos.y = newPos.y;
		
		
		this._updateLinePositions(id, pos);
		
	},
	
	_updateLinePositions:function(id, pos, animate){
		

		var lines = this.boxLines[id];
		//console.debug(lines);
		
		if(lines){
			/**
			 * Render all lines form and to the graph
			 */
			
			for(source in lines.from ){
				var from = this.layout.components[source];

				var line = this.getAnchorPointLine(from, pos);
				
				var svg = lines.from[source];
				if(animate){
					svg.transition().attr("d", this.lineFunction(line));
				} else {
					svg.attr("d", this.lineFunction(line));
				}
		     
			}
			
			for(target in lines.to ){
				var to = this.layout.components[target];

				var line = this.getAnchorPointLine(pos, to);
				var svg = lines.to[target];
				if(animate){
					svg.transition().attr("d", this.lineFunction(line));
				} else {
					svg.attr("d", this.lineFunction(line));
				}
			}
		}
	},

	onBoxMoveEnd:function(id, node, newPos){
		
		var pos = this.layout.components[id];
		pos.x = newPos.x;
		pos.y = newPos.y;
		this.layout.components[id] = pos;
		
		this.onLayoutChanged();
	},
	
	


	
	/***************************************************************************
	 * Drawing Functons
	 ***************************************************************************/
	

	
	
	drawLine:function(from, to){
	
		
		return this.drawSVGLine(from, to,this.defaultLineColor, 20, 0.4);
	},
	
	drawSVGLine:function(from, to, color, width, op){
		
		var line = this.getAnchorPointLine(from, to);
		
		
		
		var lineGraph = this.svg.append("path")
							        .attr("d", this.lineFunction(line))
							        .attr("stroke", color)
							        .attr("stroke-width", this.defaultLineWidth)
							        .attr("fill", "none").
							        style("opacity", op);
		
		return lineGraph;
	},
	
	
	drawBox:function(id, pos){
		
		var box = document.createElement("div");
		css.add(box,"StormUITopologyBox");
		box.style.minWidth = pos.w+ "px";
		box.style.top = pos.y+ "px";
		box.style.left = pos.x +"px";
		box.style.minHeight = pos.h+ "px";
		


	
		
		if(!this.autoScale){
		
			// config 		
			var config = document.createElement("div");
			css.add(config,"StormUITopologyBoxConfig");
			var span = document.createElement("span");
			css.add(span, "glyphicon glyphicon-cog");
			config.appendChild(span);
			box.appendChild(config);
		
			var listener = on(span,"mousedown", lang.hitch(this,"onConfig", id));
			this.tempOwn(listener);
			
			
			// header
			var header = document.createElement("div");
			css.add(header,"StormUITopologyBoxHeader");
			header.innerHTML=id;
			box.appendChild(header);
			
		}
	
		
		if(!this.autoScale){
			var instance = document.createElement("span");
			css.add(instance,"StormUITopologyBoxHeaderInstance");
			instance.innerHTML=" (2)";
			header.appendChild(instance);
			this.boxInstance[id] = instance;
			
			
			// boxContent
			var content = document.createElement("div");
			css.add(content,"StormUITopologyBoxContent");
			box.appendChild(content);
			
	
			var dashlet = new Dashlet();
			dashlet.placeAt(content);
			if(pos.dashletLayout){
				dashlet.setLayout(pos.dashletLayout);
			}
			
			this.dashlets[id] = dashlet;
		}
	
		
		
		
		this.boxContainer.appendChild(box);
		
		
		this.boxDiv[id] = box;
	
		
		
		return box;
	},
	



	
	cleanup:function(){
		if(this.svg){
			this.svg.selectAll(".line").remove();
		}
		this._setStatus("layout"+this.topology.id, null);
		this.boxContainer.innerHTML="";
	},
	
	
	/***************************************************************************
	 * Color
	 ***************************************************************************/
	 getColor: function(value){
			
		 if(value == 0){
			 return this.defaultLineColor;
		 }
		 
		 return this.mixColor(value);
	 },
	
	 
	
	/***************************************************************************
	 * Layout Functons
	 ***************************************************************************/
	 
	 scale:function(){
		
		 css.add(this.domNode, "StreamUIModePreview");
		 
		 var height = 0;
		 var width = 0;
		 
		

	
		for(var id in this.layout.components){
			var pos  = this.layout.components[id];
			
			height = Math.max(height, (pos.y + pos.h));
			width = Math.max(width, (pos.x + pos.w));
		}
		
		 var pos = domGeom.position(this.domNode);
		
		var zoom = pos.h/ height;
		zoom = Math.min(zoom, pos.w/ width);

				
		for(var id in this.layout.components){
			var pos  = this.layout.components[id];
			
			pos.h = pos.h * zoom;
			pos.w = pos.w * zoom;
			pos.x = pos.x * zoom;
			pos.y = pos.y * zoom;
		}	
		
		this.defaultLineColor = "#000";
		//this.domNode.style.fontSize = "8px";
		 
		this.defaultLineWidth = Math.min(4, this.defaultLineWidth* zoom);
	 },
	
	getAnchorPointLine:function(from, to){
		
		var xs = from.x + from.w;
		var ys = from.y + from.h/2;
		
		var xe = to.x;
		var ye = to.y  + to.h/2;
		
		return this.createLineData(xs,ys,xe,ye);
		
	},
	
	getAutoLayout:function(t){
		
		var boxes = {};
		
		var components = t.components;
		this.uuid = 0;
		
		/**
		 * build graph
		 */
		var g = {};	
		for(var i=0;i < components.length; i++){
			var component = components[i];
			g[component.id] = component;
		}
		for(var i=0;i < components.length; i++){
			var component = components[i];
			component.level =0;
			this.buildLevels(component,g);	
		}
		
	
		
		/**
		 * now determine the level for each node
		 */
		
		var elementsPerLevel = [];
		for(var i=0;i < components.length; i++){
			var component = components[i];
			if(!elementsPerLevel[component.level]){
				elementsPerLevel[component.level] = 0;
			}
			var row = elementsPerLevel[component.level];
			boxes[component.id] = {
					x:component.level * (this.paddingH +  this.boxWidth) + this.paddingTop,
					y: row * (this.paddingV +  this.boxHeight) + this.paddingLeft, 
					w: this.boxWidth,
					h: this.boxHeight 
			};
			elementsPerLevel[component.level]++;
			
			  
			  
		}
		
		
		
	
		return {"components" : boxes};
		
	},
	
	/**
	 * get max level for each element
	 */
	buildLevels:function(component,g){
		this.getLevel(component, g, component, 1);
	},
	
	getLevel:function(c, g, comp, level){
		
		if(c.sources){
			comp.level = Math.max(level, comp.level);
			var sources = c.sources;
			for(var i=0; i < sources.length;i++){
				var source = sources[i];
				var parent = g[source];
				if(parent){
					this.getLevel(parent,g,comp, level+1);
				}else {
					console.error("No parent for comp " + component.id + " with id "+ source);
				}
			}
		}
	},
	
	
	createLineData: function(xs,ys,xe,ye){
		var line = [];
		
		var bendFactorX = 0.5;
	
		// start point
		line.push({x:xs,y:ys});
		
		var difX = Math.round(xe-xs);
		
		line.push({x: Math.round(xs + difX*bendFactorX) ,y:ys});
		
		line.push({x: Math.round(xs + difX*bendFactorX) ,y:ye});
		
		
		// end point
		line.push({x:xe,y:ye});
		return line;
	},

	
	
	
	
	/***************************************************************************
	 * Helper Functons
	 ***************************************************************************/
	
	simulate:function(){
		
	},
	
	getUUID:function(){
		return this.uuid++;
	},
	
	
	
	


	  
    destroy:function(){
		  this.inherited(arguments);
		  console.debug("Destroy");
	  }

    });

});
