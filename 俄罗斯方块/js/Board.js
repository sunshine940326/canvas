(function(window){
	'use strict';
	function Board(gameInst){  
	this.gameInst =gameInst; 
	this.blockSize = 30;  //每个三十像素大小
	this.rows = TetrisConfig.rows;			//引入config.js文件
	this.cols = TetrisConfig.cols;
	this.canvas = new Canvas('c_game_main',this.cols*this.blockSize,this.rows*this.blockSize);
	this.context = this.canvas.context;
	this.boardList = [];
	this.shape = new window.Shape();

	this._init();
	var b = ResourceManager.getResource('blocks');  //验证加载资源
	console.log(b);
	console.log("怎么打印不出来");
}

Board.prototype ={
	constructor: Board,
	_init:function(){
		this._buildGridData();
		this._initGrid();

		this.shape.draw(this.context);    //初始化随机出现的方块
		var self = this;  //添加延迟，这里render访问不到
		setTimeout(function(){
			self._buildNextShape();			//调用下 下一步方块
		})
		
	},
	_buildNextShape:function(){
		this.nextShape = new window.Shape();   //注意这里变量名
		this.nextShape.setPosition(this.gameInst.nextshape.cols,this.gameInst.nextshape.rows);      //定位  这里对象位置？？？？？？？？
		this.gameInst.nextshape.render(this.nextShape);  //绘制出右上角方块
	},
	_buildGridData(){			//创建二维数组
		var i,j;
		for(i=0;i<this.rows;i++){
				this.boardList[i] = [];
			for(j=0;j<this.cols;j++){
				this.boardList[i][j] = 0;
			}
		}
		// console.log(this.boardList);    打印出二维数组
	},
	_initGrid(){         		//创建画笔
		var i;
		this.context.strokeStyle = 'green';
		this.context.lineWidth = 0.5;

		//绘制线条笔迹
		for(i=0;i<=this.rows;i++){          //绘制横线
			this.context.moveTo(0,i*this.blockSize);
			this.context.lineTo(this.canvas.width,i*this.blockSize);
		}
		for(i=0;i<=this.cols;i++){			//绘制竖线
			this.context.moveTo(i*this.blockSize,0);
			this.context.lineTo(i*this.blockSize,this.canvas.height);
		}

		//画线
		this.context.stroke();

		//缓存数据    背景图始终不变，先缓存起来
		this.gridImageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);//起始坐标

	},
	tick:function(){
		if(this.validMove(0,1)){    //防止超出下边界
			this.shape.y+=1;  //每跳动一次，y+1
		}else{
			this.addShapeToBoardList();			//添加方块
			if(this.gameInst._state ==='over'){
				this.gameInst.endGame();
				return; //false;
			}
			this.clearFullRows();				//添加完，执行清理
			// this.shape = new window.Shape();    //重新实例化shape  ??????16讲
			this.shape = this.nextShape;   //???     控制右上角方块刷新
			this.shape.setPosition(this.cols,this.rows,true);  //ture忽略y行
			this._buildNextShape();
		}
		
		this.refresh();    //刷新画布
		this.shape.draw(this.context);  //继续把方块画出来  （实现了方块下落）
	},
	refresh:function(){
		this.canvas.clear();  //清空画布（绘制出方块和网格）
		this.context.putImageData(this.gridImageData,0,0)//每次刷新后把缓存数据推送到canvas,
		//(图像数据，推送起始点)
		
		this.drawBlocks();    //背景图加载出来后，画出落地方块
	},
	validMove:function(moveX,moveY){     //边界控制  ??????????????????????
		//下一步位置
		var nextX = this.shape.x +moveX;
		var nextY = this.shape.y+moveY;
		for(var y = 0;y<this.shape.layout.length;y++){  //第几行
			for(var x=0;x<this.shape.layout[y].length;x++){				
				if(this.shape.layout[y][x]){
					if(typeof this.boardList[nextY+y]==='undefined'  //找不到行
					|| typeof this.boardList[nextY+y][nextX+x]==='undefined'  //找不到列
					|| this.boardList[nextY+y][nextX+x] //当前位置已有方块
					|| nextX+x <0	//超出左边界
					|| nextX+x>=this.cols	//超出右边界
					|| nextY+y>=this.rows	//超出下边界
					){
						return false;
					}
				}
			}
		}
		return true;
	},
	addShapeToBoardList:function(){			//方块堆砌
	 for (var y = 0; y < this.shape.layout.length; y++) {
        for (var x = 0; x < this.shape.layout[y].length; x++) {
          if (this.shape.layout[y][x]) {		//
            var boardX = this.shape.x + x;		//
            var boardY = this.shape.y + y;
            if (this.boardList[boardY][boardX]) {		//如果碰撞上
              // todo Game over
              this.gameInst._state = 'over';
              return;   //停止加入
            }
            else {
              this.boardList[boardY][boardX] = this.shape.blockType;
              // this.boardList[boardY][boardX] = 1;
            }
          }
        }
      }
	},
	drawBlocks:function(){				//绘制出已经静止的方块
	  for (var y = 0; y < this.rows; y++) {
        for (var x = 0; x < this.cols; x++) {
          if (this.boardList[y][x]) {			//这是什么？？？？？？？？
            // this.shape.block.draw(this.context, x, y);			//解决下落后颜色改变
            this.shape.block.draw(this.context, x, y, this.boardList[y][x]);
          }
        }
      }
	},
	createEmptyRow(){   		//创建行
		var emptyArr = [];
		for(var i=0;i<this.cols;i++){
			emptyArr.push(0);
		}
		return emptyArr;
	},
	clearFullRows:function(){
		var self =this;
		var lines = 0;
		for(var y = this.rows-1;y>=0;y--){
			var filled = this.boardList[y].filter(function(item){return item>0;}).length ===this.cols;
			if(filled &&y){
				this.boardList.splice(y,1);			//boardList是什么？？？、
				this.boardList.unshift(this.createEmptyRow());  //追加到第一行
				lines++;
				y++;    //
			}
		}
		//计算得分
		var score = lines*10*lines;  //清除行数*单行得分*倍数
		var totalScore = this.gameInst.score.addScore(score);		//面板得分累加
		this.gameInst.highscore.checkScore(totalScore);    //  最高分
		var currentLeval = this.gameInst.leval.checkLeval(totalScore);
		if(currentLeval){
			window.TetrisConfig.speed = Math.floor(window.TetrisConfig.constSpeed * (1 - (currentLeval - 1) / 10)); 
			  //根据等级调整下落速度
			  this.gameInst.pause();
			  setTimeout(function(){
			  	window.alert('恭喜你升级了');
			  	self.gameInst.resume();
			  })
		}
	}
};
window.Board = Board;  //挂载
})(window);
