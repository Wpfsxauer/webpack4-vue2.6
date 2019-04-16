# webpack4-vue2.6
&ensp;&ensp;&ensp;&ensp; webpack4与vue2.6已经出来一段时间了，忙于业务一直没有时间做升级，cli又不能满足业务上的需求，决定抛弃脚手架手撸一个最新的基于vue的webpack项目。

 #### 1.首先先创建一个文件夹，输入命令
```
    npm init
```
#### 2、下载webpack4 与 webpack CLI
一系列操作之后，package包出现了，我们先下载关于webpack的依赖包，输入指令。
```
npm i webpack webpack-cli webpack-dev-server -D
```
#### 3、下载vue、vue-route、vuex
```
npm i vue vue-router vuex //生产依赖
npm i vue-template-compiler vue-loader vue-style-loader -D //开发依赖
```
#### 4、配置关于vue的文件
  <div align=left>
      <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a2436f19550114?w=213&h=353&f=png&s=117512">
  </div>
  
#### 5、创建webpack.config.js并配置package脚本
首先我们在根目录创建webpack.config.js
```
module.exports = {
  entry: 'main.js', // 入口文件，也就是打包这个js文件
  output: {  // 打包的文件位置
    filename: 'bundle.[hash:8].js', //当js文件更改， [hash]的值会变化，每次build会生成一个新的js文件，[hash:8]，只显示8位的hash值，打包出来当然文件名叫 bundle.js
    path: path.resolve(__dirname, 'jycloud'), //resolve() 可以把相对路径解析成绝对路径， __dirname 是当前目录，路径必须是一个绝对路径，相对于根目录
  }
}
```
为了方便操作我们先配置webpack脚本
```
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server",
    "start": "npm run dev"
  }
```
#### 6、配置webpack服务
```
  devServer: { // 开发服务器的配置
    port: 3000,
    progress: true, // 编译的进度条
    contentBase: path.join(__dirname, 'static'), // 以static目录为默认启动目录
    compress: true, // 自动压缩
    open: true,// 自动打开浏览器
  }
```
#### 7、配置html。
前期工作铺垫好了，我们先开始配置html，先下载
```
npm i html-webpack-plugin  -D
```
然后我们进行webpack.config.js的配置。
```
const HtmlWebpackPlugin = require('html-webpack-plugin')//html分离
```
```
  plugins: [  // 数组,放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: 'index.html', // 注意路径为根目录下的路径
      filename: 'index.html', // 打包后也叫做 index.html
      minify: {     // 压缩这个html文件(主要是对HTML文件进行压缩)
        removeAttributeQuotes: true,        // 删除这个html文件的双引号
        collapseWhitespace: true      // 变成一行
      },
      hash: true
    })
]
```
#### 8、配置css。
```
npm i style-loader css-loader less less-loader postcss-loader autoprefixer -D
npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin  -D
```
然后我们进行webpack.config.js的配置。
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')//这个插件的主要作用是实现css分离
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')// 这个插件作用是对单独抽离出来的css文件进行压缩。
```
```
  module: { // 模块loader 默认是从右到左，从下到上执行,多个loader需要一个数组，loader是有顺序的，默认是从右向左执行，loader还可以写成 对象方式
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 把样式都抽离成一个单独的css文件
          "css-loader",
          "postcss-loader"//给CSS3语法，比如transfrom加上前缀， 需要新建 postcss.config.js 配置文件，需要引用 autoprefixer 这个插件
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // 解析 @import这种语法的
          'postcss-loader',
          'less-loader' // 把less转变为css
        ]
      }
    ]
  }
  ```
  ```
  plugins: [  // 数组,放着所有的webpack插件
    new MiniCssExtractPlugin({
      filename: 'jycloud.css'
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true//是否将插件信息打印到控制台
    })
]
```
 postcss.config.js配置
  ```
module.exports = {
  plugins: [require('autoprefixer')]//  // 需要用到 autoprefixer插件
}
```
#### 9、配置图片
```
npm i url-loader file-loader -D
npm i html-withimg-loader -D //处理html填入图片
```
然后我们进行webpack.config.js的配置。
```
  module: { 
    rules: [
      {
        test: /\.html$/,    // 找到html文件
        use: 'html-withimg-loader'//解决html引入图片打包的问题
      },
      {
        test: /\.(png|jpg|gif)$/,       // 找到所有的图片
        use: {// 做一个限制，当我们的图片，小于多少k的时候，用base64来转化，否则用file-loader产生真实的图片
          loader: 'url-loader',
          options: {
            limit: 200 * 1024   // 小于200k，会转化成base64
          }
        }
      },
     ]
  }
```
#### 10、配置js
```
npm i @babel/core @babel/preset-env @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime -D
```
然后我们进行webpack.config.js的配置。
```
  module: { 
    rules: [
      {
        test: /\.js$/,  // 找到所有的js文件
        use: {
          loader: 'babel-loader', // 用babel-loader，需要把ES6转换成ES5语法
          options: {
            presets: [ // babel的集合
             '@babel/preset-env'    // @babel/preset-env 就是用来将ES6转化成ES5语法的
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {'legacy': true}],   // 将ES7语法中的类装饰器转换成ES5语法， legacy 是宽松模式
              ['@babel/plugin-proposal-class-properties', {'loose': true}],  // 将ES7语法中的类转换成ES5语法
              '@babel/plugin-transform-runtime'//避免编译出现重复
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),// 只查找src目录下的js，不找node_modules里面的js
      },
     ]
  }
```
#### 11、配置vue
const VueLoaderPlugin = require('vue-loader/lib/plugin');//VueLoaderPlugin,注意路径一定是('vue-loader/lib/plugin')，而不是('vue-loader')，不然会报错
```
```
module: { 
    rules: [
    {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
     ]
}
```
```
plugins: [
    new VueLoaderPlugin()
]
```
#### 12、webpack.config.js单独放入文件夹。
目前的webpack.config.js在根目录
  <div align=left>
      <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a24b36cfc01902?w=280&h=207&f=png&s=9999">
  </div>
为了美观，我们把它放到单独的文件夹中
<div align=left>
  <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a24b53452b3689?w=285&h=232&f=png&s=11184">
</div>
这样我们的路径需要发生变化，先配置脚本
<div align=left>
  <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a24b6a76057f95?w=413&h=100&f=png&s=7292">
</div>
再配置出入口
<div align=left>
  <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a24b7ea969b43b?w=329&h=103&f=png&s=11122">
</div>

#### 13、webpack.config.js总结构
<div align=left>
  <img src="https://user-gold-cdn.xitu.io/2019/4/16/16a24bc6594f02f6?w=493&h=302&f=png&s=43127">
</div>

### 结语
零零散散的时间配置了这个webpack，总算是大功告成。可能还有许多不足，欢迎指正。
