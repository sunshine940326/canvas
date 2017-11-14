/* 
 * background.js - simple abstract background generator
 *
 * Changes:
 *  21-Jan-2016
 *   > Cap frames to 10 on mobile to prevent scroll lag
 *  20-Jan-2016
 *   + Added more versatile mobile options
 *   > Using tabs and 80 width
 *   > Settings object instead of lotsa variables
 *   > Bokeh jitter now assumes inverted min/max, added x/y options instead
 *   - Removed previous change of rounding values, for better looks
 *   - Removed gradient jitter, not useful
 *  6-Jan-2016
 *   > Stored PI * 2 in var for better framerate on mobile
 *   > Drawing circles to off-screen canvas only once, reducing .arc() ops
 *   + Added mobile detection
 *   + In-depth mobile+debug options
 *
 * @author  pbondoer - http://bondoer.fr/
 * @license CC0 - https://creativecommons.org/publicdomain/zero/1.0/
 */

window.addEventListener("load", function() {
	var ctx = document.getElementById('background').getContext('2d');
	//gradient
	var options =
	{
		resolution: 1,
		gradient:
		{
			resolution: 4,
			smallRadius: 0,
			hue:
			{
				min: 0,
				max: 360
			},
			saturation:
			{
				min: 40,
				max: 80
			},
			lightness:
			{
				min: 25,
				max: 35
			}
		},
		bokeh:
		{
			count: 30,
			size:
			{
				min: 0.1,
				max: 0.3
			},
			alpha:
			{
				min: 0.05,
				max: 0.4
			},
			jitter:
			{
				x: 0.3,
				y: 0.3
			}
		},
		speed:
		{
			min: 0.0001,
			max: 0.001
		},
		debug:
		{
			strokeBokeh: false,
			showFps: false
		}
	};
	var mobile =
	{
		force: false,
		resolution: 0.5,
		bokeh:
		{
			count: 6
		}
	};
	//buffers
	var gradientBuffer = document.createElement('canvas').getContext('2d');
	var circleBuffer = document.createElement('canvas').getContext('2d');
	//render time, fps calculations, debug
	var time;
	var targetFps = 60; //not actual fps, but updates per second
	var curFps = 0;
	var cntFps = 0;
	var fps = 0;
	var w = 0;
	var h = 0;
	var scale = 0;
	//constants for faster calcs
	var pi2 = Math.PI * 2;
	//util functions
	function lerp(a, b, step) {
		return step * (b - a) + a;
	}
	function clamp(a) {
		if (a < 0) return 0;
		if (a > 1) return 1;
		return a;
	}
	function rand(obj) {
		return Math.random() * (obj.max - obj.min) + obj.min;
	}
	function newColor() {
		return new Color(
				rand(options.gradient.hue),
				rand(options.gradient.saturation),
				rand(options.gradient.lightness)
				);
	}

	function isMobile() { 
		return (
				mobile.force
				|| navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
			   );
	}

	window.requestAnimFrame = (function(callback) {
		if (isMobile())
			return function(callback) {
				window.setTimeout(callback, 1000 / 10);
			};
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	//classes
	function Color(h, s, l) {
		this.h = h;
		this.s = s;
		this.l = l;

		this.str = function() {
			return this.h + ", " + this.s + "%, " + this.l +"%";
		}
	}
	function ColorPoint(x, y, color) {
		this.x = x;
		this.y = y;
		this.oldColor = color;
		this.newColor = color;
		this.step = 0;
		this.speed = 0;

		this.color = function() {
			return new Color(lerp(this.oldColor.h, this.newColor.h, this.step),
					lerp(this.oldColor.s, this.newColor.s, this.step),
					lerp(this.oldColor.l, this.newColor.l, this.step));
		}

	}
	var colorPoints = [
		new ColorPoint(0, 0, new Color(196, 59, 34)),
		new ColorPoint(0, 1, new Color(269, 79, 32)),
		new ColorPoint(1, 0, new Color(30, 42, 33)),
		new ColorPoint(1, 1, new Color(304, 47, 27))
	];

	function BokehCircle(x, y, size, alpha) {
		this.oldX = x;
		this.oldY = y;
		this.oldSize = size;
		this.oldAlpha = alpha;
		this.newX = 0;
		this.newY = 0;
		this.newAlpha = 0;
		this.newSize = 0;
		this.step = 0;
		this.speed = 0;

		this.x = function() {
			return lerp(this.oldX, this.newX, this.step);
		}
		this.y = function() {
			return lerp(this.oldY, this.newY, this.step);
		}
		this.alpha = function() {
			return lerp(this.oldAlpha, this.newAlpha, this.step);
		}
		this.size = function() {
			return lerp(this.oldSize, this.newSize, this.step);
		}
	}
	var circles = [];

	function setJitter(circle) {
		circle.newX = clamp(circle.oldX + rand({
			min: -options.bokeh.jitter.x,
			max: options.bokeh.jitter.x
		}));
		circle.newY = clamp(circle.oldY + rand({
			min: -options.bokeh.jitter.y,
			max: options.bokeh.jitter.y
		}));
	}
	function resize() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		w = width * options.resolution;
		h = height * options.resolution;
		scale = Math.sqrt(w * h);

		//actual canvas
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		ctx.scale(1 / options.resolution, 1 / options.resolution);

		//circle canvas
		var circleSize = options.bokeh.size.max * scale;
		circleBuffer.canvas.width = circleSize * 2 + 1;
		circleBuffer.canvas.height = circleSize * 2 + 1;

		circleBuffer.fillStyle = "rgb(255, 255, 255)";
		circleBuffer.beginPath();
		circleBuffer.arc(circleSize, circleSize, circleSize, 0, pi2);
		circleBuffer.closePath();
		circleBuffer.fill();

		//force render on mobile
		if (isMobile())
			render();
	}
	function softCopy(src, dest)
	{
		var i = 0;

		for (var property in src)
		{
			if (dest.hasOwnProperty(property))
				if (softCopy(src[property], dest[property]) == 0)
					dest[property] = src[property];
			i++;
		}
		return i;
	}
	function init() {
		gradientBuffer.canvas.height = options.gradient.resolution;
		gradientBuffer.canvas.width = options.gradient.resolution;

		if (isMobile())
			softCopy(mobile, options);

		resize();

		colorPoints.forEach(function(point) {
			point.oldColor = newColor();
			point.newColor = newColor()
				point.speed = rand(options.speed);
		});

		for(i = 0; i < options.bokeh.count; i++) {
			circles.push(new BokehCircle(Math.random(), Math.random(),
						rand(options.bokeh.size), rand(options.bokeh.alpha)));
			circles[i].newAlpha = rand(options.bokeh.alpha);
			circles[i].newSize = rand(options.bokeh.size);
			circles[i].speed = rand(options.speed);
			setJitter(circles[i]);
		}
	}
	function iterate() {
		var now = Date.now();
		curFps += (now - (time || now));
		cntFps++;
		var delta = (now - (time || now)) / (1000 / targetFps);
		time = now;

		if(curFps > 1000) {
			fps = 1000 / (curFps / cntFps);
			curFps -= 1000;
			cntFps = 0;
		}

		colorPoints.forEach(function(point) {
			point.step += point.speed * delta;

			if (point.step >= 1) {
				point.step = 0;

				point.oldColor = point.newColor;

				point.newColor = newColor();
				point.speed = rand(options.speed);
			}
		});

		circles.forEach(function(circle) {
			circle.step += circle.speed * delta;
			if(circle.step >= 1) {
				circle.step = 0;

				circle.oldX = circle.newX;
				circle.oldY = circle.newY;
				circle.oldAlpha = circle.newAlpha;
				circle.oldSize = circle.newSize;

				setJitter(circle);
				circle.newAlpha = rand(options.bokeh.alpha);
				circle.newSize = rand(options.bokeh.size);
				circle.speed = rand(options.speed);
			}
		});
	}

	function render() {
		iterate();

		//draw point gradient to buffer
		colorPoints.forEach(function(point) {
			var x = point.x * options.gradient.resolution;
			var y = point.y * options.gradient.resolution;
			var grad = gradientBuffer.createRadialGradient(x, y,
					options.gradient.smallRadius, x, y,
					options.gradient.resolution);
			grad.addColorStop(0, 'hsla(' + point.color().str() + ', 255)');
			grad.addColorStop(1, 'hsla(' + point.color().str() + ', 0)');

			gradientBuffer.fillStyle = grad;
			gradientBuffer.fillRect(0, 0,
					options.gradient.resolution, options.gradient.resolution);
		});

		//draw gradient from memory
		ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(gradientBuffer.canvas, 0, 0, w, h);

		//draw bokeh
		ctx.globalCompositeOperation = "overlay";
		if (options.debug.strokeBokeh)
			ctx.strokeStyle = "yellow";

		circles.forEach(function(circle) {
			var size = circle.size() * scale;

			ctx.globalAlpha = circle.alpha();
			ctx.drawImage(circleBuffer.canvas,
					circle.x() * w - size / 2, circle.y() * h - size / 2,
					size, size);

			if(options.debug.strokeBokeh) {
				ctx.globalAlpha = 1;
				ctx.globalCompositeOperation = "source-over";
				ctx.strokeRect(circle.x() * w - size / 2,
						circle.y() * h - size / 2, size, size);
				ctx.globalCompositeOperation = "overlay";
			}
		});
		ctx.globalAlpha = 1;

		//debug info
		if (options.debug.showFps) {
			if(fps <= 10) ctx.fillStyle = 'red';
			else ctx.fillStyle = 'yellow';

			ctx.font = "20px sans-serif";
			ctx.fillText(Math.round(fps) + " fps", 10, 20);
		}

		//done rendering, wait for frame
		window.requestAnimFrame(render);
	}

	//does not seem to impact performance
	window.addEventListener("resize", resize);

	//init and render :)
	init();
	render();
});
