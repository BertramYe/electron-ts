
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

