function Observer(data) {
	this.data = data;
	this.init(data);
}

// 初始化
Observer.prototype.init = function (obj) {
	for(let key in obj) {
		if( obj.hasOwnProperty(key) ) {
			if( isObject(obj[key]) ) {
				this.init.call(obj[key], obj[key]);
			}

			convert(key, obj[key], obj);
		}
	}
};

// 修改属性描述符
function convert(key, val, obj) {
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			console.log('你访问了 ' + key);
			return val;
		},
		set: function (newVal) {
			console.log('你设置了 ' + key + '， 新的值为 ' + newVal);
			if (newVal !== val) {
				val = newVal;
				// 修改值为对象时
				if( isObject(newVal) ) {
					(new Observer()).init.call(newVal, newVal);
				}
			}
		}
	})
};


// 判断是否为对象
function isObject(obj) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}