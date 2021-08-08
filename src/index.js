const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const balanceRouter = require('./routers/balance')
const notificationRouter = require('./routers/notifications')
const transactionRouter = require('./routers/transactions')
const rateRouter=require('./routers/interestRate');

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(rateRouter)
app.use(balanceRouter)
app.use(notificationRouter)
app.use(transactionRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
