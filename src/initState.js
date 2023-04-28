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
        // 将data 上的所有属性代理到实例上 vm {a:1,b:2}
        
        for(let key in data){
            proxy(vm,"_data",key) 
        }
        observer(data)
    }

    function proxy(vm,source,key) {
        Object.defineProperty(vm,key,{
            get() {
                return vm[source][key]
            },
            set(newValue) {
                vm[source][key] = newValue
            }
        })
    }

    // data{}  (1) 对象 (2) 数组 {a:{b:1},list:[1,2,3],arr:[{}]}



    
}