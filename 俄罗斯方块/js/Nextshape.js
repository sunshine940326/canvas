(function(window){
	'use strict';

	function NextShape(){
		this.canvas = new Canvas('nextshape',100,70);
		
		this._init();

	}

	NextShape.prototype = {
		constructor:NextShape,

		_init:function(){
			this.rows = 4;
			this.cols = 6;
		},
		render:function(shape){    //对外的渲染  传参数********
			this.canvas.clear();
			shape.draw(this.canvas.context,20);  //新增右上角方块大小参数
			//16*4~70.16~6~100
			//在shape里面定位
		}
		
	};
	window.NextShape = NextShape;
})(window);