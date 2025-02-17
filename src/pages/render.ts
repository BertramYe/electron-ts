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
    console.log('data from main',data.sayhi) // 此时可以打印出 主进程上传过来的参数 `Hello from main!`
}

// 这里面将get_data_from_main作为callback函数传给 preload 的 onMessage 方法
api.onMessage(get_data_from_main)


