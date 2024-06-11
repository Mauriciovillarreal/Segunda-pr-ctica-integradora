// const fs = require('fs')
const express = require('express')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require ('connect-mongo')
const passport = require('passport')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { Server } = require('socket.io')
const { connectDB } = require('./config/index.js')
const { productsModel } = require('./models/products.model.js')
const { chatsModel } = require('./models/chat.model.js')
const { initPassport } = require('./config/passport.config.js')

const path = require('path')

const PORT = process.env.PORT || 8080

const app = express()
const httpServer = app.listen(PORT, error => {
    if (error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})
const io = new Server(httpServer)

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../src/views/layouts'),
    partialsDir: path.join(__dirname, '../src/views')
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '../src/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser('s3cr3t@F1rma'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mauriciovillarreal:n2pc0704@cluster0.v5vivdv.mongodb.net/ecommerce?retryWrites=true&w=majority',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 's3cr3etC@d3r',
    resave: true,
    saveUninitialized: true
}))
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/views.routes'))
app.use('/api/products', require('./routes/api/products.route.js'))
app.use('/api/carts', require('./routes/api/carts.routes.js'))
app.use('/api/sessions', require('./routes/api/session.routes.js') )

io.on('connection', async (socket) => {
    console.log('New user connected')
    try {
        const products = await productsModel.find({})
        socket.emit('update-products', products)
    } catch (error) {
        console.error('Error occurred while fetching products:', error)
    }

    socket.on('add-product', async (product) => {
        try {
            const newProduct = await productsModel.create(product)
            const updatedProducts = await productsModel.find({})
            io.emit('update-products', updatedProducts)
        } catch (error) {
            console.error('Error occurred while adding product:', error)
        }
    })

    socket.on('delete-product', async (productId) => {
        try {
            const product = await productsModel.findById(productId)
            if (!product) {
                io.to(socket.id).emit('product-not-found')
                return
            }
            await productsModel.findByIdAndDelete(productId)
            const updatedProducts = await productsModel.find({})
            io.emit('update-products', updatedProducts)
        } catch (error) {
            console.error('Error occurred while deleting product:', error)
        }
    })

    socket.on('chat message', async (msg) => {
        console.log('message:', msg)
        try {
            const newMessage = new chatsModel({ email: msg.user, message: msg.message })
            await newMessage.save()
            io.emit('chat message', msg)
        } catch (error) {
            console.error('Error occurred while saving message:', error)
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})