(function(document){   //document通过参数获得，避免作用域链一层层搜索
	var gameInst;
	function DomObject(dom){
		this.dom =dom;
	}
	DomObject.prototype.get = function(){
		return this.dom;
	}

	DomObject.prototype.on = function(eventName,eventHandler){  //事件注册
		this.get().addEventListener(eventName,eventHandler);
	}

	DomObject.prototype.css = function(styleKey,styleValue){
		this.get().style[styleKey] = styleValue;
	}

	function $(selector,context){    //context在哪里去找，如果没有就用document
		return new DomObject((context || document).querySelector(selector));
	}

	//创建方法，启动游戏
	function startGame(){
		ResourceManager.onResourceLoaded = function(){
			// new Board();   测试显示第一个图形
			gameInst = new Tetris();
			gameInst.startGame();    //启动游戏	
		}			
		ResourceManager.init();      //调用init方法
	}
	function _init(){   //初始化
		$('.btn-start').on('click',function(ev){		//开始游戏
			$('.start-container').css('display','none');
			$('.game-container').css('display','block');
			startGame();
		});
		$('.btn-set').on('click',function(){  		//弹出设置
			// alert("睡觉")
			$('.modal-dialog ').css('display','block');
		});
		$('#btn-dialog-close').on('click',function(){  		//关闭弹出层
			
			$('.modal-dialog ').css('display','none');
			gameInst && gameInst.resume();  //如果存在就继续？？？？？？？
		});
		$('#ck-sound').on('change',function(){				//根据勾选来判断是否播放声音
			var  enable = $('#ck-sound').get().checked;
			window.TetrisConfig.config.enableSound = enable;
		});

		$('.btn-game-setting').on('click',function(){   //设置游戏
			// alert("睡觉")
			// $('.modal-dialog').css('display','block');  
			// gameInst.pause();  //暂停游戏
		});
		$('.btn-game-pause').on('click',function(evt){   //暂停游戏
			// alert("你要暂停吗");
			var el = evt.target;
			if(el.innerText ==='暂停'){
				el.innerText = '继续';
				gameInst.pause();
			}else{
				el.innerText = '暂停';
				gameInst.resume();
			}
		});
		$('.btn-game-start').on('click',function(evt){ 
			// startGame();
		});
	}

	document.addEventListener('DOMContentLoaded',function(ev){
		_init();
	})
})(document);