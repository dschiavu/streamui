
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
		return declare("de.vommond._MapArrowMixin",[],{
		

		arrowColor : "#19C6FF",
		
	

	    
	 
	   
	    
	    
	    _drawStaightArrow:function(start, end, color, width, style, arrowDimensions) {
	      	this.logger.log(5, "_drawStaightArrow", "entry");
	      	
	        /////////////////////////////////////////////////////
	        //Create a group that can be manipulated as a whole
	        /////////////////////////////////////////////////////
	        var group = this.surface.createGroup();     
	
	        var x1 = start.x,
	            y1=start.y,
	            x2 = end.x,
	            y2= end.y;
	
	        var len = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
	
	     
	
	        var defaultStroke = {
	            color : color,
	            style : style,
	            width : width
	        };
	        
	
	        ///////////////////////////
	        //Add a line to the group
	        ///////////////////////////
	        group.createLine({
	            x1 : 0,
	            y1 : 0,
	            x2 : 0+len,
	            y2 : 0
	        }).setStroke(defaultStroke);

	
	        var _arrowHeight = arrowDimensions.height || 5; //5
	        var _arrowWidth = arrowDimensions.width || 4; //3
	        defaultStroke = {
	            color: color,
	            style: "solid",
	            width: arrowDimensions.strokeWidth || 5
	        };
	
	        /////////////////////////////////////////////////////
	        //Add a custom path that is a triangle to the group
	        /////////////////////////////////////////////////////
	
	        group.createPath()
	        .moveTo(len-_arrowHeight,0)
	        .lineTo(len-_arrowHeight,-_arrowWidth)
	        .lineTo(len,0)
	        .lineTo(len-_arrowHeight,_arrowWidth)
	        .lineTo(len-_arrowHeight,0)
	        .setStroke(defaultStroke)
	        .setFill(color )
	        ;
	
	        var _rot = Math.asin((y2-y1)/len)*180/Math.PI;
	        if (x2 <= x1) {_rot = 180-_rot;}
	
	        /////////////////////////////////////////////////////////////
	        //Translate and rotate the entire group as a whole
	        /////////////////////////////////////////////////////////////
	        try{
		        group.setTransform([
		            dojox.gfx.matrix.translate(x1,y1),
		            dojox.gfx.matrix.rotategAt(_rot,0,0)
		        ]);
	        }catch(e){
	        	this.logger.error( "_drawStaightArrow", "error");
	           	console.error(line);
	        }
	        
	        return group;
	    }

	});
}
);    

