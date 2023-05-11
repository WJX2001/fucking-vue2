
let id = 0
class Dep{
    constructor() {
        this.id = id++
        this.subs = []
    }

    // 收集watcher
    depend() {
        // 我希望watcher 可以存放 dep
        // 双向记忆
        // this.subs.push(Dep.target)
        Dep.target.addDep(this)
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    // 更新watcher
    notify(){
        this.subs.forEach(watcher => {
            watcher.updata()
        })
    }
}


Dep.target = null

//* 添加watcher
export function pushTarget(watcher) {
    Dep.target = watcher
}


export function popTarget() {
    Dep.target = null
}


export default Dep