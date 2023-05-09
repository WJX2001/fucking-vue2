import { initGlobalApi } from './global-api/index'
import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'



function Vue(options) {
    // console.log(options)
    // 初始化
    this._init(options)

}

//* 状态初始化
initMixin(Vue)

//* 生命周期初始化
lifecycleMixin(Vue) // 添加生命周期

//* 渲染文件
renderMixin(Vue)  // 添加_render方法

//* 全局方法 Vue.mixin Vue.coponent Vue.extend
initGlobalApi(Vue)

export default Vue