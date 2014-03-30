
/**
 * Map that holds code to draw arrows!
 */
define(["dojo/_base/declare",
	"dojo/_base/lang",
	"de/vommond/Logger",
	"dojo/dom-class",
	"dojo/dom-geometry"
    ],
    
    function(declare,lang,Logger,domClass,domGeom) {
		return declare("de.vommond._MapLayoutMixin",[],{
		

		arrowColor : "#19C6FF",

		bezierFactorX : 0.2,
	    
		bezierFactorY : 0.2,
	    
		offsetX : 0,
	    
		offsetY : 0,
		
		
		// KEEP IN SYNC WITH CSS!
		//	extraPaddingX : 1000,
		//	
		//	extraPaddingY : 500,
		
		/**************************** 
		 * Constants of orientation
		 * 
		 *  0      1        2
		 *      --------
		 *  3   | Node |    4
		 *		--------
		 *  5      6        7
		 *  
		 **************************/
		TOP_LEFT : "topLeft",
		
		TOP :"top",
		
		TOP_RIGHT: "topRight",
	
		LEFT : "left",
		
		RIGHT : "right",
		
		BOTTOM_LEFT : "bottomLeft",
		
		BOTTOM : "bottom",
		
		BOTTOM_RIGHT : "bottomRight",
		
		VERTICAL_THRESHOLD : 10,
		
	
		
		
		
		


		
		    
		
		
		
		
		_clearArrows : function(){
	        this.logger.log(4, "_clearArrows", "enter"); 
	    	// remove other arrows
	        // TODO check if this is fast enough....
	        if (this.arrows && this.surface) {

	            for (var i in this.arrows) {
	            	if(this.arrows[i]){
		                this.surface.remove(this.arrows[i]);
	            	}
	            }
	            this.surface.destroy();
	            this.surface = null;
	        }
	        this.arrows = [];
	        this._startEndLookUpMap=[];
	        
	        this.logger.log(5, "_clearArrows", "exit"); 
	    },




		
		/**
		 * returns an array of list lines {start:{}, end:{}, bendFator, intensity, invert}
		 */
		_getNicePositions2:function(lines, scaleFactor){
	        this.logger.log(3, "_getNicePositions2", "entry : " );
	        
	        
	        for(var i=0; i < lines.length; i++){
	        	var line = lines[i];        
	        	
	        	// do some backup of the original points?
	        	
	        	// check if the line is pointing to itself.
	        	// in this case we draw a circle
	        	if(line.start.x == line.end.x && line.end.y == line.start.y){
	        		var x = line.start.x+ (line.start.w /2);
	        		line.end.x = x+20;
	        		line.start.x = x-20;
	        		line.bendFactor = 4;
	        		line.isInverted = true;        		
	        	} else {
	        		
	        		var direction = this._getDirection(line.start, line.end);
	        		line.direction = direction;
	        		
	        		
	        		//console.debug(line.start.x + "," + line.start.y + "  ->  " + line.end.x + "," + line.end.y + " = " + direction);
	        		
	        		if(direction == this.TOP || direction == this.BOTTOM){        	
	        			this._setAnchorPoints(line, "left", "left");        			
		        		 line.isInverted = direction == this.BOTTOM;
	        		} else if(direction == this.RIGHT){
	        			
	        			if(Math.abs(line.start.y - line.end.y) < 20) {
	        				this._setAnchorPoints(line, "top", "top");     
	        			} else {
	        	   			this._setAnchorPoints(line, "right", "left");
	        			}     
	        			
	        		} else if(direction == this.TOP_RIGHT){
	        			this._setAnchorPoints(line, "right", "left"); 
	        			
	        		} else if(direction == this.BOTTOM_RIGHT){
	        			this._setAnchorPoints(line, "right", "left"); 
	        			
	        		} else if(direction == this.LEFT){
	        			
	        			if(Math.abs(line.start.y - line.end.y) < 20) {
	        				this._setAnchorPoints(line, "top", "top");     
						} else {
				   			this._setAnchorPoints(line, "left", "right");            
						}
	         			line.isInverted = true;
	        			
	        		} else if(direction == this.TOP_LEFT){
	        			this._setAnchorPoints(line, "left", "right");    
	        			line.isInverted = true;
	        			
	        		} else if(direction == this.BOTTOM_LEFT){
	        			
	        			// TODO we could check if there distance between start and end is big
	        			// and then use top. Maybe only for the first widget???
	        			this._setAnchorPoints(line, "left", "right");    
	        			line.isInverted = true;
	        			
	        		} else {        		
		        		var invertDirection = this._isCloseToTopBorder(line.start, line.end);
		        		var newLine= this._getNicePosition(line.start, line.end, scaleFactor, !invertDirection);    
		        		line.start.x = newLine.start.x;
		        		line.start.y = newLine.start.y;
		        		line.end.x = newLine.end.x;
		        		line.end.y = newLine.end.y;
	        		}
	        	} 
	        	
	        	
	        }
	        
	        
	        // TODO :fix bend factors, by lebn
	        
	        // TODO distribute anchor points...
	   
	        this.logger.log(4, "_getNicePositions2", "exit" );
	        return lines;
			
		},
		
		_setAnchorPoints:function(line, anchor1, anchor2){
			 var start = this._getAnchorPoint(line.start, anchor1);
	 		 line.start.x = start.x;
			 line.start.y = start.y;
			
			 var end = this._getAnchorPoint(line.end, anchor2);
	   		 line.end.x = end.x;
			 line.end.y = end.y;
		},
		
		/**
		 * returns the orientation of p2 to p1.
		 * 
		 * Assemption : No overlapping
		 */
		_getDirection:function(p1, p2){		
			if(this._isTop(p1, p2)){
				if(this._isLeft(p1, p2)){
					return this.TOP_LEFT;
				} 
				if(this._isRight(p1,p2)){
					return this.TOP_RIGHT;
				}
				return this.TOP;
			} else if(this._isBottom(p1, p2)){
	
				if(this._isLeft(p1, p2)){
					return this.BOTTOM_LEFT;
				} 
				if(this._isRight(p1,p2)){
					return this.BOTTOM_RIGHT;
				}
				return this.BOTTOM;
			} else {
				if(this._isRight(p1,p2)){
					return this.RIGHT;
				} else {
					return this.LEFT;
				}
			}		
		},
		
		_isLeft:function(p1, p2){
			return p1.x > (p2.x +p2.w);
		},
		
		_isRight:function(p1,p2){
			return (p1.x + p1.w) < p2.x;
		},
		
		_isTop:function(p1,p2){
			return p1.y > (p2.y+ (p2.h -this.VERTICAL_THRESHOLD));
		},
		
		_isBottom:function(p1,p2){
			return (p1.y + (p1.h-this.VERTICAL_THRESHOLD)) < p2.y;
		}, 
		
	    // Klaus Code
	    /**
	     * returns the upper or lower middle. Depends what is better
	     */
	    _getNicePosition: function(start, end, scaleFactor, isCloseToTopBorder){
	        this.logger.log(3, "_getNicePosition", "entry > isCloseToTopBorder : " + isCloseToTopBorder);
	        var result = {};
	        
	        if (Math.abs(start.y - end.y) < 60 * scaleFactor && isCloseToTopBorder) {
	            result.start = this._getAnchorPoint(start, "bottom");
	            result.end = this._getAnchorPoint(end, "bottom");
	        }
	        else {
	            if (Math.abs(start.y - end.y) < 60 * scaleFactor && !isCloseToTopBorder) {
	                result.start = this._getAnchorPoint(start, "top");
	                result.end = this._getAnchorPoint(end, "top");
	            }
	            else {
	                // try out all permutations
	                var anchors = ["top", "left", "right", "bottom"];
	                var minLength = 100000000;
	                for (var i = 0; i < anchors.length; i++) {
	                    var startAnchor = this._getAnchorPoint(start, anchors[i]);
	                    //console.debug("start :" + anchors[i]);
	                    for (var j = 0; j < anchors.length; j++) {
	                        var endAnchor = this._getAnchorPoint(end, anchors[j]);
	                        var length = this._length(startAnchor, endAnchor);
	                        //console.debug("   end :" + anchors[j] +" : " + length);
	                        if (length < minLength) {
	                            minLength = length;
	                            result.start = startAnchor;
	                            result.end = endAnchor;
	                        }
	                    }
	                }
	                //console.debug("minLength : " + minLength);
	            }
	        }
	
	        // add offet
	        result.start.x += this.offsetX;
	        result.start.y += this.offsetY;
	        result.end.x += this.offsetX;
	        result.end.y += this.offsetY;
	        
	        result.start.x = Math.round(result.start.x);
	        result.start.y = Math.round(result.start.y);
	        result.end.x = Math.round(result.end.x);
	        result.end.y =Math.round(result.end.y);
	        
	        //this.logger.log(6, "_getNicePosition", "exit");
	        return result;
	    },
	    
	    /**
	     * Returns an specified anchor point.
	     *
	     * point = point{x,y,h,w};
	     * dir = { top, left, right, bottom }
	     */
	    _getAnchorPoint: function(point, dir){
	        var anchor = {};
	        
	        if (dir == "top") {
	            anchor.x = point.x + Math.round(point.w / 2);
	            anchor.y = point.y;
	        }
	        else 
	            if (dir == "right") {
	                anchor.x = point.x + point.w;
	                anchor.y = point.y + Math.round(point.h / 2);
	            }
	            else 
	                if (dir == "left") {
	                    anchor.x = point.x;
	                    anchor.y = point.y + Math.round(point.h / 2);
	                    
	                }
	                else {
	                    anchor.x = point.x + Math.round(point.w / 2);
	                    anchor.y = point.y + point.h;
	                }
	        
	        return anchor;
	    },
	    
	    /**
	     * returns the distance^2 between two points;
	     */
	    _length: function(start, end){
	        return Math.pow(end.x - start.x, 2) + Math.pow(start.y - end.y, 2);
	    },
	    

		});
	}
	);    
