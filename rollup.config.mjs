import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";


// 配置打包文件
export default {
    input:'./src/index.js', // 打包入口文件
    output: {
        file: 'dist/vue.js',  // 打包出口文件
        format: 'umd', // 在window 上 Vue      在html中可以 new Vue，就是通过format实现的
        name: 'Vue',
        sourcemap: true  // 将我们转换前端代码 转换后端代码进行映射
    },
    plugins: [
        babel({
            exclude:'node_modules/**' // 排除下面的所有文件
        }),
        serve({ // 3000
            port: 3000,
            contentBase:'',   // 如果空字符串，为当前目录
            openPage: '/index.html'
        })
    ]
    
}