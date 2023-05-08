export function patch(oldVnode, vnode) {
    console.log(oldVnode, vnode)
    // vnode -> 真实的 dom
    // (1) 创建新DOM
    let el = createEl(vnode)
    // console.log(el)
    // (2) 替换dom    
        /**
         * 1) 获取父节点
         * 2) 插入
         * 3) 删除
        */
    
    // 1.获取父节点
    let parentEl = oldVnode.parentNode   // 父节点是 body
    // 将el 插入到原来的元素 oldVnode的下一个兄弟元素之前，相当于替换了老的oldVnode
    parentEl.insertBefore(el,oldVnode.nextsibling)
    // 将原来的老元素删掉
    parentEl.removeChild(oldVnode)
    return el
    // console.log(parentEl)
}


// 创建dom
function createEl(vnode) { // vnode: {tag,text,data,children}
    let { tag, children, key, data, text } = vnode

    // TODO: 判断是标签的情况
    if (typeof tag === 'string') { // 标签
        vnode.el = document.createElement(tag)  // 创建元素div
        // children []
        if (children.length > 0) { // 有children 还需要创建元素  [{}]
            children.forEach(child => {
                // 需要递归，判断是文本还是标签
                vnode.el.appendChild(createEl(child))
            });

        }
    }else{ // TODO: 判断是文本的情况
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
    

}