// Include basic Dojo, mobile, XHR dependencies along with
define([ "dojo/_base/declare", 
         "dijit/_WidgetBase",  
         "dojo/_base/lang", 
         "dijit/_TemplatedMixin", 
		 "dojo/dom-class", 
		 "dojo/dom-geometry",
		 "dojo/on",
		 "de/vommond/_Widget",
		 "de/vommond/Logger"
		

], function(declare, WidgetBase, lang, TemplateMixin, css, domGeom ,on, _Widget, Logger) {

	return declare("de.vommond.DashletTypeConfig", [ WidgetBase, TemplateMixin,_Widget], {
		
		templateString : '<div class="VommondDashletTypeConfig">'+
//							'<div class="VommondDashletItem" data-dojo-attach-point="configTypeLabel"> '+
//								'<span class="VommondCheckBox"><span class="VommondCheckBoxHook"></span></span>'+
//								'<span class="VommondDashletLabel">Bar Chart</span>'+
//							'</div>'+
						'</div>',
			
					
		widgetTypes :{PercentageBar : "Percentage Bar", BarChart : "Bar Chart", TimeLabel: "Time Label", NumberLabel : "Number Label"},
						
	
		
		
		postCreate: function(){
			console.debug("X", Logger);
			this.log = new Logger({className : "de.vommond.DashletTypeConfig"});
			this.log.log(0,"postCreate","enter");
			
			this.checkBoxes = {};
			
			for(var key in this.widgetTypes){
				var div = document.createElement("div");
				css.add(div, "VommondDashletItem");
				
				
				
				var check = document.createElement("span");
				css.add(check, "VommondCheckBox");
				div.appendChild(check);
				
				var hook = document.createElement("span");
				css.add(hook,"VommondCheckBoxHook");
				check.appendChild(hook);
				
				var label = document.createElement("span");
				css.add(label, "VommondDashletLabel");
				label.innerHTML = this.widgetTypes[key];
				div.appendChild(label);
				
				this.checkBoxes[key] = check;
			
				this.domNode.appendChild(div);
				
				this.own(on(check, "mousedown", lang.hitch(this, "onChange", key)));
				this.own(on(label, "mousedown", lang.hitch(this, "onChange", key)));
			}

//			this.own(on(this.cancelBtn,"mousedown", lang.hitch(this,"onCancel")));
//			this.own(on(this.saveBtn,"mousedown", lang.hitch(this,"onSave")));
		},
		
		onChange:function(value,e){
			this.stopEvent(e);
			this.setValue(value);
		},
		
		setValue:function(value){
			
			for(var key in this.widgetTypes){

				if(key == value){
					css.add(this.checkBoxes[key],"VommondCheckBoxChecked") ;
				} else {
					css.remove(this.checkBoxes[key],"VommondCheckBoxChecked") ;
				}
			}
			
			this.value = value;
		},
		
		getValue:function(){
			return this.value;
		}
		
		
		
		
	});
});