import  { ipcRenderer  } from 'electron';
// import { contextBridge } from 'electron'
const { contextBridge } = require('electron')
// 由于是预加载脚本，可以使用 部分 nodeapi 比如像下面这样
// 同时由于是预加载，所以以下的打印是在 浏览器环境下的打印结果
console.log('node enviroment params',process.version as string)


// 直接利用 contextBridge 像浏览器环境中暴露对象或者数据
// 下面这种暴露方式会将数据挂载在 render.ts (浏览器环境中的 windows 对象上，故而可以直接通讯)
// 下面的 abc 是作为主键，会挂载到render进程的 windows 上面
contextBridge.exposeInMainWorld('abc',{
    xyz:100,
    // 自定义一个方法，可以让 渲染进程调用，从而可以传值过来，完成从 render ---> preload 之间的通信
    save_file:(data:string) => {
        console.log('data',data);
        ipcRenderer.send('to_save_data',data)  // 这里 preload 利用 ipcRenderer 向主进程发送信息，其中 to_save_data 是频道，data 是对应的需要发送的值
    },
    read_file:async () => {
        console.log('call the read files');
        // 注意由于 invoke 返回的是一个 promise 对象，所以这里需要异步转换
        const file_result = await (ipcRenderer as any).invoke('read_file_content');  // 这里 preload 利用 ipcRenderer 向主进程发送信息，其中 read_file_content 是频道，用于调用主进程的方法
        console.log('file_result',file_result)
        return file_result
    },

    // 这里定义的函数是用于监听主进程利用 message-from-main 频道发来的信号，
    // 再接受渲染进程上传过来一个callback函数，从而能让渲染进程获取到主进程发来的信息
    // 从而完成从主进程主动向渲染进程发送信息的这个流程
    onMessage: (callback:(event:any,data:{sayhi:string})=>void) => {
        console.log('call the infrom on preload')
        ipcRenderer.on('message-from-main', callback)
    },
}) 


