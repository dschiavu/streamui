// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase",  
         "dojo/_base/lang", 
         "dijit/_TemplatedMixin", 
		 "dojo/dom-class", 
		 "dojo/dom-geometry",
		 "dojo/on",
		 "de/vommond/DashletTypeConfig",
		 "de/vommond/_Widget",
		 "de/vommond/_Dialog",
		 "de/vommond/Logger",
		 "de/vommond/PercentageBar",
		 "de/vommond/BarChart",
		 "de/vommond/TimeLabel",
		 "de/vommond/NumberLabel"

], function(declare, WidgetBase, lang, TemplateMixin, css, domGeom ,on,DashletTypeConfig, _Widget, _Dialog, Logger, 
			PercentageBar, BarChart,TimeLabel,NumberLabel) {

	return declare("de.vommond.Dashlet", [ WidgetBase, TemplateMixin,_Widget, _Dialog], {
		
		templateString : '<div class="VommondDashlet">'+
							'<div class="VommondDashletContainer"  data-dojo-attach-point="container">'+
							
								'<div class="VommondDashletTypeContainer"  data-dojo-attach-point="config">'+
									'<div class="VommondDashletTypeLabel" data-dojo-attach-point="configTypeLabel"></div>'+
									
								
									
								'</div>'+
								'<div class="VommondDashletContentContainer"  data-dojo-attach-point="content">'+
								'</div>'+
							'</div>'+
							'<div class="VommondDashletButtonBar VommondDashletButtonBarHidden"  data-dojo-attach-point="buttons">'+
								'<a class="VommondDashletButton"  data-dojo-attach-point="cancelBtn">Cancel</a>'+
								'<a class="VommondDashletButton"  data-dojo-attach-point="saveBtn">Save</a>'+
							'</div>'+
						'</div>',
			
	
		widgetTypes :{truesPercentage : "PercentageBar", counts : "BarChart", timeMean: "TimeLabel", numberMean : "NumberLabel"},
	
		
	
		
		
		postCreate: function(){
			this.log = new Logger({className : "de.vommond.Dashlet"});
			this.log.log(0,"postCreate","enter");
			

			this.own(on(this.cancelBtn,"mousedown", lang.hitch(this,"onCancel")));
			this.own(on(this.saveBtn,"mousedown", lang.hitch(this,"onSave")));
		},
		
		setLayout:function(l){
			if(l.length > 0){
				this.layout = l;
			}
	
		},
		
		onSave:function(e){
			this.log.log(2,"onSave","enter");
			this.stopEvent(e);
			
			if(this.mode){
				this.saveTypeSelector();
			} else {
				if(this.callback){
					this.callback(this.layout);
				}
			}
			
		},
		
		onCancel:function(e){
			this.log.log(2,"onCancel","enter");
			this.stopEvent(e);
			
			
			if(this.mode){
				this.hideTypeSelector();
			} else {
				/**
				 * Reset old layout
				 */
				this.layout = this.oldLayout;
				for(var type in this.widgets){
					for(var aspect in this.widgets[type]){
						this.widgets[type][aspect].destroy();
					}
				}
				this.render(this.layout);
				
				/**
				 * Invoke Callback
				 */
				if(this.callback){
					this.callback(null);
				}
			}
			
			
			
			
		},
		
	
		
		
		
		init:function(status){
			if(!this.layout){
				this.layout = this.buildDefaultLayout(status);
			}
			
			if(!this.widgets){
				this.render(this.layout);
			
			}		
			
		},
		
		render:function(layout){
			this.log.log(0,"buildDefaultLayout","render");
			
			this.content.innerHTML = "";
			this.widgets = {};
			this.itemDivs = [];
			
			this.cleanUpTempListener();
			
			
			for(var i=0; i< layout.length; i++){
				var l = layout[i];
				this.renderItem(l,i);
			}
		},
		
		
		renderItem:function(l,pos){
			
			var item =document.createElement("div");
			css.add(item, "VommondDashletItem");
			if(!l.visible){
				css.add(item, "VommondDashletItemHidden");
			}
			
			var container =document.createElement("div");
			css.add(container, "VommondDashletItemWidget");
		
			item.appendChild(container);
			
			var config =document.createElement("div");
			css.add(config, "VommondDashletItemConfig");
			item.appendChild(config);
			
			var span = document.createElement("span");
			if(l.visible){
				css.add(span, "glyphicon glyphicon-eye-open");
			} else {
				css.add(span, "glyphicon glyphicon-eye-close");
			}
			config.appendChild(span);
		
			
			var type = document.createElement("span");
			css.add(type, "glyphicon glyphicon-wrench");
			config.appendChild(type);
		
		
			this.createWidget(l, container);
			
		
			this.tempOwn(on(span, "mousedown", lang.hitch(this,"toggleVisible", l, span, item)));
			this.tempOwn(on(type, "mousedown", lang.hitch(this,"showTypeSelector", l, container)));
		
			this.content.appendChild(item);
			
			this.itemDivs[pos] = item;
		
			
		},
		
		
		createWidget:function(l, container){
			if(this["create"+l.widget]){
				var widget = this["create"+l.widget]();
				widget.setLabel(l.name);
				widget.placeAt(container);
				
				if(!this.widgets[l.type]){
					this.widgets[l.type] = {};
				}
				this.widgets[l.type][l.aspect] = widget;
				
			} else {
				this.log.log(0,"renderItem","Error: No widget type : " + l.widget);
			}
		},


		
		setStatus:function(status){

		
			this.init(status);
			
			
			/**
			 * set 	values
			 */
			for(type in status){
				values = status[type];
				for(aspect in values){
					var widget = this.getWidget(aspect, type);
					if(widget){
						widget.setValue(values[aspect]);
					} else {
						
						/**
						 * New aspect. Add just at bottom
						 */
						if(type != "receives" && type!= "emits"){
							values = status[type];
							if(values instanceof Object){
							
								var l = {
										name : aspect,
										aspect:aspect,
										type : type,
										widget: this.widgetTypes[type],
										visible : false
								};
								this.layout.push(l);
								this.renderItem(l,this.layout.length);
							}
						}
						
					}
				}
			}
			
			
		},
		
		
		
		toggleVisible:function(l, span, item, e){
			this.log.log(3,"toggleVisible","enter > ");
			this.stopEvent(e);
			
			if(l.visible){
				l.visible = false;
				css.add(span, " glyphicon-eye-close");
				css.remove(span, " glyphicon-eye-open");
				css.add(item, "VommondDashletItemHidden");
			} else {
				css.remove(span, " glyphicon-eye-close");
				css.add(span, " glyphicon-eye-open");
				l.visible = true;
				css.remove(item, "VommondDashletItemHidden");
			}
		},
		
		
		/***************************************************************************
		 * Type Selector
		 ***************************************************************************/
		
		/**
		 * show dialog to change type.
		 */
		showTypeSelector:function(l, container, e){
			this.log.log(0,"showTypeSelector","enter > ");
			this.stopEvent(e);
			
			if(!this.typeSelectorWidget){
				
				this.typeSelectorWidget = new DashletTypeConfig();
				this.typeSelectorWidget.placeAt(this.config);
			}
			
			this.typeSelectorWidget.setValue(l.widget);
			
			this.configTypeLabel.innerHTML = l.name;
			
			this.mode = 1;
			css.add(this.domNode, "VommondDashletType");
			
			var pos = domGeom.position(this.domNode);
			this.content.style.left = -1* pos.w -100 +"px";
			this.config.style.right = "0px";
			
			this._selectedLayout = l;
			this._selectedContainer = container;
		},
		
		saveTypeSelector:function(){
			this.log.log(0,"saveTypeSelector","enter > ");
		
			var widget = this.typeSelectorWidget.getValue();
			this._selectedLayout.widget = widget;
			
			var l = this._selectedLayout;
		
			/**
			 * Update ui
			 */
			var widget = this.widgets[l.type][l.aspect];
			widget.destroy();
			
			this.createWidget(l, this._selectedContainer);
			
			//this.render(this.layout);
			
			this.hideTypeSelector();
		},
		
		hideTypeSelector:function(animate){
			
			var pos = domGeom.position(this.domNode);
			this.config.style.right = (-1 * pos.h -100) +"px";

			this.content.style.left = "0px";
			this.mode = 0;
			this._selectedLayout = null;
			this._selectedContainer = null;
			css.remove(this.domNode, "VommondDashletType");
		},
		
		/***************************************************************************
		 * Config
		 ***************************************************************************/
		
		showConfig:function(callback){
			this.log.log(0,"showConfig","enter");
			
			this.oldLayout = lang.clone(this.layout);

			// show button bar
			css.add(this.domNode, "VommondDashletConfig");
			this.hideTypeSelector();
			
			// show items
			this.configDivs = [];

			
			this.callback = callback;
			return {};
		},
		
		closeConfig:function(){
			this.log.log(0,"closeConfig","enter");


			
			css.remove(this.domNode, "VommondDashletConfig");
			this.hideTypeSelector();
		},
		
		
		
		/***************************************************************************
		 * Facorty Methods
		 ***************************************************************************/
		
		createPercentageBar:function(){
			return new PercentageBar();
		},
	
		createBarChart:function(aspect,type){
			return new BarChart();	
		},
		
		createTimeLabel:function(aspect,type){
			return new TimeLabel();	
		},
		
		createNumberLabel:function(){
			return new NumberLabel();
		},
		
		getWidget:function(aspect, type){
			
			if(!this.widgets[type]){
				this.widgets[type] = {};
			}
			return this.widgets[type][aspect];
		},
		
		
		buildDefaultLayout:function(status){
			this.log.log(2,"buildDefaultLayout","enter");
			
			var layout =  [];
			
			for(type in status){
				if(type != "receives" && type!= "emits"){
					values = status[type];
					if(values instanceof Object){
						for(aspect in values){
							var l = {
								name : aspect,
								aspect:aspect,
								type : type,
								widget: this.widgetTypes[type],
								visible : true
							};
							layout.push(l);
							
						}
					}
				}
				
			}

			
			this.sortLayout(layout);
			
			
			return layout;
		},
		
		sortLayout:function(layout){
			/**
			 * sort by name
			 */
			layout.sort( function(a,b){
				if(a.name > b.name){
					return 1;
				}
				if(a.name < b.name){
					return -1;
				}
				return 0;
			});
		}
		
		
	});
});