(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "activated", "deactivated", "beforeDestroy", "destroyed", "errorCaptured"];

  // 策略模式
  var starts = [];
  starts.data = function (parentVal, childVal) {
    return childVal;
  }; // 合并data
  starts.computed = function () {}; // 合并计算属性
  starts.watch = function () {}; // 合并watch
  starts.methods = function () {}; // 合并方法

  // 遍历生命周期
  HOOKS.forEach(function (hooks) {
    starts[hooks] = mergeHook;
  });

  // 这部分专门处理生命周期里的内容，区分于下面的mergeOptions,这里只是给每个属性一个方法，并不去执行它，下面去执行它
  function mergeHook(parentVal, childVal) {
    // Vue.options = {created: [a,b,c],watch:[a,b]}
    if (childVal) {
      if (parentVal) {
        // 将父子的值拼接再一起
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  // 传入参数对应着 Vue.options,mixin
  function mergeOptions(parent, child) {
    //{}  child:就是 Mixin中的  created
    // console.log(parent,child)
    // Vue.options = {created: [a,b,c],watch:[a,b]}  Vue.mixin({created:f a()})
    var options = {};
    // 如果有父亲，没有儿子
    for (var key in parent) {
      mergeField(key);
    }
    // 有儿子，没有父亲
    for (var _key in child) {
      mergeField(_key);
    }

    // 合并函数
    function mergeField(key) {
      // 根据key  策略模式
      if (starts[key]) {
        //
        options[key] = starts[key](parent[key], child[key]);
      } else {
        options[key] = child[key];
      }
    }
    // console.log(options)
    return options;
  }

  function initGlobalApi(Vue) {
    //源码
    // Vue.options = {created: [a,b,c],watch:[a,b]}
    Vue.options = {};
    Vue.Mixin = function (mixin) {
      // 传入的是一个对象 {}  
      // 对象的合并
      this.options = mergeOptions(this.options, mixin);
      console.log(Vue.options);
      //  console.log(Vue.$options)
    };
  }

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

  /**
   * <div id="app"> hello {{ msg }} <h></h> </div>
   * 
   * render(){  _c 解析标签
   *    return _c('div',{id:app},_v('hello'+_s()),_c)
   * }
  */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ }}
  // 处理属性
  function genProps(attrs) {
    var str = '';
    // attrs 是对象的形式 [{...},{...},{...}]
    var _loop = function _loop() {
      var attr = attrs[i]; // 拿到每一个对象
      // 判断是否为行内 内联样式   {id:app,style:{color:red,fo}}  {value: 'color: red;font-size: 20px;'}
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            val = _item$split2[1];
          obj[key] = val;
        });
        attr.value = obj;
      }
      // 拼接
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }

  // 处理子节点(1)
  function genChildren(el) {
    var children = el.children; // 有无子集
    if (children) {
      // 处理数组，将对象处理成字符串
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  //  具体处理子节点
  function gen(node) {
    // 1：元素   3：文本
    if (node.type === 1) {
      // 如果是元素或标签，继续递归
      return generate(node);
    } else {
      // 文本    (1) 只是文本 hello   (2)   差值表达式
      var text = node.text; // 获取文本

      // 解析不带 {{}} 表达式的
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }
      // 带有 {{ }} 差值表达式   hello {{name}} , {{msg}} 你好
      var tokens = [];
      /**
       *  TODO: 下方使用了while循环，循环中使用了正则表达式匹配差值表达式，由于正则符号带有全局标志'g'，因此每次调用exec
       *        会从上一次匹配结束的位置继续搜索下一个匹配的位置，将它重置为0，确保从文本的开头开始搜索下一个匹配的位置
       */
      var lastindex = defaultTagRE.lastIndex = 0; // 重置lastIndex 这样可以重复使用正则判断
      var match;
      while (match = defaultTagRE.exec(text)) {
        //使用exec 执行匹配操作，并返回一个数组；每次调用都从上一次匹配结束的位置继续搜索
        // console.log(match)
        var index = match.index;
        if (index > lastindex) {
          // 添加除了差值运算符之前的内容
          tokens.push(JSON.stringify(text.slice(lastindex, index)));
        }
        // 解决 {{}}
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastindex = index + match[0].length;
      }
      // 如果差值表达式的结束位置小于整个文本长度，说明后面还有内容，就后面的内容也处理掉
      if (lastindex < text.length) {
        // slice表示从lastindex开始，一直截取到字符串的末尾
        tokens.push(JSON.stringify(text.slice(lastindex)));
      }
      // 最终返回结果
      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  // 处理标签部分
  function generate(el) {
    // ast
    // console.log(el)
    // 注意属性 {id:app,style:{color:red,fo}}
    var children = genChildren(el);
    // console.log(children)
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined', " ,").concat(children ? "".concat(children) : '', ")");
    // console.log(code)
    // 这里一定要返回，否则上面调用的时候不会处理
    return code;
  }

  // <div id="app"> hello {{ msg }} <h></h></div>
  // ast语法树 vnode 
  /**
   * {
   * tag: 'div',
   * attrs: [{id:"app"}],
   * children:[tag:null,text:hello,{tag:'div'}]
   * }
   */

  // 标签名 a-aaa
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  // 命名空间标签 aa:aa-xxx
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <span:xx> 
  // 开始标签-捕获标签名
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  // 结束标签-匹配标签结尾的 </div>
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  // 匹配属性
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 匹配标签结束的 >
  var startTagClose = /^\s*(\/?)>/;

  // 遍历
  // 创建一个ast语法树
  // <div id="app"> hello {{ msg }} <h></h></div>
  function createASTElement(tag, attrs) {
    return {
      tag: tag,
      // 原树  是div或者span或等等
      attrs: attrs,
      // 属性
      children: [],
      // 子节点
      type: 1,
      // 元素类型
      parent: null
    };
  }
  var root; // 根元素
  var createParent; // 当前元素的父亲
  // 数据结构  栈
  var stack = []; // [div,h]

  function start(tag, attrs) {
    // 开始标签
    var element = createASTElement(tag, attrs);
    if (!root) {
      root = element;
    }
    createParent = element;
    stack.push(element);
  }
  function charts(text) {
    // 获取文本
    // console.log(text, '文本内容部分')
    // 去掉空格
    // text = text.replace(/a/g,'')  // /a 表示空格 /g表示全部 /a/g表示全部空格 
    // 去掉空格 写法II
    text = text.split(' ').join('');
    if (text) {
      createParent.children.push({
        type: 3,
        text: text
      });
    }
  }
  function end(tag) {
    // 结束的标签
    var element = stack.pop(); // 拿到栈中最后一个元素
    createParent = stack[stack.length - 1];
    if (createParent) {
      // 元素闭合
      element.parent = createParent.tag;
      createParent.children.push(element);
    }
  }

  // 创建一个 ast 对象
  function parseHTML(html) {
    // <div id="app"> hello {{ msg }} <h></h></div>  // 开始标签，文本，结束标签
    while (html) {
      // html 为空结束
      // 判断标签 <>
      var textEnd = html.indexOf('<'); // 如果为0的话 证明第一个是<，说明是一个标签
      if (textEnd === 0) {
        // 标签
        // (1) 开始标签
        var startTagMatch = parseStartTag(); // 开始标签的内容 {}
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        // (2)结束标签
        var endTagMatch = html.match(endTag);
        // console.log(endTagMatch)
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      // 文本处理
      var text = void 0;
      if (textEnd > 0) {
        // console.log(textEnd)
        // 获取文本内容
        text = html.substring(0, textEnd);
        // console.log(text)
      }

      if (text) {
        advance(text.length);
        charts(text);
        // console.log(html)
      }
      // break;
    }

    function parseStartTag() {
      // 解析开始标签
      var start = html.match(startTagOpen); // 1.结果 2.false
      if (start) {
        // console.log(start)
        // 创建语法树 ast
        var match = {
          tagName: start[1],
          attrs: []
        };
        // 删除 开始标签
        advance(start[0].length);
        // 属性
        // 注意  多个属性需要遍历
        // 注意  结束标签 ">"
        var attr;
        var _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log(attr)  // {}
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        // 当字符剩下一个'>'符号的时候，需要通过end去处理它
        if (_end) {
          // console.log(end)
          advance(_end[0].length);
          return match;
        }
      }
    }
    function advance(n) {
      // 表示拿到从n开始后面的东西
      html = html.substring(n);
      // console.log(html)
    }
    // console.log(root)
    return root;
  }

  function compileToFunction(template) {
    // TODO: 一、 将html 变成ast 语法树
    var ast = parseHTML(template);
    // console.log(ast)

    // TODO: 二、 将ast语法树变成render函数 (1) ast 语法树变成字符串 (2) 字符串变成函数
    var code = generate(ast); // _c_v_s   解析元素：_c  解析文本: _v 解析变量: _s

    // TODO: 三、 将render 字符串变成函数
    /**
     * with 语句是js中的一个特殊语句，可以将一个对象作为作用域，使得对象内部的变量可以直接被调用，而无需使用对象本身作为前缀
     * 可以直接使用 a  而不用Obj.a
     */
    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // console.log('劫持数组')
      // 将方法内部的"this"指向当前的数组对象，并传入args作为参数
      /**
       * oldArrayProtoMethods[item]=arr.push(arr) 
       * 所以得需要绑定this
       */
      var result = oldArrayProtoMethods[item].apply(this, args);
      // console.log(args)   // [{b:6}]
      // 问题： 数组追加对象的情况 arr arr.push({a:1})
      var inserted;
      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.splice(2); // arr.splice(0,1,{b:6})  // 除去前面两种方法，所以传参数2
          break;
      }
      // console.log(inserted)

      var ob = this.__ob__;
      if (inserted) {
        ob.observerArray(inserted); // 对我们添加的对象进行劫持
      }

      ob.dep.notify();
      return result;
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }

    // 收集watcher
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 我希望watcher 可以存放 dep
        // 双向记忆
        // this.subs.push(Dep.target)
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }

      // 更新watcher
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.updata();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;

  //* 添加watcher
  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }

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
      // 给 data 定义一个属性
      Object.defineProperty(value, "__ob__", {
        enumerable: false,
        // 指定属性是否可枚举
        value: this,
        // 属性的值，将this设置为当前实例
        configurable: false // 控制属性描述符是否能改变
      });

      // 给我们的对象所有对象类型添加一个dep []
      this.dep = new Dep();

      // 判断数据是数组还是对象
      // console.log(value)
      if (Array.isArray(value)) {
        // 处理数组
        // 将value的原型指向ArrayMethods
        value.__proto__ = ArrayMethods;
        // console.log(value)
        // console.log(value)
        // 如果你是数组对象
        this.observerArray(value); // 数组对象劫持
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
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        // [{a:1}]
        for (var i = 0; i < value.length; i++) {
          observer(value[i]);
        }
      }
    }]);
    return Observer;
  }(); // 对 对象中的属性进行劫持
  function definedReactive(data, key, value) {
    var childDep = observer(value); // 深度代理
    var dep = new Dep(); //给每一个属性添加一个dep
    Object.defineProperty(data, key, {
      // 获取的时候触发
      get: function get() {
        // 收集依赖 watcher
        // console.log(childDep)
        if (Dep.target) {
          dep.depend();
          if (childDep.dep) {
            childDep.dep.depend(); //数组收集
          }
        }
        // console.log('依赖收集到了',dep)
        return value; // 返回值
      },
      set: function set(newValue) {
        // console.log('设置的时候触发')
        if (newValue === value) return value;
        observer(newValue); // 如果用户设置的值是对象
        value = newValue;
        dep.notify();
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
      // 将data 上的所有属性代理到实例上 vm {a:1,b:2}

      for (var key in data) {
        proxy(vm, "_data", key);
      }
      observer(data);
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }

    // data{}  (1) 对象 (2) 数组 {a:{b:1},list:[1,2,3],arr:[{}]}
  }

  function patch(oldVnode, vnode) {
    // console.log(oldVnode, vnode)
    // vnode -> 真实的 dom
    // (1) 创建新DOM
    var el = createEl(vnode);
    // console.log(el)
    // (2) 替换dom    
    /**
     * 1) 获取父节点
     * 2) 插入
     * 3) 删除
    */

    // 1.获取父节点
    var parentEl = oldVnode.parentNode; // 父节点是 body
    // 将el 插入到原来的元素 oldVnode的下一个兄弟元素之前，相当于替换了老的oldVnode
    parentEl.insertBefore(el, oldVnode.nextsibling);
    // 将原来的老元素删掉
    parentEl.removeChild(oldVnode);
    return el;
    // console.log(parentEl)
  }

  // 创建dom
  function createEl(vnode) {
    // vnode: {tag,text,data,children}
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;

    // TODO: 判断是标签的情况
    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag); // 创建元素div
      // children []
      if (children.length > 0) {
        // 有children 还需要创建元素  [{}]
        children.forEach(function (child) {
          // 需要递归，判断是文本还是标签
          vnode.el.appendChild(createEl(child));
        });
      }
    } else {
      // TODO: 判断是文本的情况
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }

  // TODO: 面试题：Vue的渲染流程

  /**
   * 数据初始化 -> 对模板进行编译 -> 变成render函数(div变ast语法树 => render字符串 => render函数) 
   *           -> 通过render函数变成vnode -> vnode变成真实dom -> 放到页面
   */

  var id = 0;
  var watcher = /*#__PURE__*/function () {
    function watcher(vm, updataComponent, cb, options) {
      _classCallCheck(this, watcher);
      this.vm = vm;
      this.exprOrfn = updataComponent;
      this.cb = cb;
      this.options = options;
      this.id = id++;
      this.deps = []; // watcher存放 dep
      this.depsId = new Set();
      // 判断
      if (typeof updataComponent === 'function') {
        this.getter = updataComponent; // 更新视图方法赋值给getter
      }
      // 更新视图
      this.get();
    }
    _createClass(watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // 1.去重
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }

      //  初次渲染
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //给dep 添加watcher
        this.getter(); // 渲染页面  vm._updata(vm._render())  _s(msg)  vm.msg
        popTarget(); // 给dep 取消 watcher
      }
      // 更新
    }, {
      key: "updata",
      value: function updata() {
        this.getter();
      }
    }]);
    return watcher;
  }();

  //TODO: 收集依赖  vue：dep watcher data: {name,msg}

  // dep: dep和data中的属性是一一对应的
  // watcher: 在视图上用几个，就有几个watcher
  // dep与watcher：一对多  dep.name = [w1,w2]

  //实现对象的收集依赖

  //* 组件挂载，进行渲染
  function mountCoponent(vm, el) {
    // TODO: 是组件挂载到页面之前执行的，它提供了一个修改组件数据或者DOM的机会
    callHook(vm, "beforeMount");

    // (1)vm._render 将render函数 变成虚拟DOM (2)vm._updata 将虚拟DOM 变成真实DOM
    // 经过update方法，Vue将组件的虚拟DOM渲染成真实的DOM，并挂载到页面上

    //TODO:  手动更新视图版本
    // vm._updata(vm._render())   

    //TODO: 自动更新视图版本
    var updataComponent = function updataComponent() {
      vm._updata(vm._render());
    };
    new watcher(vm, updataComponent, function () {}, true); // true:渲染标识
    // TODO: mounted钩子，VUE2将虚拟DOM 渲染成真实的DOM，并将组件挂载到页面上
    callHook(vm, "mounted");
  }

  //* 生命周期初始化
  function lifecycleMixin(Vue) {
    // _updata 将虚拟DOM变成真实DOM
    Vue.prototype._updata = function (vnode) {
      // console.log(vnode)
      var vm = this;
      // console.log(vm.$el)
      // 此处传入两个参数  (1) 旧的dom (2) vnode
      vm.$el = patch(vm.$el, vnode);
      console.log(vm.$el);
    };
  }

  // （1）render() 函数 -> vnode -> 真实dom 

  //* 生命周期调用
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(this); // 改变生命周期中this指向问题
      }
    }
  }

  // 为 Vue.js 添加初始化 mixin
  function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function (options) {
      // console.log(options)

      // 将当前实例赋值给 vm
      var vm = this;

      // 将传入的 options 对象赋值给实例的 $options 属性
      vm.$options = mergeOptions(Vue.options, options);

      // TODO: 实例刚刚被创建，但是数据和事件还未初始化
      callHook(vm, 'beforeCreated');
      // TODO: 初始化实例状态
      initState(vm);
      // TODO: 实例已经被创建，数据和事件已经初始化完成，但是模板还未编译成DOM
      callHook(vm, 'created');
      console.log(vm);

      // 渲染模版  el
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    // 创建 $mount方法
    Vue.prototype.$mount = function (el) {
      console.log(el);
      // el template render
      var vm = this;
      el = document.querySelector(el); // 获取元素
      vm.$el = el;
      var options = vm.$options;
      if (!options.render) {
        // 没有render
        var template = options.template;
        if (!template && el) {
          // 获取html
          el = el.outerHTML;
          // console.log(el) 

          // 变成ast语法树
          var render = compileToFunction(el);
          // console.log(render)
          // (1) 将render 函数变成vnode  (2) 将vnode 变成真实的DOM 放到页面上
          options.render = render;
        }
      }
      // 挂载组件 进行渲染
      mountCoponent(vm); // vm._updata  将虚拟DOM 变成真实DOM  
      // vm._render  将render函数 变成虚拟DOM
    };
  }

  // ast语法树 vnode 
  /**
   * {
   * tag: 'div',
   * attrs: [{id:"app"}],
   * children:[tag:null,text:hello,{tag:'div'}]
   * }
   */

  function renderMixin(Vue) {
    // 处理标签方法
    Vue.prototype._c = function () {
      // 创建标签
      return createElement.apply(void 0, arguments);
    };
    // 处理文本
    Vue.prototype._v = function (text) {
      return createText(text);
    };
    // 处理变量
    Vue.prototype._s = function (val) {
      return val === null ? "" : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._render = function () {
      // render函数变成 vnode
      var vm = this; // 拿到实例对象
      var render = vm.$options.render; // 参考init.js中 options.render = render 变成ast语法树部分
      var vnode = render.call(this);
      // console.log(vnode)
      return vnode;
    };
  }

  // 创建元素
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, data.key, children);
  }

  // 创建文本
  function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  // 创建虚拟DOM  vnode
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  // vnode   描述节点

  /**
   * {
   * tag,
   * text,
   * children
   * 
   * }
   */

  function Vue(options) {
    // console.log(options)
    // 初始化
    this._init(options);
  }

  //* 状态初始化
  initMixin(Vue);

  //* 生命周期初始化
  lifecycleMixin(Vue); // 添加生命周期

  //* 渲染文件
  renderMixin(Vue); // 添加_render方法

  //* 全局方法 Vue.mixin Vue.coponent Vue.extend
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
