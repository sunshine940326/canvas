//Edacious-Snake.js
/**************************************
 * This game has 5 periods,
 * init, directionChange, rendering, getScore, over
 * each period will release a specific event
 * at each period you can develop your
 * own addons.
 * Good Luck!
 * L.M.G(Ckouder) 2016/9/20
 **************************************/
var Game = (()=> {
	"use strict";
	var ctx, xCount, yCount, d, t, ccPos, cw, ch, preCode
		, highScore = window.localStorage["highScore"] || 0
		, wel = true;

	var defaults = {
		snakeColor: "red",
		foodColor: "blue",
		difficulty: "easy"
	}
	/***************************************************
	 *Dead
	 *	- this function draw the dead scene of the game
	 ***************************************************/
	function dead() {
		ctx.clearRect(0, 0, cw, ch);
		ctx.fillStyle = "white";
		ctx.font = ch*2/15 + "px Lucida Console";
		ctx.fillText("You are Dead!", cw/6, ch/2, cw*2/3);
		ctx.font = ch*1/25 + "px Lucida Console";
		ctx.fillStyle = "#ccc";
		ctx.fillText("History High Score:" + highScore, cw*6.5/20, ch*5/8, cw*2/5);
		ctx.fillText("Press \"Enter\" to Restart", cw*3/10, 11*ch/15, cw*2/5);
	}
	/***************************************************
	 * directionChange(e)
	 * - e: the keyboardEvent
	 *	this function start the game and determine whether
	 * the user interaction is legal
	 ***************************************************/
	function directionChange(e) {
		e.preventDefault();
		var code = e.keyCode || e.which,
			difficulty = difficultySetting(defaults.difficulty),
			deter = code == 37
			|| code == 38
			|| code == 39
			|| code == 40;
		if (!deter) return;
			if (ccPos) {
			clearTimeout(t);
			clearTimeout(ccPos);
		};
		addons.publish("Dir-change", code);
		if (Math.abs(preCode - code) == 2) {
			code = preCode;
		};
		ccPos = setTimeout(function func() {
			var f = food.pos,
				s = snake.pos;
			t = setTimeout(func, difficulty);
			ctx.clearRect(0, 0, cw, ch);
			addons.publish("Game-rendering", {
				f: f,
				s: s,
				code: code
			});
		}, 50);
	}
	/***************************************************
	 *drawCircle(x, y, d, fillColor)
	 *	- x: the x coordinate of circle
	 *	- y: the y coordinate of circle
	 * 	- d: the diameter of the circle
	 *	- fillColor: color filled the circle
	 *	 this function draw the elements in the snake body
	 * and the food
	 ***************************************************/
	function drawCircle(x, y, d, fillColor) {
		ctx.beginPath();
		ctx.arc(x + 0.5*d, y + 0.5*d, 0.5*d, 0, 2*Math.PI);
		ctx.fillStyle = fillColor;
		ctx.fill();
	}
	/***************************************************
	 *init(el, width, height, colorA, colorB)
	 *	- el: DOM element of canvas
	 *	- width: the width of the canvas
	 *	- height: the height of the canvas
	 *	- colorA: color of the snake
	 *	- colorB: color of the food
	 *	this function add the "keyup" eventlistener in the
	 * DOM and init the food & snake. Init means  to decide
	 * the initial food position and the snake position.
	 * NOT DRAWING SNAKE & FOOD ON THE CANVAS
	 *
	 ***************************************************/
	function difficultySetting(string) {
		switch (string) {
			case "easy":
				return 150;
				break;
			case "hard":
				return 70;
				break;
			case "hell":
				return 50;
				break;
			default: case "normal":
				return 100;
				break;
		}
	}
	function init(el, width, height, difficulty, colorA, colorB) {
		var canvas = document.getElementById(el);
		defaults.difficulty = difficulty || defaults.difficulty;
		cw = width || 500;
		ch = height || 500;
		ctx = canvas.getContext('2d');
		d = Math.floor(ch / 20);
		xCount = Math.floor(cw / d);
		yCount = Math.floor(ch / d);
		canvas.width = xCount*d;
		canvas.height = yCount*d;
		snake.color = colorA || defaults.snakeColor;
		food.color = colorB || defaults.foodColor;
		food.score = 0;
		document.removeEventListener("keyup", reStart);
		document.addEventListener("keyup", directionChange);
		addons.publish("Game-init", {
			d: d,
			ctx: ctx,
			xCount: xCount,
			yCount: yCount
		});
	}
	/***************************************************
	 *over()
	 * 	this game end the game and lead the users to the
	 * dead page
	 ***************************************************/
	function over() {
		wel = false;
		document.removeEventListener("keyup", directionChange);
		clearTimeout(t);
		clearTimeout(ccPos);
		ctx.clearRect(0, 0, cw, ch);
		addons.publish("Game-over");
		document.addEventListener("keyup", reStart);
	}
	/***************************************************
	 * render()
	 * this function draw the food and the snake on the
	 * canvas
	 ***************************************************/
	function render(arr) {
		if (typeof arr[0] == "number") {
   	    	var _x = arr[0] * d,
    	 	 	_y = arr[1] * d;
 	  		drawCircle(_x, _y, d, food.color);
       		//console.log("Render food Successed");
   		} else if (typeof arr[0] == "object") {
   			arr.forEach((pos) => {
				var _x = pos[0] * d,
					_y = pos[1] * d;
				drawCircle(_x, _y, d, snake.color);
   			});
       	//console.log("Render Snake Successed");
		} else {
			console.error("You enter a wrong arr!");
		}
	}
	/***************************************************
	 * random(range) => m(number)
	 * - range: the range which a random number fall in
	 * this function return a random number with specific
	 * range
	 ****************************************************/
	function random(range) {
		var m = Math.floor(Math.random() * range);
		return m;
	}
	/***************************************************
	 * reStart(e)
	 * - e: the keyboardEvent
	 * 	this function listen the Enter Key press and init
	 * the game again
	 ***************************************************/
	function reStart(e) {
		if (e.keyCode == 13) {
			init("canvas", cw, ch, defaults.difficulty, defaults.snakeColor, defaults.foodColor);
			addons.publish("Game-init");
		}
	}
	/***************************************************
	 * score()
	 * this function calculate the score gained by the user
	 ***************************************************/
	function score() {
		var score = "Score:" + food.score;
		ctx.fillStyle = "#ccc";
		ctx.font = "20px Lucida Console";
		ctx.fillText(score, d, d);
	}
	/***************************************************
	 * welcome()
	 *	this function draw the welcome page of the game
	 ***************************************************/
	function welcome() {
		ctx.clearRect(0, 0, cw, ch);
		ctx.fillStyle = "white";
		ctx.font = ch*2/15 + "px Lucida Console";
		ctx.fillText("Retro Snaker", cw/6, ch/2, cw*2/3);
		ctx.font = ch*1/25 + "px Lucida Console";
		ctx.fillText("Press \"↑ ↓ ← →\" to Start", cw*3/10, 11*ch/15, cw*2/5);
	}
	/***************************************************
	 * this function is from the internet
	 * addons:
	 * -> publish(event, info)
	 * -> subscrible(event, listener)
	 *		-> remove();
	 *
	 * event:
	 *  - init: Game-init -> object:
	 *		d(number): the diameter of each ball,
	 *		xCount(number): number of balls each row can hold
	 *		yCount(number): number of balls each col can hold
	 *  - directionChange: Dir-change -> code(number)
	 *  - rendering: Game-rendering -> object:
	 *		f: 2D array of food positions
	 *			[0]: x-coordinate
	 *			[1]: y-coordinate
	 *		s: array of food position
	 *		code: Arrow key hit by users
	 *	- getScore: Get-score -> score(number)
	 *  - over: Game-over ->undefined
	 ***************************************************/
	var addons = (function() {
		var topics = {};
		var hOP = topics.hasOwnProperty;

		return {
			subscrible: (topic, listener) => {
				if (!hOP.call(topics, topic)) topics[topic] = [];

				var index = topics[topic].push(listener) - 1;

				return {
					remove: function(index) {
						delete topics[topic][index];
					}
				};
			},
			publish: (topic, info) => {
				if (!hOP.call(topics, topic)) return;
				topics[topic].forEach(function(item) {
					item(info != undefined? info: {});
				})
			}
		}
	})();
	/***************************************************
	 * food:
	 * - pos(array): the positions of the food
	 * - init(function): init the food
	 * - initCheck: check whether the food was initialized
	 * inside the snake's body and reinitialized it
	 * - collideCheck(function): check whether the snake
	 * hit the food
	 ***************************************************/
	var food = {
		pos: [],
		score: 0,
		init: function() {
			var pos = this.pos;
			pos[0] = random(xCount);
			pos[1] = random(yCount);
			this.initCheck(pos, snake.pos);
			console.log("Init Food Successed!");
		},
		initCheck: function(arr, arr2){
			if (arr2 == undefined) return;
			for (let el of arr2) {
				if (arr[0] == el[0] && arr[1] == el[1]) {
					console.info("Prevent success!");
					this.init();
				}
			};
		},
		collideCheck: function(arrFood, arrSnake) {
			var _head = arrSnake[arrSnake.length - 1];
			if (_head[0] == arrFood[0] && _head[1] == arrFood[1]) {
				this.score += 1;
				addons.publish("Get-score", this.score);
				highScore = (highScore > this.score)? highScore: this.score;
				window.localStorage["highScore"] = highScore;
				food.init();
				arrSnake.unshift(arrFood);
			};
		}
	};
	/***************************************************
	 * snake()
	 * - pos(array): the coordiantes of each snake body
	 * - initLength(number): the initial length of the snake
	 * - init(function): init the snake
	 * - move(function) -> this.length:
	 * check the user interaction and move the snake
	 * - collideCheck(function): check whether the snake hits
	 * itself or the wall and end the game
	 ***************************************************/
	var snake = {
		pos: [],
		initLength: 4,
		init: function() {
			var pos = [],
				initLength = this.initLength;
			pos[0] = [];
			pos[0][0] = random(xCount - 1.2*initLength);
			pos[0][1] = random(yCount - 1.2*initLength);
			for (var i = pos.length; i < initLength; i++) {
				pos[i] = [];
				pos[i][0] = pos[i-1][0] + 1;
				pos[i][1] = pos[i-1][1];
			}
			preCode = 39;
			this.pos = pos;
			console.log("Init Snake success!");
		},
		move: function(code) {
			var pos = this.pos,
				_head = pos[pos.length - 1], _x, _y;
			switch (code) {
				case 37:
					_x = _head[0] - 1;
					pos.push([_x, _head[1]]);
					break;
				case 38:
					_y = _head[1] - 1;
					pos.push([_head[0], _y]);
					break;
				case 39:
					_x = _head[0] + 1;
					pos.push([_x, _head[1]]);
					break;
				case 40:
					_y = _head[1] + 1;
					pos.push([_head[0], _y]);
					break;
			}
			preCode = code;
			pos.shift();
			return pos;
		},
		collideCheck: function(head, arr) {
			var limit = head[0] < 0
				|| head[0] >= xCount
				|| head[1] < 0
				|| head[1] >= yCount;
			if (limit) {
				over();
				return;
			}
			for (let body of arr) {
				if (arr.indexOf(body) != arr.length - 1) {
					if (body[0] == head[0] && body[1] == head[1]) {
						over();
						return;
					}
				}
			}
		}
	};
	addons.subscrible("Game-rendering", function(obj) {
		var f = obj.f,
			s = obj.s,
			code = obj.code;
		render(f);
		render(snake.move(code));
		food.collideCheck(f, s);
		snake.collideCheck(s[s.length - 1], s);
		score();
	});
	addons.subscrible("Game-init", function() {
		if (wel) {
			welcome();
		}
		snake.init();
		food.init();
	});
	addons.subscrible("Game-over", dead);
	/* the only API the game use :> */
	return {
		init: init,
		addons: addons.subscrible
	};
})();
