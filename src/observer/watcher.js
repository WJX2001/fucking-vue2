//* (1) 通过这个类 watcher 实现更新

import { popTarget, pushTarget } from "./dep"

let id = 0
class watcher{
    constructor(vm,updataComponent,cb,options) {
        this.vm = vm
        this.exprOrfn = updataComponent
        this.cb = cb
        this.options = options
        this.id = id++
        // 判断
        if(typeof updataComponent === 'function'){
            this.getter = updataComponent  // 更新视图方法赋值给getter
        }
        // 更新视图
        this.get() 
    }
    //  初次渲染
    get() {
        pushTarget(this)  //给dep 添加watcher
        this.getter()     // 渲染页面  vm._updata(vm._render())  _s(msg)  vm.msg
        popTarget()       // 给dep 取消 watcher


    }
    // 更新
    updata() {
        this.getter()
    }
}


export default watcher

//TODO: 收集依赖  vue：dep watcher data: {name,msg}

// dep: dep和data中的属性是一一对应的
// watcher: 在视图上用几个，就有几个watcher
// dep与watcher：一对多  dep.name = [w1,w2]
    
//实现对象的收集依赖
