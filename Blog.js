const express = require('express');
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const usersRoutes = require('./controller/userRoutes')
const blogRoutes = require('./controller/blogRoutes')

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blogs", {UseNewUrlParser: true}).then(()=>{

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookie())

app.use(usersRoutes)
app.use(blogRoutes)
  
app.listen(process.env.PORT || 3030)

})

