// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase", 
         "dojo/dom-style", 
         "dojo/_base/lang", 
         "dojo/dom-class", 
         "dojo/dom-attr", 
         "dijit/registry", 
         "dojo/query", 
         "dijit/_TemplatedMixin",  
         "dojo/request/xhr",
         "dojo/request", 
		 "dojo/window", 
		 "dojo/_base/window", 
		 "dojo/dom-class", 
		 "dojo/dom", 
		 "dojo/touch", 
		 "dojo/_base/event", 
		 "de/vommond/Logger"

], function(declare, WidgetBase, domStyle, lang, css, domAttr, registry, query, TemplateMixin, xhr, request, 
			window, baseWindow, css, dom, touch, event, Logger) {

	return declare("de.vommond.NLPViewer", [ WidgetBase, TemplateMixin], {
		
		templateString : '<div class="nlpviewer">'+
								'<div class="content"  data-dojo-attach-point="content"> NLP'+
								'</div>'+
							'</div>',
							

		
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.NLPViewer"});
		},
		
		startup : function() {
			this.log.log(2,"startup","enter");
		}

});
});
