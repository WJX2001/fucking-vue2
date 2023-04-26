# 手撕vue2源码

此项目记录我手撕vue2源码

# 一、项目初始化

npm 包管理初始化

```bash
npm init -y
```

## 1 Rollup配置

```bash
pnpm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve -D
```

## 2 编写rollup配置文件

创建`rollup.config.mjs`文件

```js
import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";


// 配置打包文件
export default {
    input:'./src/index.js', // 打包入口文件
    output: {
        file: 'dist/vue.js',  // 打包出口文件
        format: 'umd', // 在window 上 Vue      在html中可以 new Vue，就是通过format实现的
        name: 'Vue',
        sourcemap: true  // 将我们转换前端代码和转换后端代码进行映射
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
```

分别创建`index.html`和`src/index.js`

**Index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"> hello </div>
</body>
</html>
```

**src/index.js**

```js
function Vue() {

}
export default Vue
```

## 3 babel 预解析

在根目录下创建`.babelrc`文件

```js
{
    "presets": [
        "@babel/preset-env"  //babel 预解析
    ]
}
```

## 在package.json中写脚本文件

```json
"scripts": {
   // -c代表执行配置文件， -w表示 检测更新,如果更新则会自动检测并同步
    "dev": "rollup -c -w "
  },
```



