
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

    return declare("de.vommond.Table", [_WidgetBase, _TemplateMixin], {
    	
	
   	templateString:'<div class="vommondTable">' +
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
		this.logger = new Logger({"className":"de.vommond.Table"});
		this.logger.log(2,"constructor", "entry");	
	
	},
	
	startup: function(){
		this.logger.log(2,"startup", "entry");
	
		

		if(this.columns && this.columns!=""){
			this.columns = this.columns.split(";");
			console.debug(this.columns);
		}
		
		if(this.actions && this.actions!=""){
			this.actionsNames = this.actions.split(";");
			this.actions =null;
		}
		
		if(this.key && this.key!=""){
			this._sortBy = this.key;
		}
				
		if(this.search && this.search=="true"){
			this.search = true;
		}
		
		//	var state = this._persState[this.id];
		var c = (cookie("vommondTable"+this.messagePrefix));
		if(c){
			var state = null;
			try {
				state = json.parse(c, true);
			} catch(Exception){
				
			}

			if(state){
				this.itemPointer = state["itemPointer"];
				this._sortBy = state["sortBy"];
				this._order = !state["order"];
				this._order = !state["order"];
				this._filter =state["filter"];		
				this.logger.log(2,"postCreate", "setState > itemPointer : " + this.itemPointer + " > sortBy : " + this._sortBy);
			}
		}
		
	
		if(this.actionStyles && this.actionStyles!=""){
			this.actionStyles = this.actionStyles.split(";");			
		} else {
			this.actionStyles = null;
		}
		
		
		if(this.messageBundle && this.messageBundle!=""){		
			this.nlsMessages =  dojo.i18n.getLocalization(this.messageBundle, "messages");
		} else {
		    this.nlsMessages = {};
		}

		
		this.fcts=Array();
		
		if(this.url && this.url!=""){
			this._get(this.url, "json", lang.hitch(this, "setValue" ));
		}
		
		
	},
	

	
	setColumns: function(columns){
		this.columns = columns;
	},
	
	/**
	 * Pass a map<id,FUNCTION>
	 */
	setActions: function(actions){
		this.logger.log(2,"setActions", "entry size > " +actions.length);
		this.actions = actions;
	},
	
	/**
	 * Expects a function (row, actionName) which return true.
	 * 
	 * 
	 */
	setActionSelectFct: function(selectFCT){
		this.logger.log(2,"setActionSelector", "entry");
		this.actionSelectFct = selectFCT;
	},

	
	/**
	 * Pass a Map<column,FUNCTION>. The function will be executed,
	 * if the value for this column will be rendered.
	 */
	setColumnFcts: function(fcts) {
		this.fcts = fcts;
	},
	
	/**
	 * Pass a function, which will be called everytime a new row is complete.
	 * The function gets two parameters: 
	 * 		- The row data object
	 * 		- The tr object
	 */
	onRowComplete: function(fct){
		this.rowFct = fct;
	},
	
	/**
	 * Reloads and redraws the table
	 */
	refresh:function(){
		this.logger.log(2,"refresh", "entry");
		this.rows.reset();
		this._refresh();		
	},
	
	
	set:function(key, value){		
		if(key == "value" && value){
			this.setValue(value);
		} else {
			this.inherited(arguments);
		}			
	},
	
	addClass:function(node, css2){
		if(!this.customCSS){
			css.add(node, css2);
		}	
	},
	
	setValue:function(data){
		this.logger.log(1,"setValue", "entry");
	
		if(data instanceof Array){
			this._data = data;
			this.store = this._createStore(data);
		} else {
			this.store = data;		
		}
		

		this.rows = this.store.query(null, {sort: [{attribute: "id"}], start : this.itemPointer, count : this.itemsPerPage});

		
		if(this._sortBy){
			this.sort(this._sortBy, this._order);
		}
		
		if(this._filter){
			this.filter(this._filter);
		}
		
		this._refresh();
		
		this.logger.log(2,"setValue", "exit");
	},
	
	_createStore:function(data){
		var store = new Store({data: data});
		this._totalCount = data.length;
		return store;
	},
	
	_onFilter:function(){
		
		if(this._filterBox){
			var value = this._filterBox.value;
			this.filter(value);
		}
	},
	
	_onFilterKeyUp:function(e){
		var keynum=-1;
		this._keepFilterFocus = false;
		
		if(window.event) // IE
		{
			keynum = e.keyCode;
		}
		else if(e.which) // Netscape/Firefox/Opera
		{
			keynum = e.which;
		}
		
		if(keynum == 13){
			this._onFilter();
		}
		
		var value = this._filterBox.value;
		if(value.length >= this.minSearchLength){
			this._keepFilterFocus = true;
			this._onFilter();
		}
	},
	
	_refresh: function(){
		this.logger.log(2,"_refresh", "entry > pos : " + this.itemPointer + " _sortBy : " + this._sortBy);
		
		this._destroyTempListeners();

		
	
		
		this.domNode.innerHTML="";	
		
//		if(this.rows.count == 0){
//			if(this.nlsMessages[this.messagePrefix+"_NoData"]){
//				this.domNode.innerHTML =nls[this.messagePrefix+"_NoData"];
//			} else {
//				this.domNode.innerHTML ="No Data";
//			}
//
//			return;
//		}
	
		if(this.search){
			var div = document.createElement("div");
			css.add(div, "tableSearch");
			css.add(div, "input-append");

			this._filterBox = document.createElement("input");
			attr.set(this._filterBox, "type", "text");
			div.appendChild(this._filterBox);
			
			if(this._filter){
				this._filterBox.value = this._filter;		
			}			

			var button = document.createElement(a);
			button.innerHTML="Search";			
			css.add(button,"btn");
			div.appendChild(button);
			
			this.connect(button, "onclick", "_onFilter");
			this.connect(this._filterBox, "onkeyup", "_onFilterKeyUp");
			
			this.domNode.appendChild(div);
		}
		
		
		var table = document.createElement("table");
		css.add(table, "table");
		//css.add(table, "table-hover");
		
		var thead = document.createElement("thead");
		table.appendChild(thead);
		
		
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		// create Header

		var header = document.createElement("tr");
		this.addClass(header,"tableHeader");
		for(var i=0; i< this.columns.length; i++){
			var column = this.columns[i];
			var td = document.createElement("td");
			css.add(td,column);
			var label="";
			if(this.nlsMessages[this.messagePrefix+"_"+column]){
				label = this.nlsMessages[this.messagePrefix+"_"+column];
			} else {
				label = column;
			}
		
			if(this.isSortable){
				var a = document.createElement("a");
				a.innerHTML = label;
				a.setAttribute("column",column);
				var connection = on(a,"click", lang.hitch(this, "_sort",column ));
				this._addTempListener(connection);
				td.appendChild(a);
				var span = document.createElement("span");
				if(this._sortBy == column){				
					if(this._order){
						span.innerHTML = "&#9660;";				
					}else {
						span.innerHTML = "&#9650;";
					}				
				} else {
					span.innerHTML = "";
				}
				td.appendChild(span);
			} else {
				td.innerHTML = label;
			}
			header.appendChild(td);
		}
		if(this.actions || 	this.actionsNames) {
			var td = document.createElement("td");
			this.addClass(td,"action");

			if(this.nlsMessages[this.messagePrefix+"Action"]){
				td.innerHTML = this.nlsMessages[this.messagePrefix+"Action"];
			} else {
				td.innerHTML = "Actions";
			}
			header.appendChild(td);
		}
		thead.appendChild(header);
	
		

		this.createDataRows(tbody);
		
		
		this.domNode.appendChild(table);
		
		// add paging...
		this.createPagging();
		
		// save the state
		this._saveState();
		
		
		// FIXME: This is somehow ugly. we should consider just to render
		if(this._filterBox){
			this._filterBox.focus();
			this._filterBox.selectionStart = this._filterBox.value.length;
		}
	
	},
	
	createDataRows : function(tbody){
		this.logger.log(3,"createDataRows", "entry "); 
		// add data rows
		//var length = this.rows.count;
		var count =0;
		var me = this;
		this.rows.forEach(function(row){
			me.createDataRow(row, tbody, count);
			count++;
		});
		
	},
	
	createDataRow: function(row, tbody, j){
		this.logger.log(4,"createDataRows", "entry "); 
		
		var tr = document.createElement("tr");
		if(j % 2 == 0){
			this.addClass(tr,"evenRow");
		}
		this.addClass(tr,"dataRow");
		// add data
		for(var i=0; i< this.columns.length; i++){
			var column = this.columns[i];
			var td = document.createElement("td");
			css.add(td,column);
			// add customized label

			if(this.fcts[column]) {
				var innerHTML = this.fcts[column](row, column);
			}else {
				var data = this._getValueByExpression(row, column);
				var innerHTML  = data;
			}
	
			// highlight in case of filter...
			if(this._filter){
				innerHTML+="";
				// FIXME: optimize...
				var pos = innerHTML.toLowerCase().indexOf(this._filter.toLowerCase());				
				if(pos >= 0){
					var prefix = innerHTML.substring(0,pos);
					var filter = innerHTML.substring(pos, pos+this._filter.length);
					var suffix = innerHTML.substring(pos+this._filter.length, innerHTML.length);
					innerHTML = prefix + "<b>" + filter+ "</b>" + suffix;
				}
			}
			td.innerHTML = innerHTML;
			tr.appendChild(td);
		}
		// add actions
		if(this.actions || 	this.actionsNames) {
			var td = this.createActions(j, row);
			tr.appendChild(td);
		}
	
		// add custom stuff
		if(this.rowFct){
			this.rowFct(row, tr);
		}
		tbody.appendChild(tr);
	},
	
	createActions:function(j, row){
		var td = document.createElement("td");
		css.add(td,"action");
		
		//this.logger.log(0,"createActions", "entry > j : " + j); 
		var count = 0;
		var me = this;

		if(this.actionsNames){
			
			for(var i=0; i < this.actionsNames.length;i++){
				var a = document.createElement("a");
				var msgKey = this.messagePrefix+"_"+this.actionsNames[i].replace(".", "_");
				if(this.nlsMessages[msgKey]){
					a.innerHTML =nls[msgKey];
				} else {
					a.innerHTML = this.actionsNames[i];
				}
			
				attr.set(a, "href", "#method="+this.actionsNames[i] + "&" + this.key + "=" + encodeURI(row[this.key]));	
				
				if(this.actionStyles){
					css.add(a, this.actionStyles[i]);	
				}else {
					css.add(a, this.actionCSS);	
				}
					
				td.appendChild(a);				
			}
		
		}
	
		
		return td;
		
	},
	
	
	createPagging: function(){
		this.logger.log(3,"createPagging", "entry > total : " + this._totalCount +  " >  page : " + this.itemsPerPage +  " > current:  "+ this.itemPointer ); 
		
		if(this._totalCount  > this.itemsPerPage){
			
			//console.debug(this.itemsPerPage, this.itemPointer);
			var div = document.createElement("div");
			css.add(div, "pagination pagination-small");
			
			var ul = document.createElement("ul");
			div.appendChild(ul);
			
			
			var li = document.createElement("li");
			ul.appendChild(li);
			
			var backLink = document.createElement("a");
			backLink.innerHTML = "&lt;&lt;";
			li.appendChild(backLink);
			//attr.set(backLink, "href", "#");
			if(this.itemPointer >= this.itemsPerPage){	
				var connection = on(li, "click", lang.hitch(this, "onBackward"));
				this._addTempListener(connection);
			} else {
				css.add(li, "disabled");
			}
			
			
			var steps =  Math.ceil(this._totalCount / this.itemsPerPage);
			for(var i=0; i< steps; i++){

				li = document.createElement("li");
				ul.appendChild(li);
				
				var a = document.createElement("a");
				a.innerHTML = (i+1) + "";
				li.appendChild(a);
		
				
				if(i * this.itemsPerPage == this.itemPointer){
					css.add(li, "active");
				} else {
					
					var connection = on(li, "click", lang.hitch(this, "setPos", i * this.itemsPerPage));
					this._addTempListener(connection);	
				}
			}
			
			
			
			
			li = document.createElement("li");
			ul.appendChild(li);
			
			var forwardLink = document.createElement("a");
			forwardLink.innerHTML = "&gt;&gt;";
			li.appendChild(forwardLink);
			if(this.itemPointer <= (this._totalCount - this.itemsPerPage)){
				var connection = on(li, "click", lang.hitch(this, "onForward"));
				this._addTempListener(connection);			
			}else {
				css.add(li, "disabled");
			}
			
//
//			var container= document.createElement("div");
//			css.add(container, "paginationContainer");
//			
//			container.appendChild(div);
			
			this.domNode.appendChild(div);
		}
		
	},
	
	setPos: function(newValue){
		this.logger.log(3,"setPos", "entry > pos : " + newValue );
		
		if(newValue != this.itemPointer){
			this.itemPointer = newValue;
			this._updateRows();
			this._refresh();
		}				
		
	},
	
	
	onBackward: function(event){
		this.logger.log(3,"onBackward", "entry" );
		this._stopEvent(event);
	
		this.itemPointer = Math.max((this.itemPointer - this.itemsPerPage), 0);
		this._updateRows();
		this._refresh();
	},
	
	onForward: function(event){
		this.logger.log(3,"onForward", "entry > currentPos : " +this.itemPointer + ">  newPos : " + (this.itemPointer + this.itemsPerPage)  );
		this._stopEvent(event);
	
		this.itemPointer = this.itemPointer + this.itemsPerPage;
		this._updateRows();
		this._refresh();
	},
	
	_sort:function(sortBy){
		this.logger.log(2,"_sort", "entry > " + sortBy + " > " + this._order );
		//this._stopEvent(event);  
		
		this._order = !this._order;
		this._sortBy = sortBy;
		
		this.sort(sortBy, this._order);
		
	
		this._refresh();
	},
	
	_updateRows:function(){
		this.rows = this.store.query(null, {sort: [{attribute: this._sortBy, descending : this._order}], start : this.itemPointer, count : this.itemsPerPage});
	},
	

	_destroyTempListeners : function(){
		if(this._tempListeners){
			for(var i=0; i < this._tempListeners.length; i++){
				this._tempListeners[i].remove();
			}			
		}
		this._tempListeners = Array();
	},
	
	_addTempListener :function(connection){
		if(!this._tempListeners){
			this._tempListeners = Array();
		}
		this._tempListeners.push(connection);
	},
	
	_saveState: function(){
		var state = {};
		if(this._sortBy)
			state["sortBy"] = this._sortBy;
		
		if(this.itemPointer)		
			state["itemPointer"] = this.itemPointer;
		
		if(this.order)	
			state["order"] = this._order;
		
		if(this._filter)	
			state["filter"] = this._filter;		
	
		
		cookie("fhpTable"+this.messagePrefix, json.stringify(state));
		
	},
	

	
	sort: function(criteria, order){
		
		this._updateRows();
		//this.rows = this.store.query(null, {sort: [{attribute: criteria, descending : order}]});
		//this.rows.sort(criteria, order);
	},
	
	filter: function(value){
		this.logger.log(2,"filter", "entry > " + value );
		
		// filter does only work with arrays
		if(this._data){
			var temp = [];
			if(value && value!=""){
				
				value = value.toLowerCase();	

				for(var i = 0; i< this._data.length; i++){
					var row = this._data[i];
	
					for(var j=0; j< this.columns.length; j++){
						var column = this.columns[j];				
						var columnValue = row[column];
			
						if(columnValue && columnValue.toLowerCase){
							columnValue = columnValue.toLowerCase();
					
							if(columnValue.indexOf(value)>= 0){	
					
								temp.push(row);
								break;
							}
						}
					}
				
				}
			} else {
				temp = this._data;
			}	
	
			this.store = this._createStore(temp);
			

			this.rows = this.store.query(null, {sort: [{attribute: "id"}], start : this.itemPointer, count : this.itemsPerPage});


			//this.rows.filter(value, this.columns);
			this._filter = value;
		}
		
	
		this._refresh();
		this.logger.log(2,"filter", "exit " );
	},
	
	 /**
	   * Returns the value of an object defined by an object expresion, e.g.
	   * 
	   * Object: {child:{Foo:"Bar"}} 
	   * Query : Child.Foo
	   * Result : "Bar"
	   */
	  _getValueByExpression:function(object, expression){
	  	  this.logger.log(5,"_getValueByExpression", "enter > expression '" + expression+ "'");
	  	  	   
		  var value = object;	 
	  	  var parts = expression.split(".");

		  for (var i=0; i< parts.length; i++) {		  
			  var part = parts[i];			  
			  if(value && part!=""){
				  var start =part.indexOf("[");
				  if(start >0){
					  var end = part.indexOf("]");
					  if(start < end){
						  var index = part.substring(start+1, end) * 1;
						  var varibale = part.substring(0, start);						  
						  var arrayVariable = value[varibale];	
						  if(dojo.isArray(arrayVariable)){
							  value = arrayVariable[index]; 			
						  } else {
						  	  this.logger.warning(2,"_getValueByExpression", "The array expression " + expression + " is not valid for the variable " + varibale);
						  }
					  }					  
				  } else {
					  value = value[part]; 
				  }
			  } 
		  }
		  
		  return value;	 	  
	  },
	  
	  destroy:function(){
		  this.inherited(arguments);
		  console.debug("Destroy")
	  }

    });

});
