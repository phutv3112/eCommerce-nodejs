const app = require('./src/app')

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`eCommerce server start at ${PORT}`)
})
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server express!')
    })
})