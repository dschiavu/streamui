		var lines = [];
		lines.push(this.createLineData(0,0,200,200));
		lines.push(this.createLineData(0,0,300,200));
		
		this.svg.selectAll(".line")
			    .data(lines)
			    .enter().append("path")
			    .attr("class", "line")
			    .attr("d", this.lineFunction)
			    .attr("stroke","red")
		        .attr("stroke-width", 20)
		        .attr("fill", "none").
		        style("opacity", 0.5);
		
		

		var elementsPerLevel = [];
		var max = 0;
		for(id in g){
			console.debug(id, g[id].level);
			var level = g[id].level;
			if(!elementsPerLevel[level]){
				elementsPerLevel[level] =0;
			}
			elementsPerLevel[level]++;
			max = Math.max(max,elementsPerLevel[level] );
		}
		
		var maxHeight = ((max *2 ) -1)* this.boxHeight ;


		createLineData: function(xs,ys,xe,ye){
			var line = [];
			
			var bendFactorX = 0.25;
			var bendFactorY = 0.25;
		
			// start point
			line.push({x:xs,y:ys});
			
			var difX = Math.abs(xs-xe);
			var difY = Math.abs(ys-ye);
			
			line.push({x: Math.round(xs + bendFactorX*difX) ,y:ys});
			
			line.push({x: Math.round(xs + 0.5*difX) ,y: Math.round(ys + bendFactorY*difY)});
			
			line.push({x: Math.round(xs + 0.5*difX) ,y: Math.round(ye - bendFactorY*difY)});
			
			line.push({x: Math.round(xe - bendFactorX*difX) ,y: ye});
			
			// end point
			line.push({x:xe,y:ye});
			return line;
		},
		
		
		
//		
//		var lines = [];
//		lines.push(this.createLineData(0,0,200,200));
//		lines.push(this.createLineData(0,0,300,200));
//		
//		this.svg.selectAll(".line")
//			    .data(lines)
//			    .enter().append("path")
//			    .attr("class", "line")
//			    .attr("d", this.lineFunction)
//			    .attr("stroke","red")
//		        .attr("stroke-width", 20)
//		        .attr("fill", "none").
//		        style("opacity", 0.5);
//	
//		
//		this.drawBox(50, 150, 100,50);
//		
//		this.drawBox(400, 50, 100,50);
//		
//		this.drawBox(400, 150, 100,50);