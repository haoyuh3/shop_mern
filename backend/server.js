import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
/*
加载环境变量 .env
	•	连接 MongoDB（通过 Mongoose）
	•	设置解析 JSON 的中间件
	•	加载路由 /api/products
	•	启动服务监听端口
 */
dotenv.config()

connectDB()

const app = express()
//process node.js 的全局变量
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} // 记录日志细节

app.use(express.json())
/*
将不同模块的 API 路由挂载到主路由上：
	•	/api/products → 商品相关逻辑
	•	/api/users → 用户登录、注册
	•	/api/orders → 订单逻辑
	•	/api/upload → 图片或文件上传
 */
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)


app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API is running....' })
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
