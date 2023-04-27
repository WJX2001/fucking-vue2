(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 重写数组
  // 1. 获取原来的数组方法
  var oldArrayProtoMethods = Array.prototype;

  // 2. 继承数组的方法
  /**
   * 使用Object.create() 方法创建一个新对象，并将这个新对象的原型设置为oldArrayProtoMethods
   */
  var ArrayMethods = Object.create(oldArrayProtoMethods);

  // 3.劫持数组的方法
  var methods = ["push", "pop", "unshift", "shift", "splice"];

  // 通过遍历methods数组中的每个方法名，将对应的函数重新定义ArrayMethods
  methods.forEach(function (item) {
    ArrayMethods[item] = function () {
      console.log('劫持数组');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[item].apply(this, args);
      return result;
    };
  });

  function observer(data) {
    // console.log(data)
    // TODO: (1) 对象的处理 vue2
    // 判断
    if (_typeof(data) != 'object' || data === null) {
      return data;
    }
    // 通过一个类进行劫持
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      console.log(value);
      // 判断数据是数组还是对象
      if (Array.isArray(value)) {
        // 处理数组
        // 将value的原型指向ArrayMethods
        value.__proto__ = ArrayMethods;
        console.log('数组');
      } else {
        // 处理对象
        this.walk(value); // 遍历
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // { msg: 'hello' }
        // 原始写法
        // let keys = Object.keys(data)
        // for(let i=0;i<keys.length;i++) {
        //     // 对我们的每个属性进行劫持
        //     let key = keys[i]
        //     let value = data[key]
        //     definedReactive(data,key,value)
        // }

        // Es6写法
        for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          definedReactive(data, key, value);
        }
      }
    }]);
    return Observer;
  }(); // 对 对象中的属性进行劫持
  function definedReactive(data, key, value) {
    observer(value); // 深度代理
    Object.defineProperty(data, key, {
      // 获取的时候触发
      get: function get() {
        // console.log('获取的时候触发')
        return value; // 返回值
      },
      set: function set(newValue) {
        // console.log('设置的时候触发')
        if (newValue === value) return value;
        observer(newValue); // 如果用户设置的值是对象
        value = newValue;
      }
    });
  }

  // vue2 object.defineProperty 缺点：对象中的一个属性  {a:1,b:2}

  // {a:{},list:[]}

  // 总结：1) 对象
  // 1、vue2 object.defineProperty 有缺点，只能对对象中的一个属性进行劫持 
  // 2、遍历{a:1,b:2,obj:{}}
  // 3、递归 get    set

  // 数组 {list: [1,2,3,4],arr:[{a:1}]}
  // 方法函数劫持，劫持数组方法 通过 arr.push()

  function initState(vm) {
    var opts = vm.$options;
    // console.log(opts)
    // 判断
    if (opts.props) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.watch) ;
    if (opts.computed) ;
    if (opts.methods) ;

    // data属性  TODO: 对data初始化 
    function initData(vm) {
      // console.log('data初始化',vm) // 1. data可能是对象 2.对象可能是函数
      var data = vm.$options.data;
      vm._data = typeof data === "function" ? data.call(vm) : data; // 注意 this指向问题
      data = vm._data;
      // 数据进行劫持
      observer(data);
    }

    // data{}  (1) 对象 (2) 数组 {a:{b:1},list:[1,2,3],arr:[{}]}
  }

  // 为 Vue.js 添加初始化 mixin
  function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function (options) {
      // console.log(options)

      // 将当前实例赋值给 vm
      var vm = this;
      // 将传入的 options 对象赋值给实例的 $options 属性
      vm.$options = options;
      // 初始化实例状态
      initState(vm);
    };
  }

  function Vue(options) {
    // 初始化
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
