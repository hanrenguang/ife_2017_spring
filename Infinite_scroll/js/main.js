window.onload = function () {
	var loading = document.querySelector(".loading-wrapper");
	// 是否加载中标志位
	var isLoading = false;

	wheel(document, function () {
		if(event.delta < 0) { // 向下滚动
			mainFn();
		}
	});

	// 滚轮向下滚动时执行的函数
	function mainFn() {
		var screenH = document.documentElement.clientHeight;
		var elemOffsetH = getPosition(loading) - 65;

		console.log(screenH);
		console.log(elemOffsetH);
		if(screenH >= elemOffsetH && !isLoading) {
			isLoading = true;
			setTimeout(loadingItem, 1000);
		}
	}

	// 懒加载
	function loadingItem() {
		var getNumReg = /^item(\d+)$/;
		var parentN = document.querySelector(".item-wrapper");
		var items = document.querySelectorAll(".item");
		var lastItemNum = parseInt(getNumReg.exec(items[items.length-1].innerHTML)[1], 10);
		var fragment = document.createDocumentFragment();

		for(var i = lastItemNum; i < lastItemNum + 20; i++) {
			var li = document.createElement("li");
			li.className = "item";
			li.innerHTML = "item" + (i + 1);
			fragment.appendChild(li);
		}

		parentN.appendChild(fragment);
		isLoading = false;
	}
};

// 获取元素相对浏览器窗口的高度
function getPosition(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	// 叠加元素本身及其各个上级父元素的偏移
	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	// 获取滚动条高度和宽度
	var elementScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

	return actualTop - elementScrollTop;
}

// 注册事件
function addEvent(el, type, callback, useCapture) {
	if (el.dispatchEvent) { //w3c方式优先
		el.addEventListener(type, callback, !!useCapture);
	} else {
		el.attachEvent("on" + type, callback);
	}
	return callback; //返回callback方便卸载时用
}

// 注册鼠标滚轮事件
function wheel(obj, callback) {
	var wheelType = "mousewheel"
	try {
		document.createEvent("MouseScrollEvents")
		wheelType = "DOMMouseScroll"
	} catch (e) {}

	addEvent(obj, wheelType, function(event) {
		if ("wheelDelta" in event) { //统一为±120，其中正数表示为向上滚动，负数表示向下滚动
			var delta = event.wheelDelta
			//opera 9x系列的滚动方向与IE保持一致，10后修正
			if (window.opera && opera.version() < 10) {
				delta = -delta;
			}
			//由于事件对象的原有属性是只读，我们只能通过添加一个私有属性delta来解决兼容问题
			event.delta = Math.round(delta) / 120; //修正safari的浮点 bug
		} else if ("detail" in event) {
			event.wheelDelta = -event.detail * 40 //为FF添加更大众化的wheelDelta
			event.delta = event.wheelDelta / 120 //添加私有的delta
		}
		callback.call(obj, event); //修正IE的this指向
	});
}
