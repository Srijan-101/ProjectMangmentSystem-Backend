const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');


//databaseConnection 
const connection = require('./Dbconnection/connection');

//configuration details

require('dotenv').config({ path: './Config/.env' })

app.use(cors())

app.use(express.json());
app.use(morgan('dev'));


const Userroutes = require('./Routes/user.routes')
app.use('/api', Userroutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running at: ${process.env.PORT}`)
})