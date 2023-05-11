import { patch } from "./vnode/patch"
import watcher from "./observer/watcher"

//* 组件挂载，进行渲染
export function mountCoponent(vm,el){
    // TODO: 是组件挂载到页面之前执行的，它提供了一个修改组件数据或者DOM的机会
    callHook(vm,"beforeMount")

    // (1)vm._render 将render函数 变成虚拟DOM (2)vm._updata 将虚拟DOM 变成真实DOM
    // 经过update方法，Vue将组件的虚拟DOM渲染成真实的DOM，并挂载到页面上

    //TODO:  手动更新视图版本
    // vm._updata(vm._render())   
    
    //TODO: 自动更新视图版本
    let updataComponent = ()=> {
        vm._updata(vm._render())   
    } 
    new watcher(vm,updataComponent,()=>{},true)  // true:渲染标识
    // TODO: mounted钩子，VUE2将虚拟DOM 渲染成真实的DOM，并将组件挂载到页面上
    callHook(vm,"mounted")
}

//* 生命周期初始化
export function lifecycleMixin(Vue) {
    // _updata 将虚拟DOM变成真实DOM
    Vue.prototype._updata = function(vnode){
        // console.log(vnode)
        let vm = this
        // console.log(vm.$el)
        // 此处传入两个参数  (1) 旧的dom (2) vnode
        vm.$el =  patch(vm.$el,vnode)
        console.log(vm.$el)
    }
    
}

// （1）render() 函数 -> vnode -> 真实dom 


//* 生命周期调用
export function callHook(vm,hook) {
    const handlers = vm.$options[hook]
    if(handlers){
        for( let i=0;i<handlers.length;i++) {
            handlers[i].call(this)  // 改变生命周期中this指向问题
        }
    }
}