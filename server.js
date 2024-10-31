import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './pages/index'

const app = express()
app.use(express.static('public'));
const content = renderToString(<App />)

app.get('/', async (req, res) => {
    const file = await import('./pages/index.js')

    let propsObj = {}
    if (file.getServerSideProps) {
        const { props } = await file.getServerSideProps({ query: req.query })
        propsObj = props
    }

    const Component = file.default;
    const content = renderToString(<Component {...propsObj} />)
    res.send(`
        <html>
            <head>
                <title>Tiny React SSR</title>
            </head>
            <body>
                <div id="root">${content}</div>
                <script>
                      window.__DATA__ = ${JSON.stringify(propsObj)}
                </script>
                <script src="/client.bundle.js"></script>
            </body>
        </html>
    `)
})

app.listen(3000, () => console.log('listening on port 3000!'))

/*
水合逻辑

1. 当用户浏览器打开此页面，先返回静态的 html 页面
2. 浏览器通过 <script src="/client.bundle.js"></script> 请求 client.bundle.js 文件, react 开始渲染页面

为什么要加载 client.bundle.js 文件？
因为要让静态 html 页面变为动态页面，其中的点击事件都可以正常被触发，静态页面只是光有 dom，并没有 js 逻辑

如果只是要展示静态页面，就不需要进行水合
因为当写的 react 代码，已经被 renderToString 渲染成了 html 字符串，直接返回给浏览器即可
 */
