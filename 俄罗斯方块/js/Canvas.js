(function(window){
  'use strict';
  /**
    *@param canvasId Canvas元素的ID属性
    *@param width canvas 宽度
    *@param height canvas 高度
    */
    function Canvas(canvasId,width,height){     //实例化canvas对象
      this.canvasId = canvasId;
      this.el = document.getElementById(canvasId);
    
      if(!this.el){
        throw new Error("Must provider a right canvas id");
      }
      this.context = this.el.getContext('2d');  //获取该canvas的2D绘图环境对象
      this.width = width || window.innerWidth;
      this.height = height || window.innerHeight;
      this._init();    //下划线表明是私有方法
    }
    Canvas.prototype = {     //constructor 属性返回对创建此对象的数组函数的引用
      constructor : Canvas,   //指向canvas函数  
      _init :function(){
        this.el.width = this.width;    //this.el.width  style里面属性,防止拉伸压缩
        this.el.height = this.height;
      },
      clear:function(fromX,fromY,toX,toY){    //清空整个画布
        fromX = fromX ||0;  //没有赋值话取0
        fromY = fromY ||0;
        toX = toX ||this.width;
        toY = toY || this.height;
        this.context.clearRect(fromX,fromY,toX,toY);  //开始xy,到终点xy
      },
      drawText:function(text,x,y){      //绘制文本
        this.clear(0,0);
        this.context.font = '25px Arial';
        this.context.fillStyle = '#CE670D';
        this.context.textAlign = 'center';
        this.context.fillText(text,x===undefined?(this.width/2):x,y===undefined?35:y);
      }
    };

    window.Canvas = Canvas;
})(window);

	