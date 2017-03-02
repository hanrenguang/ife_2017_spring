window.onload = function () {
	var chanceBox = document.querySelector(".level-chance");
	var myCanvas = document.getElementById("mycanvas");

	// 给模式选择绑定点击事件
	delegate(chanceBox, "a", "click", function () {
		var self = this;

		chanceBox.style.display = "none";

		switch(self.className) {
			case "normal-mode": // 普通模式
				normalInit(myCanvas);
				break;
			case "level-mode": // 过关模式
				levelInit(myCanvas);
				break;
			case "dodge-mode": // 躲避模式
				dodgeInit(myCanvas);
				break;
		}
	});
}


/**
 * 事件代理（对每个elem下的tag元素调用listener函数）
 * @param  DOMelement elem  绑定事件的元素
 * @param  String     tag   事件发生时触发回调的html标签
 * @param  String     eventType 事件类型
 * @param  Function   listener 回调函数
 */
function delegate(elem, tag, eventType, listener) {
	onEvent(elem, eventType, function(e) {
		e = e || window.event;
		var target = e.srcElement ? e.srcElement : e.target;

		if (!tag || tag === target.nodeName.toLowerCase()) {
			listener.call(target);
		}
	});
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
 * 普通模式的初始化
 * @param  DOMelement canvas 游戏画布元素
 */
function normalInit(canvas) {
	var snake = new Snake(10, "#000", 500);
	snake.canvasWidth = 490;
	snake.canvasHeight = 370;
	changeCanvas(canvas, snake.canvasWidth, snake.canvasHeight);
	snake.drawBackground(snake.canvasWidth, snake.canvasHeight);
	snake.drawSideBar();
	//snake.draw();
}

/**
 * 过关模式的初始化
 * @param  DOMelement canvas 游戏画布元素
 */
function levelInit(canvas) {

}

/**
 * 躲避模式的初始化
 * @param  DOMelement canvas 游戏画布元素
 */
function dodgeInit(canvas) {

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
 * 贪吃蛇构造函数
 * @param Number bodyLong  蛇身初始长度
 * @param String color  蛇身颜色
 * @param Number speed  蛇爬行的速度
 */
function Snake(bodyLong, color, speed) {
	this.score = 0; // 分数
	this.live = 1; // 生命
	this.bodyArr = this.initPositionArr(bodyLong); // 蛇身每一截所在的位置组成的数组
	this.color = color; // 蛇身的颜色
	this.speed = speed; // 蛇爬行的速度
	this.timerId = null; // 定时器id
	this.canvasWidth = 0;
	this.canvasHeight = 0;
}

/**
 * 动画启动函数
 */
Snake.prototype.draw = function () {

};

/**
 * 初始化蛇身每一截所在位置组成的数组
 * @param  Number bodyLong  蛇身初始长度
 * @return Array  bodyArr  位置数组
 */
Snake.prototype.initPositionArr = function (bodyLong) {
	
};

/**
 * 绘制食物及组成蛇身的小方块
 * @param  Number x 绘制小方块的x坐标
 * @param  Number y 绘制小方块的y坐标
 */
Snake.prototype.drawSmallBox = function (x, y) {
	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#000";
	roundedRect(ctx, x, y, 10, 10, 2, false);

	ctx.fillStyle = "#000";
	roundedRect(ctx, x+1, y+1, 8, 8, 2, true);
};

/**
 * 产生随机位置的食物
 */
Snake.prototype.drawFood = function () {

};

/**
 * 绘制蛇
 */
Snake.prototype.drawSnake = function () {

};

/**
 * 碰撞检测
 * @return Boolean 是否发生碰撞
 */
Snake.prototype.collisionDetection = function () {

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
	for(var i = xCount; i > 0; i--) {
		var copyX = beginX;
		for(var j = yCount; j > 0; j--) {
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

	ctx.clearRect(this.canvasWidth-116, 30, 102, 80);
	// 设置字体
	ctx.font = "Bold 20px Arial"; 
	// 设置对齐方式
	ctx.textAlign = "left";
	// 设置填充颜色
	ctx.fillStyle = "#000"; 
	// 设置字体内容，以及在画布上的位置
	ctx.strokeText("score: "+self.score, width-111, 50); 
	// 绘制空心字
	ctx.strokeText("life:   x"+self.live, width-111, 90);
}


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
