
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
        str += `${attr.name}:${JSON.stringfy(attr.value)}`
    }
}
export function generate(el) {  // ast
    console.log(el)
    // 注意属性 {id:app,style:{color:red,fo}}
    let code = `_c(${el.tag},${el.attrs.length? `${genProps(el.attrs)}`:'null'})`
}