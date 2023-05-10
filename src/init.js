import { compileToFunction } from "./compile/index"
import { initState } from "./initState"
import { callHook, mountCoponent } from "./lifecycle"
import { mergeOptions } from "./utils/index"

// 为 Vue.js 添加初始化 mixin
export function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function (options) {
        // console.log(options)

        // 将当前实例赋值给 vm
        let vm = this
        
        // 将传入的 options 对象赋值给实例的 $options 属性
        vm.$options = mergeOptions(Vue.options,options)

        // TODO: 实例刚刚被创建，但是数据和事件还未初始化
        callHook(vm,'beforeCreated')
        // TODO: 初始化实例状态
        initState(vm)
        // TODO: 实例已经被创建，数据和事件已经初始化完成，但是模板还未编译成DOM
        callHook(vm,'created')
        
        console.log(vm)

        // 渲染模版  el
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)

        }
        
    }

    // 创建 $mount方法
    Vue.prototype.$mount = function (el) {
        console.log(el)
        // el template render
        let vm = this
        el = document.querySelector(el)  // 获取元素
        vm.$el = el
        let options = vm.$options
        if(!options.render) {  // 没有render
            let template = options.template
            if(!template && el) {
                // 获取html
                el = el.outerHTML
                // console.log(el) 
                
                // 变成ast语法树
                let render = compileToFunction(el)
                // console.log(render)
                // (1) 将render 函数变成vnode  (2) 将vnode 变成真实的DOM 放到页面上
                options.render = render
            }  
        }
        // 挂载组件 进行渲染
        mountCoponent(vm,el)  // vm._updata  将虚拟DOM 变成真实DOM  
                              // vm._render  将render函数 变成虚拟DOM
    }
}

// ast语法树 vnode 
 /**
  * {
  * tag: 'div',
  * attrs: [{id:"app"}],
  * children:[tag:null,text:hello,{tag:'div'}]
  * }
  */






