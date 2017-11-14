(function(window){
	'use strict';

	var levalArr = (function(){			//自调用函数
		var arr = [];
		for(var i =0;i<10;i++){			//十个等级
			arr.push(Math.pow(2,i)*100);   //等级分数限制
		}
		return arr;
	})();

	function Leval(){
		this.canvas = new Canvas('leval',100,70);
		this.leval = 0;

		this._init();

	}

	Leval.prototype = {
		constructor:Leval,

		_init:function(){
			this._render();
		},
		_render:function(){    //控制context绘制得分
			this.canvas.drawText('Leval '+this.leval);
		},
		checkLeval:function(score){
			if(score>=levalArr[this.leval]){
				this.leval++;
				this._render();  //调用绘制
				return this.leval;
			}
			return 0;   //??????????
		}
		
	};
	window.Leval = Leval;  //需要到Tetris注册
})(window);