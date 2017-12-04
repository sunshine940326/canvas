
/*键盘控制*/
(function(window){
	'use strict';
	var keys = {
		38:'top',
		39:'right',
		40:'down',
		37:'left'
	}
	function Keyboard(){    //这里传参数，按键盘会有滞后？？？？？？？？？？？？？？
		this.board;
	};
	Keyboard.prototype={
		constructor:Keyboard,
		init:function(board){   //注册事件
			var self = this;
			self.board = board;
			document.addEventListener('keydown',function(evt){   //keypress无法连续按键
				self.processKeyDown(evt);
			});
		},
		processKeyDown:function(evt){
			//事件拦截
			if(this.board.gameInst._state != 'playing'){
				return;
			};
			// console.log(evt.keyCode);   //打印出键盘对应编号
			if(keys[evt.keyCode]){  //如果按键存在
				this.press(keys[evt.keyCode]);   //这种写法？？？？？？？？？？？
			};
		},
		press:function(key){          //键盘控制
			// console.log('right');   调试有没有执行
			var refresh = false;			//平滑效果 ？？？？？？？
			switch(key){
				case 'top':

				if(this.board.validMove(0,0)){
					this.board.shape.rotate();
					refresh = true;
				}
				//翻转
				break;
				case 'right':
				if(this.board.validMove(1,0)){  //判断是否越界
					this.board.shape.x+=1;   //键盘控制方块移动
					refresh = true;
				}				
				break;
				case 'down':
				if(this.board.validMove(0,1)){
					this.board.shape.y+=1;
					refresh = true;

				}
				//加速下落
				break;
				case 'left':
				if(this.board.validMove(-1,0)){
					this.board.shape.x-=1;
					refresh = true;
				}
				break;
			};
			if(refresh){
				this.board.refresh();
				this.board.shape.draw(this.board.context);
				if(key ==='down'){
					var self = this;
					window.clearInterval(window.TetrisConfig.intervalId);
					window.TetrisConfig.intervalId = window.setInterval(function(){
						self.board.tick();
					},TetrisConfig.speed);
					/*
					setInterval(function(){			//导致下落速度越来越快
						self.board.tick();
					},TetrisConfig.speed);*/
				}
			}
		}
	};

	window.Keyboard = Keyboard;
})(window);