(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) { // AMD
		define(factory);
	} else if (typeof module === "object" && typeof module.exports === "object") { // Node CommonJS
		module.exports = factory();
	} else { // Browser
		factory();
	}
})(function () {
	"use strict";

	
})