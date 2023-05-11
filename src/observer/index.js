import { ArrayMethods } from "./arr"
import Dep from './dep'
export function observer(data) {
    // console.log(data)

    // TODO: (1) 对象的处理 vue2
    // 判断
    if (typeof data != 'object' || data === null) {
        return data
    }
    // 通过一个类进行劫持
    return new Observer(data)

}

class Observer {
    constructor(value) {
        // 给 data 定义一个属性
        Object.defineProperty(value, "__ob__", {
            enumerable: false,
            value: this
        })

        // console.log(value)
        // 判断数据是数组还是对象
        if (Array.isArray(value)) {
            // 处理数组
            // 将value的原型指向ArrayMethods
            value.__proto__ = ArrayMethods
            // console.log(value)
            // console.log(value)
            // 如果你是数组对象
            this.observerArray(value) // 数组对象劫持
        } else {
            // 处理对象
            this.walk(value)  // 遍历
        }

    }
    walk(data) {  // { msg: 'hello' }
        // 原始写法
        // let keys = Object.keys(data)
        // for(let i=0;i<keys.length;i++) {
        //     // 对我们的每个属性进行劫持
        //     let key = keys[i]
        //     let value = data[key]
        //     definedReactive(data,key,value)
        // }

        // Es6写法
        for (let [key, value] of Object.entries(data)) {
            definedReactive(data, key, value)
        }
    }

    observerArray(value) {  // [{a:1}]
        for (let i = 0; i < value.length; i++) {
            observer(value[i])
        }
    }

}
// 对 对象中的属性进行劫持
function definedReactive(data, key, value) {
    observer(value) // 深度代理
    let dep = new Dep() //给每一个属性添加一个dep
    Object.defineProperty(data, key, {
        // 获取的时候触发
        get() { // 收集依赖 watcher
            if(Dep.target){
                dep.depend()
            }
            console.log('依赖收集到了',dep)
            return value  // 返回值
        },
        set(newValue) {
            // console.log('设置的时候触发')
            if (newValue === value) return value
            observer(newValue)  // 如果用户设置的值是对象
            value = newValue
            dep.notify()
        }
    })
}


// vue2 object.defineProperty 缺点：对象中的一个属性  {a:1,b:2}

// {a:{},list:[]}

// 总结：1) 对象
// 1、vue2 object.defineProperty 有缺点，只能对对象中的一个属性进行劫持 
// 2、遍历{a:1,b:2,obj:{}}
// 3、递归 get    set


// 数组 {list: [1,2,3,4],arr:[{a:1}]}
// 方法函数劫持，劫持数组方法 通过 arr.push()

