
// ast语法树 vnode 
 /**
  * {
  * tag: 'div',
  * attrs: [{id:"app"}],
  * children:[tag:null,text:hello,{tag:'div'}]
  * }
  */

// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <span:xx> 
// 开始标签-捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); 
// 结束标签-匹配标签结尾的 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; {/* <div id="app"></div> */}
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 遍历




function parseHTML(html) {
    // <div id="app"> hello {{ msg }} </div>  // 开始标签，文本，结束标签
    while(html) {  // html 为空结束
        // 判断标签 <>
        let textEnd = html.indexOf('<') // 如果为0的话 证明第一个是<，说明是一个标签
        if(textEnd === 0) { // 标签
            // (1) 开始标签
            const startTagMatch = parseStartTag() // 开始标签的内容
            
        }  
        break;
    }
    function parseStartTag() {
        // 解析开始标签
        const start = html.match(startTagOpen) // 1.结果 2.false
        console.log(start)
        // 创建语法树 ast
        let match = {
            tagName:start[1],
            attrs:[]
        }
        // 删除 开始标签
        advance(start[0].length)
        // 属性
        // 注意  多个属性需要遍历
        // 注意  结束标签 ">"
        let attr 
        let end 
        while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            console.log(attr)  // {}
            match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5]})
            advance(attr[0].length)
            break
        }
        

        // 当字符剩下一个'>'符号的时候，需要通过end去处理它
        if(end) {
            console.log(end)
            advance(end[0].length)
            return match
        }
    }
    function advance(n){
        // 表示拿到从n开始后面的东西
        html =  html.substring(n)
        console.log(html)
    }
}
export function compileToFunction(template){
    

    let ast = parseHTML(template)
}