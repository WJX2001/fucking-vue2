import { generate } from "./generate"
import { parseHTML } from "./parseAst"

export function compileToFunction(template) {

    // TODO: 一、 将html 变成ast 语法树
    let ast = parseHTML(template)
    // console.log(ast)

    // TODO: 二、 将ast语法树变成render函数 (1) ast 语法树变成字符串 (2) 字符串变成函数
    let code = generate(ast)    // _c_v_s   解析元素：_c  解析文本: _v 解析变量: _s
 
    // TODO: 三、 将render 字符串变成函数
    /**
     * with 语句是js中的一个特殊语句，可以将一个对象作为作用域，使得对象内部的变量可以直接被调用，而无需使用对象本身作为前缀
     * 可以直接使用 a  而不用Obj.a
     */
    let render = new Function(`with(this){return ${code}}`)
    console.log(render)

}
