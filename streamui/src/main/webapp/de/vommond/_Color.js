define([ "dojo/_base/declare",
		 "dojo/_base/Color",
], function(declare, Color) {

	return declare("de.vommond._Color", [], {
		
		 colors_hot : ['#F4BF00', '#FF1A00'],
		    
		 colors_cold : ['#0053AD', '#00A4E0'],
	

		 mixColor:function(value){
			 
			 if(value < 0.5){
				 // e.g. 0.4 = 0.8; 0.1 = 0.2
				 value *=2;
				 var color = Color.blendColors(
					 		new Color(this.colors_cold[0]), 
					 		new Color(this.colors_cold[1]), 
					 		value); 
				 
				 return color.toHex();
			 } else {
				 // e.g. 0.5 = 0; 0.6 = 0.2; 0.75 = 0.5, 1 = 1
				 value = (value - 0.5) *2;
				 var color = Color.blendColors(
					 		new Color(this.colors_hot[0]), 
					 		new Color(this.colors_hot[1]), 
					 		value); 
				 
				 return color.toHex();
			 }  
		 }
		
	
	
	});
});
