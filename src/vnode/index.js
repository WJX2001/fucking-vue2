export function renderMixin(Vue) {
    // 处理标签方法
    Vue.prototype._c = function( ) { 
        // 创建标签
        return createElement(...arguments)
    }
    // 处理文本
    Vue.prototype._v = function(text) { 
        return createText(text)
    }
    // 处理变量
    Vue.prototype._s = function(val) { 
        return val === null? "":(typeof val ==='object')?JSON.stringify(val):val
    }
    
    Vue.prototype._render = function() { // render函数变成 vnode
        let vm = this   // 拿到实例对象
        let render = vm.$options.render    // 参考init.js中 options.render = render 变成ast语法树部分
        let vnode = render.call(this)
        // console.log(vnode)
        return vnode
    }

}

// 创建元素
function createElement(tag,data={},...children){
    return vnode(tag,data,data.key,children)
}

// 创建文本
function createText(text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}


// 创建虚拟DOM  vnode
function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text

    }
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


