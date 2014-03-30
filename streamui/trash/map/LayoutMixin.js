
/**
 * Map that holds code to draw arrows!
 */
define(["dojo/_base/declare",
	"dojo/_base/lang",
	"pt/fraunhofer/Logger",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/Color"
    ],
    
    function(declare,lang,Logger,domClass,domGeom, Color) {
		return declare("pt.fraunhofer.map.LayoutMixin",[],{
		
			
		_sortWidgetsByPage:function(widgets){
			     	
	    	/*
	    	 * build up data structure
	    	 */
	      	var pageScreenshotTree = {};
	      	var pagedWidgetTree={};
	    	for(var i=0; i < widgets.length; i++){        
	    		var node = widgets[i];   
		      	var widget = this._findWidgetByID(node.widgetID);              
		      	node.pageID=0;
	
			      	
		       	if(widget) {
		       		// we handle only the first position!
			      	if(widget.positions[0]){
			      		var pos = widget.positions[0];
			      		node.pageID = pos.screenshot.pageID;
			      		node.screenshotID = pos.screenshot.screenshotID;
			      		
			      		if(!pageScreenshotTree[node.pageID]){
			      			pageScreenshotTree[node.pageID]={};
			      		}
			      		pageScreenshotTree[node.pageID][node.screenshotID] = true;
			      		
			      		if(!pagedWidgetTree[node.pageID]){
			      			pagedWidgetTree[node.pageID]=[];
			      		}
			      		pagedWidgetTree[node.pageID].push(node);
			      	}
		       	}	      
		       
		    }
	    	
	    	/*
	    	 * Count screenshots needed per page
	    	 * and sort them by page count
	    	 */
	    	var screenshotsPerPage = [];
	    	total=0;
	    	for(var pageID in pageScreenshotTree){
	    		var screens = pageScreenshotTree[pageID];
	    		var i=0;
	    		for(var screenshotID in screens){
	    			i++;
	    		}
	    		screenshotsPerPage.push({key:pageID, value: i});
	    		total+=i;
	    	}    	
	    	screenshotsPerPage.sort(function(a, b) {   
	    		return b.value - a.value;
	    	});
	    	
	    	
	    	/*
	    	 * optimize layout by simply using a greedy 
	    	 * algorithm
	    	 */    	
	    	var max = this._calculateNumberOfScreenshotsPerRow(total);
	    	var lines = [];
	        for(var i=0; i < screenshotsPerPage.length;i++){
	        	var screen = screenshotsPerPage[i];
	            var line = this._getFreeLine(lines, screen.value, max);
	            line.count += screen.value;
	            line.screens.push(screen);
	        }
	           
	        /*
	         * BUILD FINAL RESULT
	         */
	        result =[];
	        for(var i=0; i < lines.length;i++){
	            var line = lines[i];
	        	for(var j=0; j < line.screens.length;j++){
	        		var pageID = line.screens[j].key;
	        		var widgetsForPage = pagedWidgetTree[pageID];
	           		if(widgetsForPage){
	        			for(var k=0; k < widgetsForPage.length; k++){        	
	        				result.push(widgetsForPage[k]);
	        			}
	        		}        		
	        	}
	        }
	    	
	
	    	return result;
		},
		
		// calculate the number of screenshots to show on each row
		_calculateNumberOfScreenshotsPerRow: function(numberOfTotalScreenshots) {
			return Math.max(Math.ceil(Math.sqrt(numberOfTotalScreenshots)), 3) ;
		},
		
			    
		_getFreeLine:function(lines, space, max){
			        for(var i=0; i < lines.length;i++){
			            if(lines[i].count + space <=max ){
			        
			                return lines[i];
			            }
			        }
			        var line = {
			                count : 0,
			                screens : [],
			                line:-1
			            };
			        lines.push(line);
			        return line;
		},
		
		
		
	    _isSupported:function(widget){
	    	
	    	if(widget.widgetType=="FusamiActPageView" || widget.widgetType == "Activity"){
	    		return false;
	    	}
	    	if(this.showTouch){
	    		return true;
	    	} else {
	        	return "FusamiActGestureOverlay" != widget.widgetType;
	    	}
	
	    },
	    
	    _isBackBtn:function(widget){
	    	if(widget.widgetType=="FusamiActBackButton"){
	    		return true;
	    	}
	    	return false;
	    },
	    
	    
	    _chooseBlendColor: function(support){
			
            
	        for (var i = 0; i < this.heatMapColorSupports.length; i++) {
	            if (support <= this.heatMapColorSupports[i]) {
	                var prevValue = (i > 0 ? this.heatMapColorSupports[i - 1] : 0);
	                var sup = (support * 1.0 - prevValue * 1.0);
	                sup = sup / ((this.heatMapColorSupports[i] - prevValue * 1.0));
	                var color = Color.blendColors(new Color(this.heatMapColor[i]), new Color(this.heatMapColor[i + 1]), sup);
	  
	                return color;
	            }
	        }        
	        
	        
	        return new Color(this.heatMapColor[0]); 
	    }
				


	});
}
);    

