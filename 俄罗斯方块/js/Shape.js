(function(window){
	'use strict';

	var shapebLayouts =[		//
			[[0,1,0],[1,1,1]],
			[[1,1,1,1]],
			[[1,1],[1,1]],
			[[0,1],[1,1],[1,0]],
			[[1,0],[1,1],[0,1]],
			[[1,0,1],[1,1,1]],
			[[0,1],[1,1]],
			[[1,1]],
			[[1,1],[1,0],[1,0]],
			[[1,1],[0,1],[0,1]]
		];
	var random= function(minValue,maxValue){		//产生随机数
			return minValue +Math.floor(Math.random()*maxValue);  //参数随机数，包含0，不包含1
		};
	var styleCount = 7;  //七种颜色
	function Shape(){
		this.x=0;   //开始处在左上角
		this.y=0;
		this.blockType = random(1,styleCount); //颜色随机  +1解决消失
		// console.log(this.Blocktype);
		this.block = new Block(this.blockType);   //第几个方块,也就是变换颜色

			
		this.layout = shapebLayouts[random(0,shapebLayouts.length)];  //多种方块形状
		/*  layout简化
		this.layouts = {
			1:[[0,1,0],[1,1,1]],
			2:[[1,0],[1,1],[1,0]],
			3:[[1,1,1],[0,1,0]],
			4:[[0,1],[1,1],[0,1]]
		}
		this.layout = this.layouts[2];  //对象另一种取值方式
		*/
		/*this.layout = [
			[0,1,0],    //1代表有
			[1,1,1]
		];*/
		// this.layout = [[0,1,0],[1,1,1]];   开始的例子，先产生一个形状
	};
	Shape.prototype={
		constructor:Shape,
		draw:function(context,size){      //增加参数，控制右上角下一个方块大小
			for(var i=0;i<this.layout.length;i++){
				for(var j=0;j<this.layout[i].length;j++){
					if(this.layout[i][j]){
						this.block.draw(context,j+this.x,i+this.y,undefined,size);  //????  
						 //控制右上角下一个方块新增参数
					}
				}
			}
		},
		
		rotate:function(){   //实现翻转
			var newLayout = [];
			for(var y =0;y<this.layout[0].length;y++){
				newLayout[y] = [];
				for(var x =0;x<this.layout.length;x++){
					newLayout[y][x] = this.layout[this.layout.length-1-x][y];  //翻转既有1又有0
					/*if(this.layout.[length-1-x][y])
					newLayout[y][x] =1;*/
				}
			}
			this.layout = newLayout;

			this._setLayout();

		},
		_setLayout: function(){		//防止翻转越界

			if(this.x<0){
				this.x =0;
			}
			if(this.y<0){
				this.y=0
			}
			if (this.x + this.layout[0].length > TetrisConfig.cols) {
		        this.x = TetrisConfig.cols - this.layout[0].length;
		      }
	        if (this.y + this.layout.length > TetrisConfig.rows) {
	          this.y = TetrisConfig.rows - this.layout.length;
	        }
	        
		},
		_getMaxCols:function(){
			var max = 0;
			for(var y = 0;y<this.layout.length;y++){
				max = Math.max(max,this.layout[y].length);
			}
			return max;
		},
		_getMaxRows:function(){       //拿到最大rows
			return this.layout.length;
		},
		setPosition:function(cols,rows,ignoreRows){   //右上角方块定位
			this.x = Math.floor((cols-this._getMaxCols())/2);
			if(!ignoreRows){
				this.y = Math.floor((rows-this._getMaxRows())/2);
			}
		}
		
	};
	window.Shape=Shape;
})(window);