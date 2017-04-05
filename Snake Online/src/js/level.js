window.onload = function () {
	var beginBox = document.querySelector(".begin-status-box");
	var begin = document.querySelector(".begin");
	var continueBtn = document.querySelector(".continue");
	var again = document.querySelectorAll(".again");
	var gameoverBox = document.querySelector(".gameover-status-box");
	var winBox = document.querySelector(".win-status-box");
	var passBox = document.querySelector(".pass-status-box");
	var nextBtn = document.querySelector(".next");
	var snake = null; // 保存贪吃蛇实例

	snake = levelInit();
	snake.init();

	// 为开始游戏绑定点击事件
	onEvent(begin, "click", function () {
		hideDiv(beginBox);
		// 绑定键盘事件
		onEvent(document, "keydown", function (e) {
			e = e || window.event;
			if(!snake.timerId) {
				return;
			}

			if(e.keyCode === 37) { // left
				snake.directionQueue.push("left");
			} else if(e.keyCode === 38) { // up
				snake.directionQueue.push("up");
			} else if(e.keyCode === 39) { // right
				snake.directionQueue.push("right");
			} else if(e.keyCode === 40) { // down
				snake.directionQueue.push("down");
			} else if (e.keyCode === 32) { // space
				snake.pause();
			}
		});
		// 开始游戏
		snake.run();
	});

	// 继续游戏
	onEvent(continueBtn, "click", function () {
		snake.continueGame();
	});

	// 继续下一关
	onEvent(nextBtn, "click", function () {
		hideDiv(passBox);
		snake.run();
	});

	// 重新开始
	for(var i = 0; i < again.length; i++) {
		onEvent(again[i], "click", function () {
			snake = levelInit();
			hideDiv(gameoverBox);
			hideDiv(winBox);
			snake.init();
		});
	}
}

/**
 * 添加事件监听
 * @param  DOMelement elem  添加事件监听的元素
 * @param  String     eventType  事件类型
 * @param  Function   listener  回调函数
 */
function onEvent(elem, eventType, listener) {
	elem.addEventListener(eventType, listener, false);
}

/**
 * 移除事件监听
 * @param  DOMelement elem  移除事件监听的元素
 * @param  String     eventType  事件类型
 * @param  Function   listener  回调函数
 */
function unEvent(elem, eventType, listener) {
	elem.removeEventListener(eventType, listener, false);
}

/**
 * 过关模式的初始化
 * @return Object 贪吃蛇实例
 */
function levelInit() {
	var snake = new Snake(8, "#333", 500, 10, 370, 310, function () {
		var dSpeed = 100 * (this.level-1);

		if((500 - dSpeed) > 50) {
			this.speed = 500 - dSpeed;
		} else {
			this.speed = 50;
		}
	});

	return snake;
}

/**
 * 改变canvas的宽高
 * @param  DOMelement  canvas  将被改变的canvas元素
 * @param  Number  width  改变后canvas的宽度
 * @param  Number  height  改变后canvas的高度
 */
function changeCanvas(canvas, width, height) {
	canvas.style.display = "block";
	canvas.width = width;
	canvas.height = height;
	// 居中显示画布
	var halfWidth = width / 2;
	canvas.style.marginLeft = "-" + halfWidth + "px";
}

/**
 * 产生一个值全为0的二维数组
 * @param  Number one 一维长度
 * @param  Number two 二维长度
 * @return Array  返回生成的二维数组
 */
function creat2dArr(one, two) {
	var arr = new Array(one);

	for(var j = 0; j < one; j++) {
		arr[j] = new Array(two);
		for(var k = 0; k < two; k++) {
			arr[j][k] = 0;
		}
	}

	return arr;
}

/**
 * 居中显示div
 * @param  DOMelement div 要居中显示的div
 */
function centerDiv(div) {
	var gameCanvas = document.querySelector("#mycanvas");
	var canvasW = gameCanvas.width;
	var canvasH = gameCanvas.height;

	div.style.width = canvasW + "px";
	div.style.height = canvasH + "px";
	div.style.marginLeft = -(canvasW / 2) + "px";
	div.style.display = "block";
}

/**
 * 隐藏div
 * @param  DOMelement div 要隐藏的div
 */
function hideDiv(div) {
	div.style.display = "none";
}

/**
 * 贪吃蛇构造函数
 * @constructor
 * @param Number bodyLong  蛇身初始长度
 * @param String color  蛇身颜色
 * @param Number speed  蛇爬行的速度
 * @param Number aim  初始通关目标分值
 * @param Number canvasW  canvas的宽度
 * @param Number canvasH  canvas的高度
 * @param Function changeSpeedFn  自定义改变速度的函数
 */
function Snake(bodyLong, color, speed, aim, canvasW, canvasH, changeSpeedFn) {
	this.score = 0; // 分数
	this.life = 1; // 生命
	this.level = 1; // 关卡
	this.isEat = false; // 是否吃到食物标志位
	this._bodyLong = bodyLong; // 保存初始长度
	this.bodyLong = bodyLong; // 蛇身长度
	this.aim = aim; // 通关的目标分值
	this.canvasWidth = canvasW;
	this.canvasHeight = canvasH;
	this.xCount = (canvasW-130)/12; // 地图行数
	this.yCount = (canvasH-10)/12; // 地图列数
	this.color = color; // 蛇身的颜色
	this.speed = speed; // 蛇爬行的速度
	this.timerId = null; // 定时器id
	this.directionQueue = null; // 爬行方向("up": 上，"down": 下，"left": 左，"right": 右)
	this.nextDirection = undefined; // 爬行方向
	this.dx = 0; // 每次爬行x的变化值
	this.dy = 0; // 每次爬行y的变化值
	this.foodX = 0; // 食物的位置x坐标
	this.foodY = 0; // 食物的位置y坐标
	this.position = null; // 位置数组，position[x][y] = 0 为空，position[x][y] = 1 为蛇身，position[x][y] = 2 为食物
	this.bodyArr = null; // 蛇身每一截所在的位置组成的数组
	this.changeSpeed = changeSpeedFn;
}

/**
 * 对数组每一项执行函数fn，不改变原数组
 * @param  Array  arr  要操作的数组
 * @param  Function fn  对数组每项执行的函数
 */
Snake.prototype.each =  function (arr, fn) {
    var len = arr.length;
    var self = this;

    for (var i = 0; i < len; i++) {
        fn.apply(self, new Array(arr[i], i));
    }
};

/**
 * 做一些初始化操作
 */
Snake.prototype.init = function () {
	var canvas = document.getElementById("mycanvas");
	var beginBox = document.querySelector(".begin-status-box");

	changeCanvas(canvas, this.canvasWidth, this.canvasHeight);
	// 重置位置数组
	this.position = creat2dArr(this.xCount, this.yCount);
	// 初始化方向队列
	this.directionQueue = [];
	// 初始化爬行方向为向上
	this.nextDirection = "up";
	this.dx = 0;
	this.dy = -1;
	// 居中显示div
	centerDiv(beginBox);
	// 绘制背景
	this.drawBackground(this.canvasWidth, this.canvasHeight);
	// 初始化蛇的位置
	this.bodyArr = this.initPositionArr(this.bodyLong);
	// 绘制食物
	this.drawFood("#fff", true);
	// 绘制蛇身
	this.drawSnake();
	// 绘制侧边栏
	this.drawSideBar();
}

/**
 * 动画绘制总函数
 */
Snake.prototype.draw = function () {
	var self = this;
	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");

	// 清除画布
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 绘制侧边栏
	self.drawSideBar();
	// 设置下一步方向
	self.setNextDirection();
	// 判断是否发生碰撞
	self.collisionDetection();
	if(self.life === 0) { // 游戏结束
		self.gameover();
		return;
	}
	// 判断是否吃到食物
	self.eatFood(self.bodyArr[0].x+self.dx, self.bodyArr[0].y+self.dy);
	if(self.isEat) {
		self.setBodyArr(true);
		if(self.win()) { // 判断是否赢了
			return;
		} else if(self.passLevel()) { // 判断是否通关
			return;
		}
		self.isEat = false;
		// 重绘食物
		self.drawFood("#fff", true);
	} else {
		self.setBodyArr(false);
		self.drawFood("#fff", false);
	}
	// 绘制蛇身
	self.drawSnake();
	// 改变速度
	self.changeSpeed();
	// 游戏开始运行
	self.run();
};

/**
 * 开始游戏
 */
Snake.prototype.run = function () {
	var self = this;

	self.timerId = setTimeout(self.draw.bind(self), self.speed);
};

/**
 * 暂停游戏
 */
Snake.prototype.pause = function () {
	clearTimeout(this.timerId);
	this.timerId = null;
	centerDiv(document.querySelector(".stop-status-box"));
};

/**
 * 继续游戏
 */
Snake.prototype.continueGame = function () {
	hideDiv(document.querySelector(".stop-status-box"));
	this.run();
};

/**
 * 初始化蛇身每一截所在位置组成的数组
 * @param  Number bodyLong  蛇身初始长度
 * @return Array  bodyArr  位置数组
 */
Snake.prototype.initPositionArr = function (bodyLong) {
	var bodyArr = [];
	var headX = Math.floor(this.xCount / 2);
	var headY = this.yCount - 10;

	bodyLong = (bodyLong > 10 || bodyLong < 5) ? 10 : bodyLong;
	
	for(var i = 0; i < bodyLong; i++) {
		bodyArr.push({
			x: headX,
			y: headY
		});
		this.position[bodyArr[i].x][bodyArr[i].y] = 1;
		headY += 1;
	}

	return bodyArr;
};

/**
 * 绘制食物及组成蛇身的小方块
 * @param  Number x 绘制小方块的x坐标
 * @param  Number y 绘制小方块的y坐标
 * @param  String color 绘制小方块的颜色
 */
Snake.prototype.drawSmallBox = function (x, y, color) {
	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");

	x = x * 12 + 6;
	y = y * 12 + 6;

	ctx.strokeStyle = color;
	roundedRect(ctx, x, y, 10, 10, 2, false);

	ctx.fillStyle = color;
	roundedRect(ctx, x+1, y+1, 8, 8, 2, true);
};

/**
 * 产生随机位置的食物
 * @param String color 绘制的食物的颜色
 * @param Boolean isRepaint 是否需要重绘
 */
Snake.prototype.drawFood = function (color, isRepaint) {
	if(!isRepaint) {
		this.drawSmallBox(this.foodX, this.foodY, color);
		return;
	}

	var x = Math.round(Math.random() * (this.xCount-1));
	var y = Math.round(Math.random() * (this.yCount-1));

	if(this.position[x][y] === 0) {
		this.position[x][y] = 2;
		this.foodX = x;
		this.foodY = y;
		this.drawSmallBox(x, y, color);
	} else {
		this.drawFood(color, isRepaint);
	}
};

/**
 * 绘制蛇
 */
Snake.prototype.drawSnake = function () {
	this.each(this.bodyArr, function (obj, index) {
		this.drawSmallBox(obj.x, obj.y, this.color);
	});
};

/**
 * 设置蛇身体各截的位置
 * @param Boolean isEat 是否吃到食物
 */
Snake.prototype.setBodyArr = function (isEat) {
	var newX = this.bodyArr[0].x+this.dx;
	var newY = this.bodyArr[0].y+this.dy;


	if(!isEat) {
		var temp = this.bodyArr.pop();
		this.position[temp.x][temp.y] = 0;
	} else {
		this.bodyLong++;
	}

	this.bodyArr.unshift({
		x: newX,
		y: newY
	});
	this.position[newX][newY] = 1;
};

/**
 * 判断是否吃到食物
 * @param  Number nextX 下一步爬行到的x坐标
 * @param  Number nextY 下一步爬行到的y坐标
 * @return {[type]}   [description]
 */
Snake.prototype.eatFood = function (nextX, nextY) {
	if(this.position[nextX][nextY] === 2) {
		this.score++;
		this.isEat = true;
		return true;
	}
};

/**
 * 设置下一次爬行的方向
 */
Snake.prototype.setNextDirection = function () {
	if(this.directionQueue.length === 0) { // 如果用户没有输入下一个方向则返回
		return;
	}

	var temp = "";

	while(this.directionQueue.length !== 0) {
		if((temp = this.directionQueue.shift()) !== this.nextDirection) {
			// 判断方向合法性
			if(this.judgeLegality(temp)) {
				this.nextDirection = temp;
				// 设置dx与dy的值
				if(temp === "up") {
					this.dx = 0;
					this.dy = -1;
				} else if(temp === "down") {
					this.dx = 0;
					this.dy = 1;
				} else if(temp === "left") {
					this.dx = -1;
					this.dy = 0;
				} else {
					this.dx = 1;
					this.dy = 0;
				}
				break;
			}
		}
	}
};

/**
 * 判断方向的合法性
 * @param  String direct 被判断的方向值
 * @return Boolean  false表示不合法
 */
Snake.prototype.judgeLegality = function (direct) {
	var first = this.bodyArr[0];
	var next = this.bodyArr[1];
	if(direct === "up") { // 向上时
		if(first.x === next.x && first.y > next.y) {
			return false;
		}
	} else if(direct === "down") { // 向下时
		if(first.x === next.x && first.y < next.y) {
			return false;
		}
	} else if(direct === "left") { // 向左时
		if(first.y === next.y && first.x > next.x) {
			return false;
		}
	} else { // 向右时
		if(first.y === next.y && first.x < next.x) {
			return false;
		}
	}

	return true;
};

/**
 * 碰撞检测
 * @return Boolean 是否发生碰撞
 */
Snake.prototype.collisionDetection = function () {
	var newX = this.bodyArr[0].x+this.dx;
	var newY = this.bodyArr[0].y+this.dy;

	// 跑出边界
	if(newX < 0 || newX === this.xCount || newY < 0 || newY === this.yCount) {
		this.life--;
		return false;
	}

	var flag = false; // 是否咬到自己
	for(var i = 0; i < this.bodyArr.length; i++) {
		if(newX === this.bodyArr[i].x && newY === this.bodyArr[i].y) {
			flag = true;
			break;
		}
	}

	if(flag) {
		this.life--;
		return false;
	}

	return true;
};

/**
 * 绘制背景及颗粒化地图
 * @param  Number width  背景canvas的宽
 * @param  Number height  背景canvas的高
 */
Snake.prototype.drawBackground = function (width, height) {
	var bgCanvas = document.getElementById("bgcanvas");
	var ctx = bgCanvas.getContext("2d");

	changeCanvas(bgCanvas, width, height);

	// 绘制土黄色外边框
	ctx.fillStyle = "#d1b95e";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(width, 0);
	ctx.lineTo(width, height);
	ctx.lineTo(0, height);
	ctx.lineTo(0, 0);
	ctx.closePath();
	ctx.fill();
	ctx.clearRect(4, 4, width-8, height-8);

	// 绘制黑色边框
	ctx.strokeStyle = "#000";
	ctx.strokeRect(4, 4, width-8, height-8);

	// 绘制背景
	ctx.fillStyle = "#b0bc9c";
	ctx.fillRect(5, 5, width-10, height-10);

	// 绘制颗粒化地图
	var xCount = Math.floor(width-130)/12;
	var yCount = Math.floor(height-10)/12;
	var beginX = 6;
	var beginY = 6;

	ctx.fillStyle = "#aab697";
	for(var i = yCount; i > 0; i--) {
		var copyX = beginX;
		for(var j = xCount; j > 0; j--) {
			roundedRect(ctx, copyX, beginY, 10, 10, 2, true);
			copyX += 12;
		}
		beginY += 12;
	}
};

/**
 * 绘制侧边栏
 */
Snake.prototype.drawSideBar = function () {
	var self = this;
	var width = self.canvasWidth;
	var height = self.canvasHeight;
	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#000";
	roundedRect(ctx, width-117, 10, 105, height-20, 5, false);
	self.drawText();
};

/**
 * 绘制分数及生命值
 */
Snake.prototype.drawText = function() {
	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");
	var self = this;
	var width = self.canvasWidth;
	var height = self.canvasHeight;

	ctx.clearRect(this.canvasWidth-116, 30, 102, 160);

	ctx.font = "Bold 20px Arial"; 
	ctx.textAlign = "left";
	ctx.fillStyle = "#000"; 
	// 设置字体内容，以及在画布上的位置
	ctx.strokeText("score: "+self.score, width-111, 50);
	ctx.strokeText("aim: "+self.aim, width-111, 90);
	ctx.strokeText("life:   x"+self.life, width-111, 130);
	ctx.strokeText("level: "+self.level, width-111, 170);
}

/**
 * 游戏结束
 */
Snake.prototype.gameover = function () {
	centerDiv(document.querySelector(".gameover-status-box"));
	clearTimeout(this.timerId);
	this.timerId = null;
	this.drawText();
};

/**
 * 通过关卡
 * @return Boolean 是否通关
 */
Snake.prototype.passLevel = function () {
	if(this.score === this.aim) {
		clearTimeout(this.timerId);
		this.timerId = null;
		document.querySelector(".level").innerHTML = " " + this.level + " ";
		this.level++;
		this.aim += 10;
		this.reset();
		centerDiv(document.querySelector(".pass-status-box"));
		return true;
	}

	return false;
};

/**
 * 重置
 */
Snake.prototype.reset = function () {
	// 重置分数
	this.score = 0;
	// 重置蛇身长度
	this.bodyLong = this._bodyLong;
	// 重置位置数组
	this.position = creat2dArr(this.xCount, this.yCount);
	// 初始化方向队列
	this.directionQueue = [];
	// 初始化爬行方向为向上
	this.nextDirection = "up";
	this.dx = 0;
	this.dy = -1;
	// 重置食物标志位
	this.isEat = false;
	// 绘制背景
	this.drawBackground(this.canvasWidth, this.canvasHeight);
	// 初始化蛇的位置
	this.bodyArr = this.initPositionArr(this.bodyLong);
	// 绘制食物
	this.drawFood("#fff", true);
	// 绘制蛇身
	this.drawSnake();
	// 绘制侧边栏
	this.drawSideBar();
};

/**
 * 通过全部关卡
 * @return Boolean 是否全部通关
 */
Snake.prototype.win = function () {
	if(this.score === this.aim && this.speed === 50) {
		clearTimeout(this.timerId);
		this.timerId = null;
		centerDiv(document.querySelector(".win-status-box"));
		return true;
	}

	return false;
};

/**
 * 绘制圆角矩形
 * @param  {[type]} ctx  canvas的"2d"上下文
 * @param  Number  x  起始x
 * @param  Number  y  起始y
 * @param  Number  width  矩形宽度
 * @param  Number  height  矩形高度
 * @param  Number  radius  圆角半径
 * @param  Boolean  isFill  是否填充标志位
 */
function roundedRect(ctx, x, y, width, height, radius, isFill) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
	ctx.lineTo(x + width - radius, y + height);
	ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	ctx.lineTo(x + width, y + radius);
	ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
	ctx.lineTo(x + radius, y);
	ctx.quadraticCurveTo(x, y, x, y + radius);
	if(isFill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}
