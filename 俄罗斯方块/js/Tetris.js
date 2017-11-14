(function(window){
	'use strict';

	// var intervalId;  //计时器id
	// var speed = 400;


	function Tetris(){      //游戏对象

		this.board = new Board(this);    //通过传递this，进行事件拦截
		this.score =new Score();  //绘制得分
		this.timer = new Timer();  //绘制计时
		this.leval = new Leval();  //绘制级别
		this.nextshape = new NextShape();  //绘制下一个方块 
		this.highscore = new HighScore();   //绘制最高分
		this._sound;		//声音
		this._state = 'playing';
		(new Keyboard()).init(this.board);    //初始化键盘事件，启动keyboard
	};

	Tetris.prototype={
		constructor:Tetris,
		_initAudio:function(){				//播放背景音乐
			this._sound = new Howl({
				src:['audio/bg.wav'],
				loop:true,
				volume:0.3
			});
			// this._sound.play();
			this._playSound();
		},
		_playSound:function(){
			if(window.TetrisConfig.config.enableSound){
				this._sound.play();
			}
		},

		_startTick(){	
		var self = this;
		window.TetrisConfig.intervalId = window.setInterval(function(){
				self.board.tick();   //每次跳动  this和tetris的this不一样，用self变量调用
			},TetrisConfig.speed);		
			
		},
		_stopTick:function(){      
			clearInterval(window.TetrisConfig.intervalId);
		},
		startGame:function(){		//开始游戏
			// var self = this;
			this._initAudio();			//调用播放音频函数
			this._startTick();
			
		},
		endGame:function(){			//结束游戏
			//停止播放音乐
			this._sound.stop();
			//停止tick
			this._stopTick();
			//停止事件处理
			this._stopTick();
			//停止计时
			this.timer.stop();
		},
		pause:function(){
			//暂停播放音乐
			//暂停事件响应 1,解绑，2，事件拦截
			//取消tick
			//暂停计时器
			if(this._state==='over'){		//防止结束后继续播放音乐
				return;
			}
			this._sound.pause();
			this._state = 'pause';
			this._stopTick();
			this.timer.pause();
		},
		resume:function(){
			if(this._state==='over'){
				return;
			}
			this._playSound();;
			this._state = 'playing';
			this._startTick();
			this.timer.resume();
		}
	}
	window.Tetris = Tetris;
})(window);