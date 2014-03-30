define([ "dojo/_base/declare",
		 "dojo/on",
         "dojo/_base/lang",
         "dojo/_base/event",
         "dojo/dom-style",
         "dojo/dom-class",
         "dojo/_base/window",
], function(declare, on, lang, event, style, css, win) {

	return declare("de.vommond._DragNDrop", [], {
		
	

	registerDragOnDrop:function(node, id, startCallback, moveCallback, endCallback, clickCallback){
		//	console.debug(event);
		var listener = on(node,"mousedown", lang.hitch(this,"onDragStart", node, id, startCallback, moveCallback, endCallback,clickCallback));
		
		this.initRequestAnimationFrame();
	
		
		if(!this._dragNDropListeners){
			this._dragNDropListeners = [];
		}
		this._dragNDropListeners.push(listener);
	},
			
	
	onDragStart:function(node, id, startCallback, moveCallback, endCallback, clickCallback, e){
		//console.debug("onDragStart", node, moveCallback, endCallback);
		this.stopEvent(e);
		
		this.onDragCleanup();
		this._dragNDropNode = node;
		css.add(node,"VommondDnDStart");
		
		this._dragnDropStartCallback = startCallback;
		this._dragnDropMoveCallback = moveCallback;
		this._dragnDropEndCallback = endCallback;
		this._dragnDropClickCallback = clickCallback;
		this._dragnDropID = id;
		
		this._dragNDropNodePos = this.getStylePos(node);
		this._dragnDropMousePos = this._getMousePosition(e);
	
		
		this._dragNDropMove = on(win.body(),"mousemove", lang.hitch(this,"onDragMove"));
		this._dragNDropUp = on(win.body(),"mouseup", lang.hitch(this,"onDragEnd"));
		
		if(this[this._dragnDropStartCallback]){
			this[this._dragnDropStartCallback](this._dragnDropID, this._dragNDropNode, this._dragNDropNodePos);
		}
	},
	
	onDragMove:function( e ){
		//console.debug("onDragMove",this._dragnDropMoveCallback );
		this.stopEvent(e);
		
		/**
		 * Sometimes there might be still a listener. 
		 * We stop that now.
		 */
		if(!this._dragNDropNode){
			this.onDragCleanup();
			return;
		}
		this._dragNDropStarted = true;
		
		css.add(this._dragNDropNode,"VommondDnDMove");
		
		var pos = this._getMousePosition(e);
		
		var difX = pos.x - this._dragnDropMousePos.x;
		var difY = pos.y - this._dragnDropMousePos.y;
		
		var newPos = {
				x: this._dragNDropNodePos.x + difX,
				y: this._dragNDropNodePos.y + difY,
		};
		
		if(!window.requestAnimationFrame){
			console.warn("No requestAnimationFrame()");
	    	this._dragNDropUpDateUI(newPos);
	    } else {
	    	var callback = lang.hitch(this, "_dragNDropUpDateUI", newPos);
        	requestAnimationFrame(callback);
	    }
		
		return false;
	},
	
	_dragNDropUpDateUI:function(newPos){
		
		if(!this._dragNDropNode){
			this.onDragCleanup();
			return;
		}
		

		this._dragNDropNode.style.left = newPos.x +"px";
		this._dragNDropNode.style.top = newPos.y +"px";
		
		if(this[this._dragnDropMoveCallback]){
			this[this._dragnDropMoveCallback](this._dragnDropID, this._dragNDropNode, newPos);
		}
		
	},
	
	
	onDragEnd:function(e){
		//console.debug("onDragEnd", this._dragnDropEndCallback );
		this.stopEvent(e);
		
		
		var pos = this._getMousePosition(e);
		
		var difX = pos.x - this._dragnDropMousePos.x;
		var difY = pos.y - this._dragnDropMousePos.y;
		
		var newPos = {
				x: this._dragNDropNodePos.x + difX,
				y: this._dragNDropNodePos.y + difY,
		};
		
		if(this._dragNDropStarted){
			if(this[this._dragnDropEndCallback]){
				this[this._dragnDropEndCallback](this._dragnDropID, this._dragNDropNode, newPos);
			}
		} else {
			if(this[this._dragnDropClickCallback]){
				this[this._dragnDropClickCallback](this._dragnDropID, this._dragNDropNode, newPos);
			}
		}
		
		
		
		this.onDragCleanup();
	},
	
	onDragCleanup:function(){
		if(this._dragNDropNode){
			css.remove(this._dragNDropNode,"VommondDnDStart");
			css.remove(this._dragNDropNode,"VommondDnDMove");
		}
		
		this._dragnDropMoveCallback = null;
		this._dragnDropEndCallback = null;
		this._dragnDropClickCallback=null;
		this._dragNDropNode = null;
		if(this._dragNDropMove)
			this._dragNDropMove.remove();
		if(this._dragNDropUp)
			this._dragNDropUp.remove();
		this._dragNDropStarted = false;
	},
	
	getStylePos:function(node){
		var s = style.get(node);
		var x = s.left.replace("px","") *1 ;
		var y = s.top.replace("px","") *1;
		return {x : x , y : y};
	},

	
	cleanUpDragNDropListenerListener:function(){
		
		if(this._dragNDropListeners){
			
			for(var i=0; i < this._dragNDropListeners; i++){
				this._dragNDropListeners[i].remove();
			}
			
			this._dragNDropListeners = null;
		}
		
	},
	
	 _getMousePosition: function(e){	        
	        var result = {};
	        result.x = e.pageX;// this._getMouseX(e);
	        result.y = e.pageY;// this._getMouseY(e);
	        return result;
	 },

	 initRequestAnimationFrame:function(){
		 
	 },
	
	
	stopEvent:function(e){
		if(e){
			event.stop(e);
			
			  
			 e.preventDefault();
			 e.stopPropagation();
		}
	},
	
	
	});
});
