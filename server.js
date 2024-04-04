const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/login_db", {
useNewUrlParser: true,
}).then(() => {
console.log("Databse Connected Successfully!!");
}).catch(err => {
console.log('Could not connect to the database', err);
process.exit();
});
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
app.get('/',(req,res)=>{
res.json({
"message":"it's work"
})
})
