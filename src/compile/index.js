import { parseHTML } from "./parseAst"

export function compileToFunction(template) {

    // TODO: 一、 将html 变成ast 语法树
    let ast = parseHTML(template)
    console.log(ast)

    // TODO: 二、 将ast语法树变成render函数 (1) ast 语法树变成字符串 (2) 字符串变成函数
}

/**
 * 
 */