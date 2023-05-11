export const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "activated",
    "deactivated",
    "beforeDestroy",
    "destroyed",
    "errorCaptured",
]
    

  
// 策略模式
let starts = []
starts.data = function(parentVal,childVal) {
    return childVal
} // 合并data
starts.computed = function() {} // 合并计算属性
starts.watch = function() {} // 合并watch
starts.methods = function() {} // 合并方法

// 遍历生命周期
HOOKS.forEach(hooks => {
    starts[hooks] = mergeHook
})

// 这部分专门处理生命周期里的内容，区分于下面的mergeOptions,这里只是给每个属性一个方法，并不去执行它，下面去执行它
function mergeHook(parentVal,childVal) {
    
    // Vue.options = {created: [a,b,c],watch:[a,b]}
    if(childVal){
        if(parentVal){
            // 将父子的值拼接再一起
            return parentVal.concat(childVal)
        }else {
            return [childVal]
        }
    }else {
        return parentVal
    }
}

// 传入参数对应着 Vue.options,mixin
export function mergeOptions(parent,child) {  //{}  child:就是 Mixin中的  created
    // console.log(parent,child)
    // Vue.options = {created: [a,b,c],watch:[a,b]}  Vue.mixin({created:f a()})
    const options = {}
    // 如果有父亲，没有儿子
    for(let key in parent){
        mergeField(key)
    }
    // 有儿子，没有父亲
    for(let key in  child){ 
        mergeField(key)
    }

    // 合并函数
    function mergeField(key) {
        // 根据key  策略模式
        if(starts[key]) {  //
            options[key] = starts[key](parent[key],child[key])
        }else{
            options[key] = child[key]
        }
    }
    // console.log(options)
    return options
}