# 手撕vue2源码

此项目记录我手撕vue2源码

# 一、项目初始化

npm 包管理初始化

```bash
npm init -y
```

## 1 Rollup配置

```bash
pnpm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve -D
```

## 2 编写rollup配置文件

创建`rollup.config.mjs`文件

```js
import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";


// 配置打包文件
export default {
    input:'./src/index.js', // 打包入口文件
    output: {
        file: 'dist/vue.js',  // 打包出口文件
        format: 'umd', // 在window 上 Vue      在html中可以 new Vue，就是通过format实现的
        name: 'Vue',
        sourcemap: true  // 将我们转换前端代码和转换后端代码进行映射
    },
    plugins: [
        babel({
            exclude:'node_modules/**' // 排除下面的所有文件
        }),
        serve({ // 3000
            port: 3000,
            contentBase:'',   // 如果空字符串，为当前目录
            openPage: '/index.html'
        })
    ]
    
}
```

分别创建`index.html`和`src/index.js`

**Index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"> hello </div>
</body>
</html>
```

**src/index.js**

```js
function Vue() {

}
export default Vue
```

## 3 babel 预解析

在根目录下创建`.babelrc`文件

```js
{
    "presets": [
        "@babel/preset-env"  //babel 预解析
    ]
}
```

## 在package.json中写脚本文件

```json
"scripts": {
   // -c代表执行配置文件， -w表示 检测更新,如果更新则会自动检测并同步
    "dev": "rollup -c -w "
  },
```

通过`npm run dev `即可开始工作

# 二、初始化Vue

首先在根目录下的`index.html`下引入打包文件`dist/vue.js`，然后通过new Vue() 来实现给构造函数创建实例对象

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"> hello </div>
    <script src="dist/vue.js"></script>
    <script>
        // 因为用了 umd,所以在window上有个Vue
        // console.log(Vue)
        // 响应式 vue2 mvvm
       let vm =  new Vue({
            el:'#app',  // 编译模板
            // data: {

            // },
            // data还可以写成函数形式
            data() {
                return {
                    msg:'hello',
                    a:{b:20}
                }
            }
            // props: {

            // },
            // watch: {}
        })   
        // get 方法测试
        // console.log(vm._data)
        // set 方法测试
        console.log(vm._data.a={c:30})
    </script>
</body>
</html>
```

然后在`src/index.js`中进行初始化处理，创建Vue的构造函数，

```js
import {initMixin} from './init'

function Vue(options) {
    // 初始化
    this._init(options)

}
initMixin(Vue)

export default Vue
```

通过initMixin函数定义`_init`方法，并在构造函数`Vue`中调用`_init`方法，创建`src/init.js`

```js
import { initState } from "./initState"

// 为 Vue.js 添加初始化 mixin
export function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function(options) {
        // console.log(options)

        // 将当前实例赋值给 vm
        let vm = this  
        // 将传入的 options 对象赋值给实例的 $options 属性
        vm.$options = options
        // 初始化实例状态
        initState(vm)
    }
}
```

## 1. 写初始化函数

继续写初始化函数`src/initState.js`

```js
import { observer } from "./observer/index"

export function initState(vm) {
    let opts = vm.$options
    // console.log(opts)
    // 判断
    if(opts.props){
        initProps()
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.watch){
        initWatch()
    }
    if(opts.computed){
        initComputed()
    }
    if(opts.methods){
        initMethods()
    }

    // 计算属性
    function initComputed() {}
    // 方法属性
    function initMethods() {}
    // Props属性
    function initProps() {}
    // watch方法
    function initWatch() {}


    // data属性  TODO: 对data初始化 
    function initData(vm) {
        // console.log('data初始化',vm) // 1. data可能是对象 2.对象可能是函数
        let data = vm.$options.data
        vm._data = typeof data === "function" ? data.call(vm):data // 注意 this指向问题
        data = vm._data  
        // 数据进行劫持
        observer(data)
    }

    // data{}  (1) 对象 (2) 数组 {a:{b:1},list:[1,2,3],arr:[{}]} 
}
```

## 2 进行数据劫持

写一个`observer`函数进行数据劫持

```js
export function observer(data) {
    console.log(data)
    // TODO: (1) 对象的处理 vue2
    // 判断
    if( typeof data != 'object' || data === null){
        return data
    }
    // 通过一个类进行劫持
    return new Observer(data)

}

class Observer{
    constructor(value) {
        this.walk(value)  // 遍历
    }
    walk(data) {  // { msg: 'hello' }
        // 原始写法
        // let keys = Object.keys(data)
        // for(let i=0;i<keys.length;i++) {
        //     // 对我们的每个属性进行劫持
        //     let key = keys[i]
        //     let value = data[key]
        //     definedReactive(data,key,value)
        // }

        // Es6写法
        for(let [key,value] of Object.entries(data)){
            definedReactive(data,key,value)
        }
    }
}
// 对 对象中的属性进行劫持
function definedReactive(data,key,value) {
    observer(value) // 深度代理
    Object.defineProperty(data,key,{
        // 获取的时候触发
        get() {
            console.log('获取的时候触发')
            return value  // 返回值
        },
        set(newValue) {
            console.log('设置的时候触发')
            if(newValue === value) return value
            observer(newValue)  // 如果用户设置的值是对象
            value = newValue    
        }
    })
}


// vue2 object.defineProperty 缺点：对象中的一个属性  {a:1,b:2}

// {a:{},list:[]}

// 总结：1) 对象
// 1、vue2 object.defineProperty 有缺点，只能对对象中的一个属性进行劫持 
// 2、遍历{a:1,b:2,obj:{}}
// 3、递归 get    set
```

## 3 对data中数组使用函数方法劫持

在`src/observer/index.js`中进行判断，如果是数组，就交给数组处理部分处理

```js
import { ArrayMethods } from "./arr"

export function observer(data) {
    // console.log(data)
    // TODO: (1) 对象的处理 vue2
    // 判断
    if( typeof data != 'object' || data === null){
        return data
    }
    // 通过一个类进行劫持
    return new Observer(data)

}

class Observer{
    constructor(value) {
        console.log(value)
        // 判断数据是数组还是对象
        if(Array.isArray(value)){
            // 处理数组
            // 将value的原型指向ArrayMethods
            value.__proto__ = ArrayMethods
            console.log('数组')
        }else {
            // 处理对象
            this.walk(value)  // 遍历
        }
       
    }
    walk(data) {  // { msg: 'hello' }
        // 原始写法
        // let keys = Object.keys(data)
        // for(let i=0;i<keys.length;i++) {
        //     // 对我们的每个属性进行劫持
        //     let key = keys[i]
        //     let value = data[key]
        //     definedReactive(data,key,value)
        // }

        // Es6写法
        for(let [key,value] of Object.entries(data)){
            definedReactive(data,key,value)
        }
    }
}
// 对 对象中的属性进行劫持
function definedReactive(data,key,value) {
    observer(value) // 深度代理
    Object.defineProperty(data,key,{
        // 获取的时候触发
        get() {
            // console.log('获取的时候触发')
            return value  // 返回值
        },
        set(newValue) {
            // console.log('设置的时候触发')
            if(newValue === value) return value
            observer(newValue)  // 如果用户设置的值是对象
            value = newValue    
        }
    })
}


// vue2 object.defineProperty 缺点：对象中的一个属性  {a:1,b:2}

// {a:{},list:[]}

// 总结：1) 对象
// 1、vue2 object.defineProperty 有缺点，只能对对象中的一个属性进行劫持 
// 2、遍历{a:1,b:2,obj:{}}
// 3、递归 get    set


// 数组 {list: [1,2,3,4],arr:[{a:1}]}
// 方法函数劫持，劫持数组方法 通过 arr.push()
```

在`src/observer/arr.js`中进行进行数组处理，

```js
// 重写数组
// 1. 获取原来的数组方法
let  oldArrayProtoMethods = Array.prototype

// 2. 继承数组的方法
    /**
     * 使用Object.create() 方法创建一个新对象，并将这个新对象的原型设置为oldArrayProtoMethods
     */
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3.劫持数组的方法
let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

// 通过遍历methods数组中的每个方法名，将对应的函数重新定义ArrayMethods
methods.forEach(item => {
    ArrayMethods[item]  = function(...args){
        console.log('劫持数组')
        // 将方法内部的"this"指向当前的数组对象，并传入args作为参数
            /**
             * oldArrayProtoMethods[item]=arr.push(arr) 
             * 所以得需要绑定this
             */
       let result =  oldArrayProtoMethods[item].apply(this,args)
       return result
    }
})
```

## 4 对data中数组以及数组对象进行劫持处理

```js
// 重写数组
// 1. 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

// 2. 继承数组的方法
/**
 * 使用Object.create() 方法创建一个新对象，并将这个新对象的原型设置为oldArrayProtoMethods
 */
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3.劫持数组的方法
let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

// 通过遍历methods数组中的每个方法名，将对应的函数重新定义ArrayMethods
methods.forEach(item => {
    ArrayMethods[item] = function (...args) {
        // console.log('劫持数组')
        // 将方法内部的"this"指向当前的数组对象，并传入args作为参数
        /**
         * oldArrayProtoMethods[item]=arr.push(arr) 
         * 所以得需要绑定this
         */
        let result = oldArrayProtoMethods[item].apply(this, args)
        // console.log(args)   // [{b:6}]
        // 问题： 数组追加对象的情况 arr arr.push({a:1})
        let inserted
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': 
                inserted = args.splice(2)   // arr.splice(0,1,{b:6})  // 除去前面两种方法，所以传参数2
                break;
            
        }
        // console.log(inserted)
        
        let ob = this.__ob__ 
        if(inserted){
            ob.observerArray(inserted) // 对我们添加的对象进行劫持
        }
        return result
    }
})
```

## 5 将data中的属性代理到实例上

在`src/initState.js`中创建

```js
// data属性  TODO: 对data初始化 
    function initData(vm) {
        // console.log('data初始化',vm) // 1. data可能是对象 2.对象可能是函数
        let data = vm.$options.data
        vm._data = typeof data === "function" ? data.call(vm):data // 注意 this指向问题
        data = vm._data  
        // 数据进行劫持
        // 将data 上的所有属性代理到实例上 vm {a:1,b:2}
        
        for(let key in data){
            proxy(vm,"_data",key) 
        }
        observer(data)
    }
```

## 6 获取到html对象

> Vue初次渲染流程：先初始化数据 -> 将模版进行编译 -> 变成render()函数 -> 生成虚拟节点 -> 生成真实的dom -> 放到页面上

**Vue模版编译流程：** 

- vue的模版编译依靠：template，render，el 三个东西，其中el必不可少
- 编译时，先去查看有没有 render 函数，没有就去找 template，如果也没有，vue通过从`el`选项指定的DOM元素开始编译模版并渲染组件，具体流程如下：
  - 如果存在`el `选项，则执行`vm.$mount(el)`，即挂在组件到该DOM元素上
  - 如果不存在`el`选项，则需要手动调用`vm.$mount()`方法挂载组件，这时需要传入一个DOM元素作为挂载点

在`src/init.js`中进行判断

```js
Vue.prototype.$mount = function (el) {
        console.log(el)
        // el template render
        let vm = this
        el = document.querySelector(el)  // 获取元素
        let options = vm.$options
        if(!options.render) {  // 没有render
            let template = options.template
            if(!template && el) {
                // 获取html
                el = el.outerHTML
                console.log(el) // <div id="app"> hello {{ msg }} </div>
            }  
        }
    }
```

# 三、编译语法树

```js

// ast语法树 vnode 
 /**
  * {
  * tag: 'div',
  * attrs: [{id:"app"}],
  * children:[tag:null,text:hello,{tag:'div'}]
  * }
  */

// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <span:xx> 
// 开始标签-捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); 
// 结束标签-匹配标签结尾的 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; {/* <div id="app"></div> */}
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 遍历

function parseHTML(html) {
    // <div id="app"> hello {{ msg }} </div>  // 开始标签，文本，结束标签
    while(html) {  // html 为空结束
        // 判断标签 <>
        let textEnd = html.indexOf('<') // 如果为0的话 证明第一个是<，说明是一个标签
        if(textEnd === 0) { // 标签
            // (1) 开始标签
            const startTagMatch = parseStartTag() // 开始标签的内容
            
        }  
        break;
    }
    function parseStartTag() {
        // 解析开始标签
        const start = html.match(startTagOpen) // 1.结果 2.false
        console.log(start)
        // 创建语法树 ast
        let match = {
            tagName:start[1],
            attrs:[]
        }
        // 删除 开始标签
        advance(start[0].length)
        // 属性
        // 注意  多个属性需要遍历
        // 注意  结束标签 ">"
        let attr 
        let end 
        while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            console.log(attr)  // {}
            match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5]})
            advance(attr[0].length)
            break
        }
        if(end) {
            console.log(end)
            advance(end[0].length)
            return match
        }
    }
    function advance(n){
        // 表示拿到从n开始后面的东西
        html =  html.substring(n)
        console.log(html)
    }
}
export function compileToFunction(template){
    

    let ast = parseHTML(template)
}
```







