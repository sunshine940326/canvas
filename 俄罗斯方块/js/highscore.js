(function(window){
	'use strict';

	function HighScore(){   //注意三个变量名字
		this.canvas = new Canvas('highscore',100,70);   //canvas对象
		this.highScore = 0;   //得分是多少

		this._init();

	}

	HighScore.prototype = {
		constructor:HighScore,

		_init:function(){
			this.highScore = this._getScore();
			this._render();
		},
		_render:function(){    //控制context绘制得分
			this.canvas.drawText(this.highScore);
		},
		_getScore:function(){
			return window.localStorage.getItem('high-score') ||0;
		},
		_setScore:function(value){
			window.localStorage.setItem('high-score',value);
		},
		checkScore:function(score){
			if(score>this.highScore){
				this.highScore =score;
				this._setScore(score);
				this._render();
			}
		}  
		//对外暴露最高分
		
	};
	window.HighScore = HighScore;
})(window);