
/**
 * <div id="app"> hello {{ msg }} <h></h> </div>
 * 
 * render(){  _c 解析标签
 *    return _c('div',{id:app},_v('hello'+_s()),_c)
 * }
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;   // {{ }}
// 处理属性
function genProps(attrs) {
    let str = '';
    // attrs 是对象的形式 [{...},{...},{...}]
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i] // 拿到每一个对象
        // 判断是否为行内 内联样式   {id:app,style:{color:red,fo}}  {value: 'color: red;font-size: 20px;'}
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                obj[key] = val
            });
            attr.value = obj
        }
        // 拼接
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

// 处理子节点(1)
function genChildren(el) {
    let children = el.children  // 有无子集
    if (children) {
        // 处理数组，将对象处理成字符串
        return children.map(child => gen(child)).join(',')   
    }
}
//  具体处理子节点
function gen(node) { // 1：元素   3：文本
    if (node.type === 1) { // 如果是元素或标签，继续递归
        return generate(node)
    } else { // 文本    (1) 只是文本 hello   (2)   差值表达式
        let text = node.text  // 获取文本

        // 解析不带 {{}} 表达式的
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        // 带有 {{ }} 差值表达式   hello {{name}} , {{msg}} 你好
        let tokens = []
        /**
         *  TODO: 下方使用了while循环，循环中使用了正则表达式匹配差值表达式，由于正则符号带有全局标志'g'，因此每次调用exec
         *        会从上一次匹配结束的位置继续搜索下一个匹配的位置，将它重置为0，确保从文本的开头开始搜索下一个匹配的位置
         */
        let lastindex = defaultTagRE.lastIndex = 0 // 重置lastIndex 这样可以重复使用正则判断
        let match
        while (match = defaultTagRE.exec(text)) {  //使用exec 执行匹配操作，并返回一个数组；每次调用都从上一次匹配结束的位置继续搜索
            // console.log(match)
            let index = match.index
            if (index > lastindex) {  
                // 添加除了差值运算符之前的内容
                tokens.push(JSON.stringify(text.slice(lastindex, index))) 
            }
            // 解决 {{}}
            tokens.push(`_s(${match[1].trim()})`)
            lastindex = index + match[0].length
        }
        // 如果差值表达式的结束位置小于整个文本长度，说明后面还有内容，就后面的内容也处理掉
        if (lastindex < text.length) {
            // slice表示从lastindex开始，一直截取到字符串的末尾
            tokens.push(JSON.stringify(text.slice(lastindex)))
        }
        // 最终返回结果
        return `_v(${tokens.join('+')})`

    }
}

// 处理标签部分
export function generate(el) {  // ast
    // console.log(el)
    // 注意属性 {id:app,style:{color:red,fo}}
    let children = genChildren(el)
    // console.log(children)
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'} ,${children ? `${children}` : ''})`
    // console.log(code)
    // 这里一定要返回，否则上面调用的时候不会处理
    return code
    
}