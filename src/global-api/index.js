import { mergeOptions } from "../utils/index"

export function initGlobalApi(Vue){
    //源码
    // Vue.options = {created: [a,b,c],watch:[a,b]}
    Vue.options = {}
    Vue.Mixin = function(mixin) { // 传入的是一个对象 {}  
        // 对象的合并
        this.options = mergeOptions(this.options,mixin)
         console.log(Vue.options)
    }   
} 