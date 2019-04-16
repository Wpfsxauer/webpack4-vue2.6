const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//html分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin')//这个插件的主要作用是实现css分离
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')// 对单独抽离出来的css文件进行压缩。
const VueLoaderPlugin = require('vue-loader/lib/plugin');//VueLoaderPlugin,注意路径一定是('vue-loader/lib/plugin')，而不是('vue-loader')，不然会报错
module.exports = {
  devServer: { // 开发服务器的配置
    port: 3000,
    progress: true, // 编译的进度条
    contentBase: path.join(__dirname, 'assets'), // 以assets目录为默认启动目录
    compress: true, // 自动压缩
    open: true,// 自动打开浏览器
  },
  mode: 'production',  // 默认有两种模式：生产环境production，开发环境development
  entry: './src/main.js', // 入口文件，也就是打包这个js文件
  output: {  // 打包的文件位置
    filename: 'bundle.[hash:8].js', //当js文件更改， [hash]的值会变化，每次build会生成一个新的js文件，[hash:8]，只显示8位的hash值，打包出来当然文件名叫 bundle.js
    path: path.resolve(__dirname, '../jycloud'), //resolve() 可以把相对路径解析成绝对路径， __dirname 是当前目录，路径必须是一个绝对路径，相对于根目录
  },
  plugins: [  // 数组，放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: 'index.html', // 注意路径为根目录下的路径
      filename: 'index.html', // 打包后也叫做 index.html
      minify: {     // 压缩这个html文件(主要是对HTML文件进行压缩)
        removeAttributeQuotes: true,        // 删除这个html文件的双引号
        collapseWhitespace: true      // 变成一行
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'jycloud.css'
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true//是否将插件信息打印到控制台
    }),
    new VueLoaderPlugin()
  ],
  module: { // 模块loader 默认是从右到左，从下到上执行,多个loader需要一个数组，loader是有顺序的，默认是从右向左执行，loader还可以写成 对象方式
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
      },
      {
        test: /\.js$/,  // 找到所有的js文件
        use: {
          loader: 'babel-loader', // 用babel-loader，需要把ES6转换成ES5语法
          options: {
            presets: [ //babel的集合
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
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ]
  },
  performance: {
    hints: false//取消警告提示
  }
}