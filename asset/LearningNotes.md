# 一、Electron的概念

简单来说，`electron`是一款简单，跨平台的桌面应用程序构建框架，其本质是基于 `chromium` 浏览器的内核的嫁接和套壳,同时结合`nodejs`以及处理系统接口的`native api`一起构成的一套跨平台的桌面应用程序框架。

常见涉及到该框架构建的应用软件有: vscode,GithubDesktop，最新版的腾旭QQ等等。


# 二、Electron 流程模型

其本质分为以下进程

## 1. 主进程（Main）
在这个文件环境里面，主要后端的主进程环境，也就是`nodejs`环境，简单来说，你可以调用 `nodejs`里面所有的可用的api接口和模块，比如文件操作的`fs`模块，路径管理的 `path` 模块，等等，故而它可以调用系统级别的`API`接口(`native api`),因为`nodejs`本质对各个系统平台（`Windows`,`Linux`,`Macos`）的 `api` 做了一层封装，也就是说，这种对系统级别的`native api` 的调用是间接借助`nodejs`来完成的。


## 2. 渲染进程（Render）
在这个进程里面主要是基于浏览器的环境，去渲染我们自己写的前端的`html`,`css`以及 `js/ts` 的逻辑，其本质环境是基于`chromium`的，故而也可以看成一个精简的浏览器。而本质就是实际使用时的每个被打开的窗口，也就是说，每打开一个从窗口，就本质是打开了一个`render`进程。


# 三、快速开始

详细参考官方文档：`https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app`


## 1. 确认当前的系统安装的`nodejs`以及`npm` 的版本，一般基本保证最新版即可。

```bash
# 查看nodejs以及npm的版本信息
$ node -v
$ npm -v

```

## 2. 初始化当前项目环境

```bash
# 这一步是创建项目文件夹（可选）
$ mkdir my-electron-app && cd my-electron-app
# 这一步主要是为了创建nodejs开发环境所需的 package.json 包。
$ npm init

```

当以上步骤完成后，记得修改里面的 `author`以及 `description `信息，否则无法完成后续的打包行为，同时在对应的初始化选项的信息输入时，可以一路回车，保持默认选项即可。
但是以下几点还是需要注意的：
 
 - `type`: 默认是 `commonjs`,表示使用 `CommonJS` 模块系统。`CommonJS` 是一种 JavaScript 模块化方案，主要在 `Node.js` 环境中使用。它通过 `require` 导入模块和 `module.exports` 导出模块来组织代码,但是这里我比较推荐将 `type` 设置为 `module`，表示使用最新的 `ES` 模块语法，这样就可以使用 `import`和 `export` 语法了，这在当前最新的模块,但是由于当前我想使用 `ts` ,而由于最终`build`完是`js`文件,故而可以保持为`CommonJS` 即可

当然，以下是我在当前实际使用时的一份配置参考：

```json
// package.json
{
  "name": "electron-ts", // 项目名称
  "version": "1.0.0",  // 项目版本信息
  "description": "a learning template of the electron with the pure ts", // 项目描述，必须要配置，否则可能造成后续无法编译
  "keywords": [
    "eletron",
    "typescript",
    "template"
  ],
  "homepage": "https://github.com/BertramYe/electron-ts#readme", // 项目的主页地址（默认是项目的README文件），如果配置了 git repository 会帮助自动生成
  "bugs": {
    "url": "https://github.com/BertramYe/electron-ts/issues"  // 当前项目的bug的处理提交地址，当配置了git repository的  github 地址时，会帮助自动生成
  },
  "repository": {   // 可以不配置，如果配置，其来自于 git repository 的提示，（如果有最好添加上）
    "type": "git",
    "url": "git+https://github.com/BertramYe/electron-ts.git"  // 具体的 url仓库地址
  },
  "license": "MIT",  // 协议地址
  "author": "BertramYe", // 作者信息，必须配置，否则后续无法完成编译
  "main": "main.ts", // 主进程的入口文件，默认是 index.js, 如果是希望使用 `ts`语法,可以修改为`main.ts` 等等
  "type": "commonjs", // module 代表使用 es6 语法，如果是 commonjs, 代表使用 CommonJS 语法模块，其最大的好处就是，允许 json 文件的直接导入
                    // 这里一定要使用 commonjs，因为electron是基于commonjs的，否则后续在ts文件中导入 preload.js文件时会报错
  "main": "dist/main.js",  // 我们 ts 编译完成的最终的主文件地址
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1" // 表示测试命令，默认情况下，可以保持不变，会自动帮助生成
  }
}

```


## 3. 安装 `electron`
关于 安装很简单，可以直接使用以下命令安装即可，以下会创建 node_modules 文件夹以及安装对应的 `electron` 模块

```bash
# --save-dev 表示开发环境
$ npm install electron --save-dev

```

注意在以上安装时，国内的环境下，可能会有以下报错信息：

```bash
# 以下是对应的主要的报错信息，如下：
npm warn deprecated boolean@3.2.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm error code 1
.....
npm error command failed
npm error command C:\Windows\system32\cmd.exe /d /s /c node install.js
npm error RequestError: socket hang up
npm error     at ClientRequest.<anonymous> 
....
npm error     at Object.onceWrapper (node:events:628:26)
npm error     at ClientRequest.emit (node:events:525:35)
npm error     at origin.emit 
.....

```
对于以上的报错，其最终解决方案如下：

```bash
# 首先使用以下命令，修改当前的npm镜像地址 
$ npm config edit
# 其修改内容如下，并添加上对应的 electron 的镜像地址
registry=https://registry.npmmirror.com/
electron_mirror=https://cdn.npmmirror.com/binaries/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/

# 接着删除当前项目安装失败生成的 node_modules 文件夹，并使用一下命令清除缓存后，重新安装即可
$ npm cache clean --force   # 清除缓存
$ npm install electron --save-dev    # 重新安装
```

## 4. 配置 typeScript 的环境

注意：由于以上的安装过程中所涉及的只是在传统环境下的`JavaScript`的语法去运行和开发 `Electron`项目，但是我们的目的是让能在 `typescript` 环境下，进行开发（因为我们在最初初始化入口文件时，指定的是`main.ts`），所以，我们需要做以下配置去完成 `typescript` 的生产环境的创建

### a. 安装对应的包文件

```bash
# 为了引入对TypeScript的支持，需要使用以下命令，安装 TypeScript
$ npm install typescript @types/node  @types/electron --save-dev
```

### b. 创建 `tsconfig.json` 文件，配置 TypeScript 编译选项

```ts
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",                       // 设置编译目标为 ES6
    "module": "CommonJS",                  // 这里使用 CommonJS 模块而不是 ES6 模块，是因为需要保持与 `package.json` 的 type 模块需要与这个参数保持一致
                                           // 另外，这里使用 CommonJS 原因是在于，如果使用 ES6 模块，会导致后面在导入 预加载文件 preload.js 时会报错
    "strict": true,                        // 启用严格模式
    "esModuleInterop": true,               // 使得 CommonJS 与 ES Module 兼容
    "skipLibCheck": true,                  // 跳过库文件检查，提高编译速度
    "outDir": "./dist",                    // 编译后的 JavaScript 输出目录
    "rootDir": "./src",                    // TypeScript 源代码目录
    "baseUrl": ".",                        // 基本路径
    "resolveJsonModule": false             // 不允许导入 .json 文件，但是如果以上的 "module" 设置为了 "ES6" 时，此时，需要将此处设置为false，不允许直接导入json文件，因为是完全严格的nodejs环境，需要借助nodejs的 fs 模块读取和导入 json 文件了,否则设置为true，允许直接在js文件中，导入json模块
  },
  "include": [
    "src/**/*"                             // 包含 src 目录下的所有文件
  ]
}
```
注意： 对于以上的配置中的 `module` 我们设置成了 `CommonJS`,这表示我们使用的是  CommonJS 模块，在导入方法或者模块时主要借助 原始的 `require`,也就是说，当我们在下面使用 `npm run build` 时，会将 `main.ts` 中的 `ES6` 的 `import/export` 转化为 `require/module.exports`,这对于当前现代化的新技术的使用时，感觉不是很推荐，此处完全可以将其设置为 `ES6` 代表使用 最新的 `ES` 语法，并使用 `import/export` 导入和导出模块，并且，此时我们 `npm run build` 时，不会将 `main.ts` 中的 `ES6` 的 `import/export` 转化为 `require/module.exports`，**但是，由于后面的 `preload`预加载文件的导入只能是 `CommonJS` 模块的方式，所以最终此处的 `module` 只能被设置为 `CommonJS`,而不能设置为`ES6`**

同时，以上的 `module` 配置，需要和 `package.json` 文件中的 `type` 保持一致，简单来说，如果以上的`tsconfig.json`文件中的 `module` 设置为了 `ES6`,则此时的`package.json` 文件中 `type`需要设置为`module`,而如果以上的`tsconfig.json`文件中的 `module` 设置为了 `CommonJS`，则此时的`package.json` 文件中 `type`需要设置为`commonjs`.

另外，当使用 `ES6` 语法时，其不允许直接导入`json`文件，因为是完全严格的`nodejs`环境，需要借助`nodejs`的 `fs` 模块读取和导入 `json` 文件了,故而以上的`tsconfig.json`文件中的 `resolveJsonModule` 要设置为 `false`,否则编译时会报错。


对于以上的配置，对于未来的工程文件的结构如下：

```bash
my-electron/
├── src/
│   ├── main.ts       # Electron 主进程文件
│   ├── preload.ts    # Electron 预加载文件，用于进程间的通信
|   └── pages   # 渲染进程文件夹
|       ├── renderer.css    # 渲染样式css文件
|       ├── renderer.html   # 渲染进程的页面html文件
|       └── renderer.ts     # 渲染进程ts文件
├── dist/             # 编译后的 JavaScript 输出目录
├── package.json
└── tsconfig.json     # TypeScript 配置文件

```




## 5. 创建第一行代码，并启动


### a. 创建主进程代码文件 `main.ts`

如果是传统的开发，非 `typescript`环境下，直接可以在当前项目文件下创建对应的 `main.js` 入口文件即可，
但是由于我们当前是在 `typescript`环境下，我们可以在当前项目文件夹下，创建一个 `src`文件夹，并在里面创建一个 `main.ts` 文件，其内容可以如下：

```ts
// app 是当前项目的主对象，类比 Vuejs 的 app
// BrowserWindow 是用于创建 应用的单个页面的，其中 每 new 一个 就会创建一个单独的 rander 进程
// 关于BrowserWindow的所有配置项可以参考： https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions

// 将初始化创建窗口的逻辑直接封装为一个完整的 createWindow 函数即可
const createWindow = () => {
    const win = new BrowserWindow({
        width:800, //  程序主页面的 宽度，单位 px
        height:600, // 程序主页面的 高度，单位 px
        x:0,  // 程序启动的坐标位置 x
        y:0,  // 程序启动的坐标位置 y
        autoHideMenuBar:true,  // 关闭 electron 窗口自带的菜单栏
        alwaysOnTop:true,     // 让程序永远保持最上层
        webPreferences:{
            devTools:true, // 允许打开开发者工具
            // 关闭上下文隔离
            // contextIsolation: false,
            // 为页面集成 Node.js 环境
            // nodeIntegration: true,
            // 由于当前是在ts环境中，所以这里一定要使用 process.cwd() 而不能使用 __dirname,因为这个变量在 ts 中没有定义
            preload: path.join(process.cwd(), "dist",'preload.js'),  // 指定 preload.ts 预加载脚本的文件地址，注意这里一定要使用绝对路径
        }
    })
    // 默认加载的页面，也可以是其他地址，如： https://baidu.com, 这会在其内部直接渲染 baidu 的主页面,
    // 这对于很多套壳应用的开发，非常有用
    win.loadURL('/')
    win.webContents.openDevTools()   // 打开开发者工具，这个函数只有在上面 devTools 设置为了 true 才生效
    const loadedwin = win as any
    loadedwin.loadFile('./src/pages/render.html'); // 加载 html 的内容
    // 另外需要注意的是，如果是多个文件页面资源，或者简单来说 进程 渲染需要进行加载，
    // 那么此时就需要像下面这样，一个一个的手动去做对应的加载
    // 加载其他页面的 html 的内容，而如果是像使用的是 SPA 的框架（如Vue/React等），由于其本质就只有一个 html 文件内容，里面不断有对应的组件模块的加载，此时就只用加载这个唯一的最上层html文件的 root 节点即可，由此可见使用这个框架，也会对当前 Electron项目是一巨大的优化（这个已经是当前技术的主流，至于如何做，后面会做简单描述）
    loadedwin.loadFile('./src/pages/render1.html'); 
}


app.on('ready',()=>{
    // 创建主窗口
    createWindow()

    //  添加这个监听是为了保证苹果系统在被关闭主窗口后，能正常创建重新创建窗口
    //  "activate" 事件一般只有在 MacOS 里面才有
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// 以下监听的添加是为了区分MacOS系统的启动问题
app.on('window-all-closed', () => {
    // 表示非 mac 系统环境下的整个 electron 程序退出时，能正常退出
    // darwin 是 macOS 系统的标志
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


```

另外对于其他文件如下：

```html
<!-- render.html 页面的内容文件 -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 解决网页内容安全策略问题 CSP Content-Security-Policy -->
    <!-- 以下表示： 一个网站管理者想要所有内容均来自站点的同一个源（不包括其子域名）。 -->
    <!-- 当然你也可以定义只信任某个域名的内容 -->
    <!-- 具体参考： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP -->
    <!-- 具体参考：https://electronjs.org/docs/tutorial/security -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';" />
    <!-- 
      以上的 Content-Security-Policy 配置是为了解决 以下这个报警的错误提示：
      VM4 sandbox_bundle:2 Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
      Policy set or a policy with "unsafe-eval" enabled. This exposes users of
      this app to unnecessary security risks.
      For more information and help, consult
      https://electronjs.org/docs/tutorial/security.
      This warning will not show up
      once the app is packaged.
     -->
    <title>Home page</title>
    <link rel="stylesheet" href="./render.css">
</head>
<body>
    <div class="tip">
        hello, this is the Home page !!!
    </div>
    <button id="test">click</button>
    <!-- 注意，以下的js文件应该指定为我们编译完成的 js 文件，而不是我们在代码中写的 ts 文件路径 -->
    <script  src="../../dist/pages/render.js"></script>
</body>
</html>

```

其中样式文件简单配置如下
```css
/* render.css 样式文件*/
.tip {
    color: red;
}

```

以下这里对应的是 `render.ts` 进程的渲染文件
```ts
// render.ts 进程的渲染文件
const btn = document.querySelector('#test')

btn?.addEventListener('click',()=>{
    alert('this is the test click!')
})

```



并且需要在 `package.json` 文件中的 `script` 中添加一行 electron 的项目启动命令

```json
//package.json
......
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron .",  // 添加一行项目启动
    // 如果是在TypeScript的开发环境中还需要添加以下这项
    "build": "tsc",                // 编译 TypeScript 代码
}
......
```

### b. 项目的运行和启动

最后，可以使用以下命令启动项目：

首先，对于正常的`javascript`的项目环境中启动可以使用以下方式：
```bash
# 启动当前 electron 项目
$ npm run start
```
其次，如果是按照以上配置添加的 `Typescript`的开发环境，有以下主要两种方式启动

#### 方式一：手动将 ts 文件编译为对应的 js 文件后，再启动(推荐在实际开发完成后，准备编译时，即可)
```bash
# 手动编译后启动
$ npm run build
$ npm run start
```

#### 方式二：直接热启动（推荐在开发过程中使用此种方式，因为可以避免多次重启）

但是热启动需要手动添加`dev`的热启动配置，但是如果像下面这种在 `package.json` 中添加 如下 `dev` 配置，是无法做到，实时的热启动更新的

```json
// package.json
....
"scripts": {
   .....
   "dev": "tsc && electron . --watch",   // 开发模式，实时编译 TypeScript 代码,此种添加时无法做到实时编译
   .....
}
....
```

为此，解决方案有，可以利用 `concurrently`，`pm2` 以及 `nodemon` 帮助实时监控和配置,

如果使用 `concurrently`,需要手动安装后，将以上配置修改为：
```bash
# 先安装 concurrently
$ npm install concurrently --save-dev

# 再将以上的 package.json 内容修改为
"dev": "concurrently \"tsc --watch\" \"electron .\""

# 最后可以做到实时的ts的监控修改
$ npm run dev

```

但是以上使用 `concurrently` 实现的热更新，有个不好的地方就是，只能监控到 当前的 `ts` 文件的改动，为此，比较推荐的是使用 `nodemon`，像下面这样监控所有的文件改动

```bash
# 安装 nodemon
$ npm install nodemon --save-dev

# 再将以上的 package.json 内容修改为如下，表示监控 src --ext ts,html,css 下，所有的 ts,html,css 文件的改动，当出发保存是，就会自动重新编译和重启
"dev": "nodemon --watch src --ext ts,html,css --exec electron ."

# 最后启动并监控左右文件的改动
$ npm run dev
```
或者在当前项目下创建一个 `nodemon.json` 文件来配置以上的改动

```json
// nodemon.json 配置信息如下
{
    "ignore":[ // 忽略下面这两个文件夹的内容变化的监控
        "node_modules",  
        "dist"
    ],
    "restartable":"r",
    "watch":[ // 监控当前项目下的所有文件
        "*.*"
    ],
    "ext": "html,ts,css"  // 指定对应拓展名文件的改动的变化会发生重新编译和重启行为
}

```
但是当你配置了以上的 `nodemon.json` 文件后，需要将以上的 `package.json` 文件里面的 `dev` 热启动命令修改为如下：

```json
// `package.json` 里面的 热启动 dev 修改为如下 
....
"dev": "nodemon --exec electron ."
....

```

另外，注意：如果在控制台上出现以下的消息提醒是正常现象，可以直接忽略：

```bash
# 以下的警告提醒是正常现象，可以忽略掉
[2520:0216/173018.415:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[2520:0216/173018.415:ERROR:CONSOLE(1)] "Request Autofill.setAddresses failed. {"code":-32601,"message":"'Autofill.setAddresses' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)

```

详细运行结果如下：

![alt text](./asset/image/image.png)


## 6. 进程间的通信

简单来说，由于主进程（`main.ts`）是在 `nodejs` 环境中，而渲染进程(`render.ts`)是在浏览器环境下，所以，由于它们之间的运行环境是隔离的，
故而无法做到直接的进行通信和传值，为此需要有一个通信的中间件，而在electron中，这个通信的中间件就是 与预加载脚本（`preload.ts`），另外需要注意的是，

 - 1）预加载脚本是在渲染进程上运行的，也就是,在客户端浏览器上运行的，此时可以类比为网页开发的中间件。
 - 2）虽然预加载脚本是在渲染进程上运行的，但是它也能访问部分 `nodejs` 的API。

而这个预加载脚本的核心就是，消息的订阅发布模式的实现，而这种常见的通信模式就是主要以下几种。
另外，学过 Vue、React的，可以简单类比为，主进程是父组件，而渲染进程是子组件，这样就可以很好的理解通透了

所以一个简单的结构如下:

  **主进程(main.ts) <-----> 预加载脚本 (preload.ts ) <-------> 渲染进程 (render.ts)**

同时,需要注意的是，在整个 electron 的启动和渲染过程中,其整个程序的加载循序是：
  
  - 首先，加载主进程(main.ts)，
  - 接着，加载 预加载脚本 (preload.ts )，
  - 最后，才加载最后的 渲染进程 (render.ts).

另外，在开始配置预加载 `preload.ts` 文件 之前，需要在 `main.ts` 文件里面的`webPreferences`配置里面添加 `preload.ts` 被编译完的最终的js文件(`preload.js`)的绝对路径,详细，可以参考我上面最初的 `main.ts` 文件.

以下是所有核心的代码文件如下：

```html
<!--   -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 解决网页内容安全策略问题 CSP Content-Security-Policy -->
    <!--  当然你也可以定义只信任某个域名的内容 -->
    <!-- 具体参考： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP -->
    <!-- 具体参考： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP -->
    <!--  以下表示： 一个网站管理者想要所有内容均来自站点的同一个源（不包括其子域名）。 -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';" />
    <title>Home page</title>
    <link rel="stylesheet" href="./render.css">
</head>
<body>
    <div class="tip">
        hello, this is the Home page !!!
    </div>
    <button id="test">click</button>

    <div>
        <!-- 根据用户的输入，在后台创建对应文件： 模拟渲染进程借助 预加载文件，向主进程发送信号进行通信-->
        <input type="text" id="inputValue">
        <button id="createBtn">create file</button>
    </div>
    <div>
        <!-- 触发以上创建的读取文件行为： 模拟渲染进程借助 预加载文件，向主进程发送信号进行通信 -->
        <button id="readBtn">read file</button>
    </div>

    <!-- 这里一定要指定为编译完成后的 js 文件，而不能时 ts 文件 -->
    <script  src="../../dist/pages/render.js"></script>
</body>
</html>
```


修改后的渲染进程（`render.ts`）代码如下：

```ts
// render.ts
const btn = document.querySelector('#test')

btn?.addEventListener('click', () => {
    alert('this is the test click!')
})

// 以下是为了掩护渲染进程
// 由于当前环境是在渲染进程（前端环境）中，简单来说也就是 浏览器环境，故而此时不可以直接调用 nodejs 主进程的接口和环境
// 西面可以看到正常的打印，因为是来自于 preload.ts 的内容

const api = (window as any).abc
console.log('abc', api)
const input = document.querySelector('#inputValue')
const createBtn = document.querySelector('#createBtn')
createBtn?.addEventListener('click', () => {
    const inputValue = (input as HTMLInputElement).value
    // alert(`value: ${inputValue}`)
    api.save_file(inputValue)
})

//  向主进程发送信号，读取后端内容
const readBtn = document.querySelector('#readBtn')
readBtn?.addEventListener('click', async () => {
    console.log('clcki read')
    //  注意由于在 preload 里面使用的异步方法，所以这里也应该是个异步方法
    const file_content = await api.read_file()
    alert(file_content)
})


// 模拟当 render 进程函数加载完成后，主程序利用perload主动向渲染进程发送信号
// 定义一个获取从主进程发送过来的数据信息，
const get_data_from_main  = (event:any,data:{sayhi:string}) => {
    console.log('data from main',data.sayhi) 
}

// 这里面将get_data_from_main作为callback函数传给 preload 的 onMessage 方法
api.onMessage(get_data_from_main)



```




修改后的主进程（main.ts）代码如下：

```ts
// main.ts



import { app,BrowserWindow,ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
// import { detect,detectFileSync } from 'chardet' // chardet 可以用于检测文件的编码类型

// 为了方便，最好是在 dist 文件夹下，或者 src 文件夹下创建，否则打包运行时，会出问题，
// 因为在被打包时，asar 内的文件夹结构已经固定，不可以进行改动，从而会出现报错 
// path.dirname(app.getAppPath()) 获取当前所在的软件目录的上一层目录，因为 getAppPath() 获取到的 app.asar 目录是被加密的，根本没办法写入新的文件或者修改文件
// app.getPath('exe') 获取当前安装的执行文件的路径
// process.cwd() 表示当前项目的运行目录，这一点比较推荐使用，而对于其他所有的 文件编辑，都推荐使用这种方式
const test_path = path.join(process.cwd(),'test/hello.txt') 

const Hanlde_to_save_data = (event:any,data:string) => {
    const dirPath = path.dirname(test_path);
    if (!fs.existsSync(dirPath)) {
       fs.mkdirSync(dirPath, { recursive: true });  // 创建文件夹，如果文件夹不存在
    }
    fs.writeFileSync(test_path,data,{
        encoding:'utf-8', // 这一步是为了解决信道传输中文时的乱码问题
    })
}


const Handle_to_read_file = (event:any)=> {
    if(fs.existsSync(test_path)){
        // const decodeType = detectFileSync(test_path) // 检测文件的编码类型
        // const decodetype = detect(fileBuffer)
        const file_content = fs.readFileSync(test_path,'utf-8').toString(); // 读取指定文件的内容
        return file_content
    }else{
        return `file not existed in the path : ${test_path}`
    }
    
}

// 将初始化创建窗口的逻辑直接封装为一个完整的函数即可
const createWindow =  () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        x:0,
        y:0,
        autoHideMenuBar:true,
        alwaysOnTop:false, // 为了保证弹窗能正常显示，这里最好设为 false
        webPreferences:{
            devTools:true, // 允许打开开发者工具
            // 关闭上下文隔离
            // contextIsolation: false,
            // 为页面集成 Node.js 环境
            nodeIntegration: true,
            // 为了后续的编译和读取，最好这里使用 app.getAppPath() 来获取当前程序运行所在的目录
            preload: path.join(app.getAppPath(), "dist/preload.js"),  // 指定 preload.ts 预加载脚本的文件地址，注意这里一定要使用绝对路径
        }
    }) ;
    // win.loadURL('https://baidu.com')
    // win.loadURL('/')
    win.webContents.openDevTools()   // 打开开发者工具
    const loadedwin = win as any
    // 在渲染之前订阅 preload 发送过来的频道信息
    // to_save_data 是指定的频道
    // Hanlde_to_save_data 是指定的方法
    ipcMain.on('to_save_data',Hanlde_to_save_data);

    // 处理 preload 调用当前主进程的方法
    (ipcMain as any).handle('read_file_content',Handle_to_read_file);

    // 以下是主进程直接向渲染进程传递消息
     // 主进程向渲染进程发送消息
    win.webContents.on('did-finish-load', () => {  // 由于主进程最先渲染，同时目标渲染进程最后才渲染，所以需要先等整个程序加载完，主进程才能给渲染进程发送信号
        win.webContents.send('message-from-main', { sayhi: 'Hello from main!' });
    })
    loadedwin.loadFile('./src/pages/render.html'); // 加载 html 的内容 
}


app.on('ready',async()=>{
    // 创建主窗口
    createWindow()

    //  添加这个监听是为了保证苹果系统在被关闭主窗口后，能正常创建重新创建窗口
    //  "activate" 事件一般只有在 MacOS 里面才有
    app.on('activate', async() => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// 以下监听的添加是为了区分MacOS系统的启动问题
app.on('window-all-closed', () => {
    // 表示非 mac 系统环境下的整个 electron 程序退出时，能正常退出
    // darwin 是 macOS 系统的标志
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// 以下是为了演示一些进程通信
// 由于当前是在主进程，简单来说就是nodejs环境，所以，以下的打印是可以的
console.log("__dirname",__dirname)



```

其中根据以上的全部代码，可以简单分为以下常用的几种通信方式，
其核心的本质就是：**将 `preload`预加载脚本作为中间件，将消息的 `发布者`和`订阅者`这两个角色，在主进程`main.ts` 和渲染进程`render.ts` 之间玩`角色扮演`.**

### a. 主进程向渲染进程的通信
其实很简单,
但是，这里的实现需要注意的是要先等到 `渲染进程render.ts` 页面加载完成后，`主进程 main.ts`才能向`渲染进程render.ts`发送信号，
因为整个项目的启动永远都是，**先加载主进程，再加载预加载脚本，最后才加载渲染进程**，所以当渲染进程没有加载完成，那么主进程向渲染进程发送信号时，就失去了意义。

而对于以上的实现代码主要在以下几点：

同时在下面代码中，`did-finish-load` 是electron内置的信号，表明整个项目文件加载完成了，故而此时其 `渲染进程 render.ts` 中的所有的代码文件以及html一定加载完成了，
所以此时 主进程 利用 `message-from-main` 频道向外广播才会有效
```ts
// main.ts
....
// 以下是主进程直接向渲染进程传递消息
// 主进程向渲染进程发送消息,
win.webContents.on('did-finish-load', () => {  // 由于主进程最先渲染，同时目标渲染进程最后才渲染，所以需要先等整个程序加载完，主进程才能给渲染进程发送信号
    win.webContents.send('message-from-main', { sayhi: 'Hello from main!' });
})
....
```

另外，此时可以利用 `预加载文件preload.ts` 接受来自 `主进程 main.ts` 的 `message-from-main` 发送过来的信息，并转发给其 `渲染频道 render.ts`

```ts
// preload.ts

// 直接利用 contextBridge 像浏览器环境中暴露对象或者数据
// 下面这种暴露方式会将数据挂载在 render.ts (浏览器环境中的 windows 对象上，故而可以直接通讯)
// 下面的 abc 是作为主键，会挂载到render进程的 windows 上面
contextBridge.exposeInMainWorld('abc',{
    .....
    // 这里定义的函数是用于监听主进程利用 message-from-main 频道发来的信号，
    // 再接受渲染进程上传过来一个callback函数，从而能让渲染进程获取到主进程发来的信息
    // 从而完成从主进程主动向渲染进程发送信息的这个流程
    onMessage: (callback:(event:any,data:{sayhi:string})=>void) => {
        console.log('call the infrom on preload')
        ipcRenderer.on('message-from-main', callback)
    },
    ....
}) 


```
最后，在`渲染进程 render.ts`中调用 `与加载文件 preload.ts` 中的 `onMessage` 方法，并上传一个 `callback`函数，从而能接收到来自 `主进程 main.ts`传过来的参数  

```ts
// render.ts

.....
// 模拟当 render 进程函数加载完成后，主程序利用perload主动向渲染进程发送信号
// 定义一个获取从主进程发送过来的数据信息，
const get_data_from_main  = (event:any,data:{sayhi:string}) => {
    console.log('data from main',data.sayhi)  // 此时可以打印出 主进程上传过来的参数 `Hello from main!`
}
// 这里面将get_data_from_main作为callback函数传给 preload 的 onMessage 方法
api.onMessage(get_data_from_main)
.....

```


### b. 渲染进程向主进程之间的通信

这个相比较于以上的 父（`主进程main.ts`）传 子（` 渲染进程render.ts`），这个模式，其实就是一种变相的 子传父的形式，换句话说，就是消息的发布者和订阅者相互转换位置而已，其实现可以简单归纳为如下：

假设有一个场景：就是后端（主进程）需要保存来自前端（渲染进程）用户输入的文字信息，此时就是一个典型的渲染进程向主进程之间的通信模式

```html
<!-- render.html -->
...
<div>
    <!-- 以下的输入框模拟用户的输入以及点击保存操作  -->
    <input type="text" id="inputValue">
    <button id="createBtn">create file</button>
</div>
....

```
如下`渲染进程render.ts`中，当用户点击后触发 `预加载文件 preload.ts` 里面的方法，并通过这个方法将用户输入的值传给 preload 里面的 `save_file` 方法

```ts
// render.ts 
....
const input = document.querySelector('#inputValue')
const createBtn = document.querySelector('#createBtn')
createBtn?.addEventListener('click', () => {
    const inputValue = (input as HTMLInputElement).value
    api.save_file(inputValue)  
})

```


而在 `预加载文件preload.ts` 中，当 `save_file` 方法被调用时，将其接收到的来自 渲染进程上传过来的 data 参数后，在通过 `to_save_data` 频道，发送给 `main.ts 主进程` 

```ts
// preload.ts
.....
contextBridge.exposeInMainWorld('abc',{
    ....
    save_file:(data:string) => {
        console.log('data',data);
        ipcRenderer.send('to_save_data',data)  // 这里 preload 利用 ipcRenderer 向主进程发送信息，其中 to_save_data 是频道，data 是对应的需要发送的值
    },
   ....
}) 

```

由于主进程通信上已经做了来自 `to_save_data` 频道的监听，所以此时，会接收到来自 与加载文件中通过这个频道发送来自渲染进程的信息，从而可以保存在 `./test/hello.txt` 文件中
```ts
// main.ts
...

// 为了方便，最好是在 dist 文件夹下，或者 src 文件夹下创建，否则打包运行时，会出问题，
// 因为在被打包时，asar 内的文件夹结构已经固定，不可以进行改动，从而会出现报错 
// path.dirname(app.getAppPath()) 获取当前所在的软件目录的上一层目录，因为 getAppPath() 获取到的 app.asar 目录是被加密的，根本没办法写入新的文件或者修改文件
// app.getPath('exe') 获取当前安装的执行文件的路径
// process.cwd() 表示当前项目的运行目录，这一点比较推荐使用，而对于其他所有的 文件编辑，都推荐使用这种方式
const test_path = path.join(process.cwd(),'test/hello.txt') 

const Hanlde_to_save_data = (event:any,data:string) => {
    const dirPath = path.dirname(test_path);
    if (!fs.existsSync(dirPath)) {
       fs.mkdirSync(dirPath, { recursive: true });  // 创建文件夹，如果文件夹不存在
    }
    fs.writeFileSync(test_path,data,{
        encoding:'utf-8', // 这一步是为了解决信道传输中文时的乱码问题
    })
}

.....
ipcMain.on('to_save_data',Hanlde_to_save_data);
...

```

至此,以上就完成了从`渲染进程 render.ts`到 `主进程 main.ts` 之间的相互通信.




### c. 主进程和渲染进程的相互通信
这个比较最常见，实际上是对以上 介绍的两种通信的糅杂，而在实际运用时，当前这种相互通信的方式，其实是最常见的
为了演示，以下是承接上面 `渲染进程向主进程之间的通信` 场景里，当完成的来自前端渲染进程用户上传的信息在主进程的保存后，
我们结合以上的基础上，直接前端用户点击读取我们保存的内容即可，
为此详细实现如下:

在渲染进程的页面上`render.html`创建一个按钮，读取来自后端主进程保存的`./test/hello.txt`中的信息
```html
<!-- render.html -->
...
<div>
    <!-- 在渲染进程的页面上 创建一个按钮，读取来自后端 主进程保存的信息-->
    <button id="readBtn">read file</button>
</div>
....

```

当以上创建的按钮被点击后，触发来自 `预加载文件 preload.ts` 中自定义的`read_file` 方法，获取来自后端`主进程 main.ts`的数据，并显示

```ts
// render.ts
...
//  向主进程发送信号，读取后端内容
const readBtn = document.querySelector('#readBtn')
readBtn?.addEventListener('click', async () => {
    console.log('clcki read')
    //  注意由于在 preload 里面使用的异步方法，所以这里也应该是个异步方法
    const file_content = await api.read_file()
    alert(file_content)
})
....

```

其中 `预加载文件 preload.ts` 中的 `read_file` 方法如下，它主要是利用 `invoke` 方法向`read_file_content`频道触发信号

```ts
// preload.ts
contextBridge.exposeInMainWorld('abc',{
    ....
    read_file:async () => {
        console.log('call the read files');
        // 注意由于 invoke 返回的是一个 promise 对象，所以这里需要异步转换
        const file_result = await (ipcRenderer as any).invoke('read_file_content');  // 这里 preload 利用 ipcRenderer 向主进程发送信息，其中 read_file_content 是频道，用于调用主进程的方法
        console.log('file_result',file_result)
        return file_result
    },
    ...
}) 
```

其中，在主程序中，使用如下代码，即利用 `handle` 方法处理来自 以上 `invoke` 发送过来的信号，
从而调用对应的主程序中的`Handle_to_read_file` 方法，并将该方法的返回值，返回给以上 `预加载文件preload.ts` 的 `invoke`方法，最终可以让用户读取到我们之前保存的文本内容

```ts
// main.ts

// process.cwd() 表示当前项目的运行目录，这一点比较推荐使用，而对于其他所有的 文件编辑，都推荐使用这种方式
const test_path = path.join(process.cwd(),'test/hello.txt') 

const Handle_to_read_file = (event:any)=> {
    if(fs.existsSync(test_path)){
        // const decodeType = detectFileSync(test_path) // 检测文件的编码类型
        // const decodetype = detect(fileBuffer)
        const file_content = fs.readFileSync(test_path,'utf-8').toString(); // 读取指定文件的内容
        return file_content
    }else{
        return `file not existed in the path : ${test_path}`
    }
    
}
...
(ipcMain as any).handle('read_file_content',Handle_to_read_file);
...

```

至此以上，完美的模拟了 `主进程 main.ts` 与 `渲染进程 render.ts` 之间的相互通信。


# 四、编译和打包 eletron 项目，生成 exe 文件

首先，目前主流的 electron 项目文件的打包方式，主要是以下四种：
  - 1. `Electron Builder`：它是目前最流行的 Electron 打包工具之一，支持多种平台和构建选项。它能将 Electron 应用打包成可执行文件，并支持自动更新等功能。 
  - 2. `Electron Packager`: 它是一个较为简单的 Electron 应用打包工具，适用于需要快速打包应用的开发者。它的配置选项较少，主要用于打包成可执行文件。
  - 3. `Electron Forge`: 是一个全功能的工具链，除了打包外，它还提供了 Electron 应用的创建和开发流程。它支持 Electron Builder 和 Electron Packager，也提供了构建和自动更新的功能。
  - 4. `Electron Updater`: 如果你想要为你的 Electron 应用提供自动更新功能，可以使用 electron-updater 与 electron-builder 配合。

目前，最推荐和使用的是 `Electron Builder` 来打包，以下的演示是使用 `Electron Builder` 进行的打包,详细操作如下：

## a. 安装打包工具 `electron-builder`

```bash
# 可以使用以下命令安装 electron-builder
$ npm install electron-builder --save-dev
```

## b. 配置打包所需的配置文件：
其实就是修改当前 `eletron` 项目的 `package.json` 文件，修改里面的 `build` 命令以及对应的信息，修改后的完整信息如下：

```json
// package.json

{
  "name": "electron-ts",
  "version": "1.0.0",
  "description": "a learning template of the electron with the pure ts",
  "keywords": [
    "eletron",
    "typescript",
    "template"
  ],
  "homepage": "https://github.com/BertramYe/electron-ts#readme",
  "bugs": {
    "url": "https://github.com/BertramYe/electron-ts/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/BertramYe/electron-ts.git"
  },
  "license": "MIT",
  "author": "BertramYe",
  "type": "commonjs",
  "main": "dist/main.js",
  "scripts": {
    "start": "electron .",
    "build": "tsc && electron-builder",  // 表示先编译，后进行打包
    "dev": "tsc &&  nodemon --exec  electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "build": {
    "appId": "com.electron.ts",
    "productName": "electron-ts",
    "icon": "./asset/log.png", // 这里设置，表示所有平台的应用图标打包好都是一样的，同时 electron-builder 会自动帮助将当前的png文件转化为 ico 文件
    "directories": {
      "buildResources": "./dist",  // 打包的源代码所在的文件夹，也就是我们 TypeScript 编译好的文件夹
      "output": "release" // 最终编译好后的 exe 所在的文件夹地址
    },
    "asar": true, // 设置为 true 可以把自己的代码合并并加密
    "win": {  // 构建的目标程序为 windows 平台
      "target": "nsis" // 构建为 exe 文件 
    },
    "nsis": {
      "oneClick": false, // 禁用一键安装，启用安装向导
      "allowToChangeInstallationDirectory": true, // 允许用户选择安装目录
      "perMachine": true,// 将应用安装到机器级别（所有用户可用）, 表示安装程序是在机器级别运行，意味着安装程序将安装到机器上，而不仅仅是当前用户。这通常意味着安装路径将设置为机器级别的位置，而不是用户的 AppData 或 Program Files 等地方。preMachine: true 通常用于管理员权限安装，适用于需要为所有用户安装应用的场景。
      "createDesktopShortcut": true, // 是否在桌面创建快捷方式，这里设为 true,用户安装完，会在最终页面显示一个是否在桌面创建快捷方式的选项图标
      "createStartMenuShortcut": false, // 是否创建启动菜单的快捷键图标，这里其实没必要
      "runAfterFinish": false  // 是否安装完立即启动，这里最好默认别这么做，对用户来说，并不友好
    },
    "mac": {
      "target": "dmg", // 这一行表示在打包时为 macOS 生成一个 .dmg 格式的安装包, .dmg（Disk Image）是 macOS 上常见的安装包格式，用户可以通过双击该文件来挂载磁盘映像并进行应用安装。
    },
    "dmg": {
      "title": "eletron-ts", // 这里指定 MacOS 平台的 应用名称
      "background": "./asset/log.png", // 应用的背景图片，可以不设置
      "iconSize": 100, // 图标大小
      "format": "ULFO",  // `.dmg` 文件格式，通常为 `ULFO`, ULFO 是 UDZO 格式的一种变体。它指的是 Ultra Compression 压缩格式，这种格式能够以较小的文件大小提供快速的压缩和解压速度。
                          // 另外还有一种 UDZO（Ultra Disk Image）是 macOS 中最常用的磁盘映像格式之一，它提供了一个平衡的文件压缩方式，使得 .dmg 文件的大小适中，并且在解压时速度很快。
      "window": {
        "x": 400,  // `.dmg` 窗口的起始 X 坐标
        "y": 300,  // `.dmg` 窗口的起始 Y 坐标
        "width": 600,  // `.dmg` 窗口的宽度
        "height": 400  // `.dmg` 窗口的高度
      }
    },
    "linux": {
      "target": [ "AppImage" ],  // 这里可以设置生成 AppImage、deb 和 rpm 包，但是比较推荐 .AppImage 格式的可执行文件。AppImage 是一种独立于发行版的 Linux 应用程序格式，可以在大多数 Linux 发行版上运行，而无需依赖特定的包管理器或安装过程。
      "maintainer": "BertramYe <bertramyerik@gmail.com>", // 包维护作者的信息，这个也可以在最上面去设置
      "category": "Utility", // 类别，用于 deb 和 rpm 包
      "compression": "maximum" //  // 压缩类型，这里表示最小压缩
    },
    "files": [ // 由于上面设置了"asar": true, 而这个 files 就是指定将哪些文件压缩和编译到 asar 压缩包里面
      "./dist/**/*", // 编译好的所有的 js 文件
      "./src/pages/*.html", // 由于 tsc 只会编译 ts 文件，故而在 dist 只包含了 编译好的 js 文件，但是缺失 html 和 css 文件，故此这里需要我们手动指定
      "./src/pages/*.css",
      "./asset/log.png"   // logo 资源文件夹
    ]
  },
  "devDependencies": {
    "@types/electron": "^1.4.38",
    "@types/node": "^22.13.4",
    "chardet": "^2.0.0",
    "electron": "^34.2.0",
    "electron-builder": "^25.1.8",
    "nodemon": "^3.1.9",
    "typescript": "^5.7.3"
  }
}



```

## c. 最终使用以下命令直接打包即可

注意，以下的 build过程取决于外网的镜像，但是，我们之前已经在`npm` 中配置了`electron` 所需的国内镜像地址，会加快 electron 的安装以及 build 的速度，如下：

```bash
# 以下在 npm config 中添加的国内的镜像地址，会加快 electron 的安装以及 build 的速度
registry = "https://registry.npmmirror.com/"
electron_builder_binaries_mirror = "https://npmmirror.com/mirrors/electron-builder-binaries/"
electron_mirror = "https://cdn.npmmirror.com/binaries/electron/
```

使用以下命令可以快速打包

```bash
#  注意由于以上我同时配置了 windows， mac， 以及 linux 三个平台，所以，如果直接运行以下命令，会同时打包出三个平台对应的安装包
$ npm run build

# 同时我们为了缩小打包体积，也可以打包指定平台的安装包，如下：

# 只构建以上配置的 windows 平台的安装包
$ npm run build --win

# 只构建以上配置的 MacOS 平台的安装包
$ npm run build --mac

# 只构建以上配置的 Linux 平台的安装包
$ npm run build --linux


```









