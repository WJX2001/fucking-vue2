
/**
 * <div id="app"> hello {{ msg }} <h></h> </div>
 * 
 * render(){  _c 解析标签
 *    return _c('div',{id:app},_v('hello'+_s(msg)),_c)
 * }
*/

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
// 
function gen(node){
    
}

export function generate(el) {  // ast
    console.log(el)
    // 注意属性 {id:app,style:{color:red,fo}}
    let children = genChildren(el)
    let code = `_c(${el.tag},${el.attrs.length? `${genProps(el.attrs)}`:'null'},${children ? `${children}` : 'null'})`
    console.log(code)
}