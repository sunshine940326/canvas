	/*完整资源加载*/

(function(window){
	'use strict';

	var cacheMap = new Map();  //用于存储资源map对象
	var resourceTotalCount =1; //资源总数量
	var currentLoaded = 0;   	//当前加载资源总量

	var isAddLoaded = function(){   //回调函数，加载成功后
		currentLoaded +=1; 
		/*a++：a先创建自身的一个副本，然后a自增1，最后返回副本的值
		a+=1: 事实上相当于++a
		a=a+1: 虽然有点雷同于a+=1，但不同的是此时右值的a和1做相加操作，形成一个副本然后赋值给a，所以有额外操作
		++a:将a自增1并返回a*/ 
		if(currentLoaded === resourceTotalCount && typeof window.ResourceManager.onResourceLoaded ==='function') {
			window.ResourceManager.onResourceLoaded();
		}
	}

	var init = function(){
		var image = new Image();  //创建image对象
		image.onload = function(){
			cacheMap.set('blocks',image);
			isAddLoaded();
		};
		image.src = 'images/blocks.png';  //指定图片路径？？？

	};

	var getResource = function(key){   //通过key获取资源
		return cacheMap.get(key);
	};

	window.ResourceManager = {
		getResource:getResource,
		init:init,
		onResourceLoaded:null		//资源加载完成回调
	}

})(window);