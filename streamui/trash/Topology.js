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
		 "de/vommond/_Widget",
		 "de/vommond/_DragNDrop"
         ], 
      

function(declare, event,_WidgetBase,_TemplateMixin, css,  keys, Logger,  on, lang, Store, attr,cookie,json,_Vommond, _DragNDrop){

    return declare("de.vommond.streamui.Topology", [_WidgetBase, _TemplateMixin,_Vommond,_DragNDrop], {
    	
	
   	templateString:'<div class="StormUITopology">' +
   						'<div class="StormUITopologyConfig">' +
   							'<a data-dojo-attach-point="simButton" class="StormUIButton">Simulate</a>'+
   							'<a data-dojo-attach-point="cleanButton" class="StormUIButton">Clean Up</a>'+
   							'<a data-dojo-attach-point="minusButton" class="StormUIButton">[-]</a>'+
   							'<a data-dojo-attach-point="plusButton" class="StormUIButton">+]</a>'+
   						'</div>'+
   						'<div class="StormUITopologyCanvas">' +
   							'<div data-dojo-attach-point="svgContainer" class="StormUITopologySVG"></div>'+
   							'<div data-dojo-attach-point="boxContainer" class="StormUITopologyBoxes"></div>'+
    					'</div>'+
    				'</div>',
    
    				   
    lineFunction : d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("basis"),
    
    height: 500,
    	
    paddingH : 100,
    
    paddingV : 75,
    
    boxHeight : 100,
    
    boxWidth : 200,
    

    
	constructor: function(){
		this.logger = new Logger({"className":"de.vommond.GraphMap"});
		this.logger.log(2,"constructor", "entry");	
	
	},
	
	setTopology:function(topology){
		
		

		//var topology = this.getToplogy(id);
		this.topology = topology;
		
		var positions = this._getStatus("boxPositions"+topology.id);
		console.debug(positions);
		if(!positions){
			positions = this.getAutoLayout(topology);
		}

	
		this.render(topology, positions);
	},
	
	startup: function(){
		this.logger.log(2,"startup", "entry");
		
		this.own(on(this.simButton,"click", lang.hitch(this,"simulate")));
		this.own(on(this.cleanButton,"click", lang.hitch(this,"cleanup")));
	
	
		/**
		 * first layout the topology
		 */


	
		// create svg
		var bodySelection = d3.select(this.svgContainer);		 
		this.svg = bodySelection.append("svg")
		                        .attr("width", 1200)
		                        .attr("height",800 );
		
		
		
		 
	},
	
	
	
	render:function(t, positions){
		
		// get overall size
		
		this.cleanUpTempListener();
		
		this.boxDiv = {};

		this.boxLines = {};
		
	
		
		var spouds = t.spouds;
		var bolts = t.bolts;
		

		for(var i=0;i < spouds.length; i++){
			var spoud = spouds[i];
			var pos  = positions[spoud.id];
			var box =this.drawBox(spoud.id, pos);
			css.add(box, "StormUITopologySpoud");
			box.innerHTML =spoud.id;
			//this.tempOwn(on(box,"mousedown", lang.hitch(this,"onDragStart")));
			this.registerDragOnDrop(box, "onBoxStart" , "onBoxMove", "onBoxMoveEnd", spoud.id);
		}
		
		
		for(var i=0;i < bolts.length; i++){
			var bolt = bolts[i];
			var pos  = positions[bolt.id];
			var box =this.drawBox(bolt.id, pos);
			css.add(box, "StormUITopologyBolt");
			box.innerHTML =bolt.id;
			//this.tempOwn(on(box,"mousedown", lang.hitch(this,"onDragStart")));
			this.registerDragOnDrop(box, "onBoxStart", "onBoxMove", "onBoxMoveEnd", bolt.id);
			var sources = bolt.sources;
			for(var j=0; j < sources.length; j++){
					var source = sources[j];
					var to = positions[bolt.id];
					var from = positions[source];
					
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
		
		this.boxPositions  = positions;
		
	},
	

	/***************************************************************************
	 * DragNDrop
	 ***************************************************************************/
	
	onBoxStart:function(){
		
	},
	
	onBoxMove:function(id, node, newPos){
		//console.debug("onBoxMove", newPos);
		
		var pos = this.boxPositions[id];
		pos.x = newPos.x;
		pos.y = newPos.y;
		
		
		var lines = this.boxLines[id];
		//console.debug(lines);
		
		/**
		 * Render all lines form and to the graph
		 */
		
		for(source in lines.from ){
			var from = this.boxPositions[source];

			var line = this.getAnchorPointLine(from, pos);
			
			var svg = lines.from[source];
	        svg.attr("d", this.lineFunction(line));
		}
		
		for(target in lines.to ){
			var to = this.boxPositions[target];

			var line = this.getAnchorPointLine(pos, to);
			var svg = lines.to[target];
	        svg.attr("d", this.lineFunction(line));
		}
	},

	onBoxMoveEnd:function(id, node, newPos){
		
		var pos = this.boxPositions[id];
		pos.x = newPos.x;
		pos.y = newPos.y;
		this.boxPositions[id] = pos;
		
		this._setStatus("boxPositions"+this.topology.id, this.boxPositions);
		
		
	},

	
	/***************************************************************************
	 * Drawing Functons
	 ***************************************************************************/
	

	
	
	drawLine:function(from, to){
	
		
		return this.drawSVGLine(from, to,"red", 20, 0.4);
	},
	
	drawSVGLine:function(from, to, color, width, op){
		
		var line = this.getAnchorPointLine(from, to);
		
		var lineGraph = this.svg.append("path")
							        .attr("d", this.lineFunction(line))
							        .attr("stroke", color)
							        .attr("stroke-width", width)
							        .attr("fill", "none").
							        style("opacity", op);
		
		return lineGraph;
	},
	
	
	drawBox:function(id, pos){
		
		var box = document.createElement("div");
		css.add(box,"StormUITopologyBox");
		box.style.width = pos.w+ "px";
		box.style.height = pos.h+ "px";
		box.style.top = pos.y+ "px";
		box.style.left = pos.x +"px";
		this.boxContainer.appendChild(box);
		
		
		this.boxDiv[id] = box;
	
		
		
		return box;
	},
	



	
	cleanup:function(){
		if(this.svg){
			this.svg.selectAll(".line").remove();
		}
		this._setStatus("boxPositions"+this.topology.id, null);
		this.boxContainer.innerHTML="";
	},
	
	
	
	
	/***************************************************************************
	 * Layout Functons
	 ***************************************************************************/
	
	getAnchorPointLine:function(from, to){
		
		var xs = from.x + from.w;
		var ys = from.y + from.h/2;
		
		var xe = to.x;
		var ye = to.y  + to.h/2;
		
		return this.createLineData(xs,ys,xe,ye);
		
	},
	
	getAutoLayout:function(t){
		
		var boxes = {};
		
		var spouds = t.spouds;
		var bolts = t.bolts;
		
		this.uuid = 0;
		/**
		 * build graph
		 */
		var g = {};		
		for(var i=0;i < spouds.length; i++){
			var spoud = spouds[i];
			g[spoud.id] = {children:[], id: spoud.id, level:0, uuid : this.getUUID()};
	
		}
		this.buildGraph(g,bolts,1);
		
	
		
		/**
		 * now determine the level for each node
		 */
		for(var i=0;i < spouds.length; i++){
			var spoud = spouds[i];
			var node = g[spoud.id];
			this.buildLevels(node, 1);
		}
		

		
		for(var i=0;i < spouds.length; i++){
			var spoud = spouds[i];
			var node = g[spoud.id];
			boxes[spoud.id] = {
					x:node.level,
					y:i * (this.paddingV +  this.boxHeight), 
					w: this.boxWidth,
					h: this.boxHeight 
			};
		}
		
		
		var elementsPerLevel = [];
		for(var i=0;i < bolts.length; i++){
			var bolt = bolts[i];
			var node = g[bolt.id];
			if(!elementsPerLevel[node.level]){
				elementsPerLevel[node.level] = 0;
			}
			var row = elementsPerLevel[node.level];
			boxes[bolt.id] = {
					x:node.level * (this.paddingH +  this.boxWidth),
					y: row * (this.paddingV +  this.boxHeight), 
					w: this.boxWidth,
					h: this.boxHeight 
			};
			elementsPerLevel[node.level]++;
		}
		
		return boxes;
		
	},
	
	
	createLineData: function(xs,ys,xe,ye){
		var line = [];
		
		var bendFactorX = 0.5;
		var bendFactorY = 0.25;
	
		// start point
		line.push({x:xs,y:ys});
		
		var difX = Math.round(xe-xs);
		var difY = Math.round(ye-ys);
		
		line.push({x: Math.round(xs + difX*bendFactorX) ,y:ys});
		
		line.push({x: Math.round(xs + difX*bendFactorX) ,y:ye});
		
		//line.push({x: Math.round(xs + bendFactorX*difX) ,y:ys});
		
		//line.push({x: Math.round(xs + 0.5*difX) ,y: Math.round(ys + bendFactorY*difY)});
		
		//line.push({x: Math.round(xs + 0.5*difX) ,y: Math.round(ye - bendFactorY*difY)});
		
		//line.push({x: Math.round(xe - bendFactorX*difX) ,y: ye});
		
		// end point
		line.push({x:xe,y:ye});
		return line;
	},

	
	/**
	 * get max level for each element
	 */
	buildLevels:function(node,level){
		var children = node.children;
		for(var i=0;i < children.length; i++){
			var child = children[i];
			child.level = Math.max(level, child.level);
			this.buildLevels(child, level+1);
		}
	},
	
	
	/**
	 * Build graph
	 */
	buildGraph:function(g, bolts, level){
		var temp = [];
		for(var i=0;i < bolts.length; i++){
			
			var bolt = bolts[i];
			var sources = bolt.sources;
			if(sources.length > 0){
				/**
				 * check for each incoming link if there is a 
				 * parent node
				 */
				for(var j=0; j < sources.length; j++){
					var source = sources[j];
					//console.debug("    << ", source, g[source]);
					
					
					/**
					 * if there is a node,
					 * create a child node
					 */
					if(g[source]){
						var parent = g[source];
						var node = null;
						if(g[bolt.id]){
							node = g[bolt.id];
						} else {
							var node =  {children:[], id: bolt.id, level:0, uuid: this.getUUID()};
							g[bolt.id] = node;
						}
						parent.children.push(node);
					} else {
						temp.push(bolt);
					}
				}
			} else {
				console.error("Bolt ", bolt, "has not sources");
			}
			
			
		}
		
		
		if(level < 4 && temp.length > 0){
			level++;
			this.buildGraph(g,temp, level );
		}
			
	},
	
	
	
	/***************************************************************************
	 * Helper Functons
	 ***************************************************************************/
	
	simulate:function(){
		
	},
	
	getUUID:function(){
		return this.uuid++;
	},
	
	
	
	getToplogy:function(){
		var t = {
			 id:"DMS_Workflow",
			 spouds : [
			    {
			    	id : "DMSInput",
			    	type: "com.ligatus.KafkaSpoud",
			    	instances : [{
			    			id:"DMSInput1",
			    			machine : "Server1"
			    		}
			    	     
			    	]
			    },
			    {
			    	id : "DMSInput2",
			    	type: "com.ligatus.WekaModel",
			    	instances : [{
			    			id:"DMSInput22",
			   			   	machine : "Server1"
			    	     },{
			    	    	id:"DMSInput22",
				   			machine : "Server2" 
			    	     }
			    	]
			    }
			 
			 ],
			 bolts:[
			        {
				    	id : "UserProfileStore",
				    	type: "com.ligatus.DMSOUtputBolt",
				    	sources : ["DMSOUtputBolt"],
				    	instances : [{
				    			id:"UserProfileStore1",
				   			   	machine : "Server4"
				    	     }
				    	]
				    },
			        {
				    	id : "RecommenderBolt",
				    	type: "com.ligatus.RecommderBolt",
				    	sources : ["DMSInput", "DMSInput2"],
				    	instances : [{
				    			id:"RecommenderBolt1",
				    			machine : "Server3"
				    		},{
				    			id:"RecommenderBolt2",
				    			machine : "Server3"
				    		},
				    		{
				    			id:"RecommenderBolt3",
				    			machine : "Server3"
				    		}
				    	]
				    },
				    {
				    	id : "DMSOUtputBolt",
				    	type: "com.ligatus.DMSOUtputBolt",
				    	sources : ["RecommenderBolt", "DMSInput2"],
				    	instances : [{
				    			id:"DMSOUtputBolt1",
				   			   	machine : "Server4"
				    	     }
				    	]
				    }
				   
					 
			]
				
		};
		
		return t;
	},
	


	  
    destroy:function(){
		  this.inherited(arguments);
		  console.debug("Destroy")
	  }

    });

});
