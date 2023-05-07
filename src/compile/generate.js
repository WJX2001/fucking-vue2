
/**
 * <div id="app"> hello {{ msg }} <h></h> </div>
 * 
 * render(){  _c 解析标签
 *    return _c('div',{id:app},_v('hello'+_s(msg)),_c)
 * }
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;   // {{ }}
// 处理属性
function genProps(attrs){
    let str = '';
    // attrs 是对象的形式 [{...},{...},{...}]
    for(let i=0;i<attrs.length;i++) {
        let attr = attrs[i] // 拿到每一个对象
        // 判断是否为行内 内联样式   {id:app,style:{color:red,fo}}  {value: 'color: red;font-size: 20px;'}
        if(attr.name === 'style'){
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key,val] = item.split(':')
                obj[key] = val
            });
            attr.value =obj 
        }
        // 拼接
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}

// 处理子节点(1)
function genChildren(el){
    let children = el.children  // 有无子集
    if(children) {
        // 处理数组
        return children.map(child => gen(child)).join(',')
    }
}
//  具体处理
function gen(node){ // 1：元素   3：文本
    if(node.type ===1) { // 如果是元素，继续递归
        return generate(node)
    }else { // 文本    (1) 只是文本 hello   (2)   差值表达式
        let text = node.text  // 获取文本
        
        // 解析不带 {{}} 表达式的
        if(!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        // 带有 {{ }} 差值表达式   hello {{name}} , {{msg}} 你好
        let tokens = []  
        let lastindex = defaultTagRE.lastIndex = 0 // 重置lastIndex 这样可以重复使用正则判断
        let match
        while(match = defaultTagRE.exec(text)) {
            console.log(match)
            let index = match.index
            if(index>lastindex) {  // 添加内容
                tokens.push(JSON.stringify(text.slice(lastindex,index))) // 内容
            }
            // 解决 {{}}
            tokens.push(`_s(${match[1].trim()})`)
            lastindex = index + match[0].length
            // 
            if(lastindex < text.length){
                tokens.push(JSON.stringify(text.slice(lastindex)))
            }
            return `_v(${tokens.join('+')})`
            
        }

    }
}

export function generate(el) {  // ast
    console.log(el)
    // 注意属性 {id:app,style:{color:red,fo}}
    let children = genChildren(el)
    // console.log(children)
    let code = `_c(${el.tag},${el.attrs.length? `${genProps(el.attrs)}`:'null'},${children ? `${children}` : 'null'})`
    console.log(code)
}