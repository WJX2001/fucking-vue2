import { mergeOptions } from "../utils/index"

export function initGlobalApi(Vue){
    //源码
    // Vue.options = {created: [a,b,c],watch:[a,b]}
    Vue.options = {}
    Vue.Mixin = function(mixin) { // 传入的是一个对象 {}  
        // 对象的合并
        console.log(Vue.options)
        mergeOptions(Vue.options,mixin)
        
    }
} 