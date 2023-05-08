// 组件挂载，进行渲染
export function mountCoponent(vm,el){
    // (1)vm._render 将render函数 变成虚拟DOM (2)vm._updata 将虚拟DOM 变成真实DOM
    vm._updata(vm._render()) 
}

// 生命周期初始化
export function lifecycleMixin(Vue) {
    Vue.prototype._updata = function(vnode){

    }
    
}

// （1）render() 函数 -> vnode -> 真实dom 