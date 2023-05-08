import { patch } from "./vnode/patch"

// 组件挂载，进行渲染
export function mountCoponent(vm,el){
    // (1)vm._render 将render函数 变成虚拟DOM (2)vm._updata 将虚拟DOM 变成真实DOM
    vm._updata(vm._render()) 
}

// 生命周期初始化
export function lifecycleMixin(Vue) {
    // _updata 将虚拟DOM变成真实DOM
    Vue.prototype._updata = function(vnode){
        // console.log(vnode)
        let vm = this
        // console.log(vm.$el)
        // 此处传入两个参数  (1) 旧的dom (2) vnode
        vm.$el =  patch(vm.$el,vnode)
    }
    
}

// （1）render() 函数 -> vnode -> 真实dom 