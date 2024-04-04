const express = require('express')
const app = express()

app.listen(82,()=>{
    console.log('REST API via ExpressJS')
})
const sum=require('./sum');
console.log(sum(14,3))