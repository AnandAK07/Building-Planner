const express = require('express');
const connection = require('./configs/db')
const authentication = require('./middlewares/authentication');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/user.route')
const drawing = require('./routes/drawing.route');
const morgan = require('morgan');


const app = express();
app.use(cors('*'))
app.use(express.json())

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('App is working')
})

app.use('/users', userRouter)


app.use(authentication)
app.use('/drawing', drawing)

const PORT = process.env.PORT
app.listen(PORT, async () => {
    try {
        await connection()
        console.log(`app is listening at ${PORT}`)
    } catch (error) {
        console.log("app is listening failure");
    }
    console.log(PORT)
})