
   /**
     * (C) Musikunterricht.de - Klaus Schaefers 2009
     * 
     * Stolen form myself
     */ 

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
         "dojo/json"
         ], 
      

function(declare, event,_WidgetBase,_TemplateMixin, css,  keys, Logger,  on, lang, Store, attr,cookie,json){

    return declare("de.vommond.Graph", [_WidgetBase, _TemplateMixin], {
    	
	
   	templateString:'<div class="vommondGraph">' +
    					'<span class="loader">Loading...</span>'+
    				'</div>',
    
    				   
    messageBundle:"",			
    
    messagePrefix: "",
    
    itemsPerPage : 300,
    
    itemPointer : 0,
    
    isSortable : true,
    
    _order : true,
    
    _totalCount : 0,
    
    
    _persState: Array(),
    
    
    columns:"",
    
    actions:"",
    
    key:"",
    
    customCSS:false,
    
    actionCSS:"",
    
    search : "",
    
    minSearchLength:3,
    
    url : "",
    
    actionStyles : "",
    
    
	constructor: function(){
		this.logger = new Logger({"className":"de.vommond.GraphMap"});
		this.logger.log(2,"constructor", "entry");	
	
	},
	
	startup: function(){
		this.logger.log(2,"startup", "entry");
	
		


		
		
	},
	

	
	
	  
	  destroy:function(){
		  this.inherited(arguments);
		  console.debug("Destroy")
	  }

    });

});
