// 重写数组
// 1. 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

// 2. 继承数组的方法
/**
 * 使用Object.create() 方法创建一个新对象，并将这个新对象的原型设置为oldArrayProtoMethods
 */
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3.劫持数组的方法
let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

// 通过遍历methods数组中的每个方法名，将对应的函数重新定义ArrayMethods
methods.forEach(item => {
    ArrayMethods[item] = function (...args) {
        console.log('劫持数组')
        // 将方法内部的"this"指向当前的数组对象，并传入args作为参数
        /**
         * oldArrayProtoMethods[item]=arr.push(arr) 
         * 所以得需要绑定this
         */
        let result = oldArrayProtoMethods[item].apply(this, args)
        console.log(args)   // [{b:6}]
        // 问题： 数组追加对象的情况 arr arr.push({a:1})
        let inserted
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': 
                inserted = args.splice(2)   // arr.splice(0,1,{b:6})  // 除去前面两种方法，所以传参数2
                break;
            
        }
        console.log(inserted)
        let ob = this.__ob__ 
        if(inserted){
            ob.observerArray(inserted) // 对我们添加的对象进行劫持
        }
        return result
    }
})