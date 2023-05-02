import { compileToFunction } from "./compile/index"
import { initState } from "./initState"

// 为 Vue.js 添加初始化 mixin
export function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function (options) {
        // console.log(options)

        // 将当前实例赋值给 vm
        let vm = this
        // 将传入的 options 对象赋值给实例的 $options 属性
        vm.$options = options
        // 初始化实例状态
        initState(vm)


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
        let options = vm.$options
        if(!options.render) {  // 没有render
            let template = options.template
            if(!template && el) {
                // 获取html
                el = el.outerHTML
                console.log(el) 
                
                // 变成ast语法树
                let ast = compileToFunction(el)

                // render()
            }  
        }
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






