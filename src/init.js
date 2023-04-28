import { initState } from "./initState"

// 为 Vue.js 添加初始化 mixin
export function initMixin(Vue) {
    // 将 _init 方法添加到 Vue.prototype 中
    Vue.prototype._init = function(options) {
        console.log(options)

        // 将当前实例赋值给 vm
        let vm = this  
        // 将传入的 options 对象赋值给实例的 $options 属性
        vm.$options = options
        // 初始化实例状态
        initState(vm)
    }
}

