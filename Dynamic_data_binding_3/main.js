function Observer(data) {
	this.data = data;
	this.eventObj = new Event();
	this.init(data);
}

// 初始化
Observer.prototype.init = function (obj) {
	for(let key in obj) {
		if( obj.hasOwnProperty(key) ) {
			/*if( isObject(obj[key]) ) {
				new Observer(obj[key]);
			}*/

			this.observe(key, obj[key]);

			this.convert(key, obj[key]);
		}
	}
};

// 绑定父级
Observer.prototype.observe = function (key, val) {
	let ob = null;
	if(isObject(val)) {
		ob = new Observer(val);
		ob.parent = {
			parent: key,
			ob: this
		};
	} else {
		return;
	}
};

// 修改属性描述符
Observer.prototype.convert = function (key, val) {
	let self = this;
	
	Object.defineProperty(self.data, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			return val;
		},
		set: function (newVal) {
			if (newVal !== val) {
				val = newVal;

				// 修改值为对象时
				if( isObject(newVal) ) {
					new Observer(newVal);
				}

				// 若有订阅，则发布之
				if(key in self.eventObj.handlers) {
					self.eventObj.emit(key, val);
				}

				// 若父节点有订阅，则发布之
				let parent = self.parent.parent,
					parentHandler = self.parent.ob.eventObj.handlers;
				if(parent in parentHandler) {
					self.parent.ob.eventObj.emit(parent);
				}
			}
		}
	})
};

// 订阅
Observer.prototype.$watch = function(type, callback) {
	this.eventObj.on(type, callback);
}

// 发布-订阅构造函数
function Event() {
	this.handlers = {};
}

// 订阅
Event.prototype.on = function (type, callback) {
	let self = this.handlers;

	if(!(type in self)) {
		self[type] = [];
	}
	
	self[type].push(callback);

	return this;
};

// 发布
Event.prototype.emit = function (type) {
	let handlerArgs = [].slice.call(arguments,1);
	let self = this.handlers;

	for(let i = 0; i < self[type].length; i++) {
		self[type][i].apply(this, handlerArgs);
	}
};


// 判断是否为对象
function isObject(obj) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}