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

通过`npm run dev `即可开始工作

# 二、初始化Vue

首先在根目录下的`index.html`下引入打包文件`dist/vue.js`，然后通过new Vue() 来实现给构造函数创建实例对象

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
    <script src="dist/vue.js"></script>
    <script>
        // 因为用了 umd,所以在window上有个Vue
        // console.log(Vue)
        // 响应式 vue2 mvvm
        new Vue({
            el:'#app',  // 编译模板
            data: {

            },
            props: {

            },
            watch: {}
        })   
    </script>
</body>
</html>
```

然后在`src/index.js`中进行初始化处理，创建Vue的构造函数，

```js
import {initMixin} from './init'

function Vue(options) {
    // 初始化
    this._init(options)

}
initMixin(Vue)

export default Vue
```

通过initMixin函数定义`_init`方法，并在构造函数`Vue`中调用`_init`方法，创建`src/init.js`

```js
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        console.log(options)
    }
}
```



