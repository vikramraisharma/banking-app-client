const express = require('express');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile')
const accountRoute = require('./routes/account')
const transactionsRoute = require('./routes/transactions')
const cors = require('cors')
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors())
app.use(authRoute);
app.use(profileRoute)
app.use(accountRoute.Router)
app.use(transactionsRoute)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})