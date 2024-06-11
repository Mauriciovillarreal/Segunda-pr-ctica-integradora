const { connect } = require('mongoose')

exports.connectDB = () => {
    connect('mongodb+srv://mauriciovillarreal:n2pc0704@cluster0.v5vivdv.mongodb.net/ecommerce?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('DB connected')
    }).catch((error) => {
        console.error('Error connecting to DB:', error)
    })
}