function Shape(x, y, texte){
		this.x = x;
		this.y = y;
		this.size = 150;

		this.text = texte;
		this.placement = [];
		//this.vectors = [];
	}

/*//idata 为一个对象
	var idata = cxt.getImageData(0, 0, W, H);
	
	ImageData {data: Uint8ClampedArray[1885276], width: 733, height: 643}
		data:Uint8ClampedArray[1885276] //8位无符号整形数组
		height
		:643
		width:733
	
	var buffer32 = new Uint32Array(idata.data.buffer);
	/*
		将8位无符号整形数组，转换成32位的,范围为[471318]
	*/
Shape.prototype.getValue = function(){

		//draw the shape
		 context.textAlign = "center";
		 context.font =  this.size + "px arial";
		 context.fillText(this.text, this.x, this.y);

		 var idata = context.getImageData(0, 0, W, H);
		 var buffer32 = new Uint32Array(idata.data.buffer);

		 for(var j=0; j < H; j += gridY){
		 	for(var i=0 ; i < W; i += gridX){
		 		if(buffer32[j * W + i]){
		 			var particle = new Particle(i, j, type);
		 			this.placement.push(particle);
		 		}
		 	}
		 }
        
        context.clearRect(0, 0, W, H);

}


