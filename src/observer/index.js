export function observer(data) {
    console.log(data)
    // TODO: (1) 对象的处理 vue2
    // 判断
    if( typeof data != 'object' || data === null){
        return data
    }
    // 通过一个类进行劫持
    return new Observer(data)

}

class Observer{
    constructor(value) {
        this.walk(value)  // 遍历
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
        for(let [key,value] of Object.entries(data)){
            definedReactive(data,key,value)
        }
    }
}
// 对 对象中的属性进行劫持
function definedReactive(data,key,value) {
    observer(value) // 深度代理
    Object.defineProperty(data,key,{
        // 获取的时候触发
        get() {
            console.log('获取的时候触发')
            return value  // 返回值
        },
        set(newValue) {
            console.log('设置的时候触发')
            if(newValue === value) return value
            observer(newValue)  // 如果用户设置的值是对象
            value = newValue    
        }
    })
}


// vue2 object.defineProperty 缺点：对象中的一个属性  {a:1,b:2}

// {a:{},list:[]}

// 总结：1) 对象
// 1、vue2 object.defineProperty 有缺点，只能对对象中的一个属性进行劫持 
// 2、遍历{a:1,b:2,obj:{}}
// 3、递归 get    set