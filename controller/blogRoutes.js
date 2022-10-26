const express = require('express');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const blogModel = require('../model/blogModel')
const users = require('../model/userModel')

const routes = express.Router()

const verifyToken = async (req, res, next)=>{
  const token = req.cookies.access_token
  if(!token) return res.status(403).send('Forbidden');

  const verify = jwt.verify(token, "secret-word")
  const user = await users.findById(verify.id)
  req.user = user
  if(!verify) return res.status(403).send('Forbidden')

  next()
}

//5 && 14a,c
routes.get('/allpost', async (req, res)=>{
  const limitValue = 20
  const blogs = await blogModel.find().limit(limitValue).skip((req.query.page-1)*limitValue).sort({timestamp: -1})
  res.send(blogs)
})

//6 && 15
routes.get('/blog/:id', async (req, res)=>{
  const getBlog = await blogModel.findById({_id: req.params.id})
  res.send(getBlog)
})

//7
routes.post('/createBlog', verifyToken, async (req, res)=>{
    const newBlog = new blogModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      state: req.body.state,
      timestamp: new Date(),
      body: req.body.body,
      author: req.user._id
    })
    await newBlog.save()
    res.send(newBlog)
})

//9
routes.post('/publish/:id', verifyToken, async (req, res)=>{
const {state} = (req.body);
const  currentState  = "published"
req.body.state = currentState

const publish = new blogModel({
  title: req.body.title,
  description: req.body.description,
  tags: req.body.tags,
  state:req.body.state,
  timestamp: new Date(),
  body: req.body.body,
  author: req.user._id
})
await publish.save()
res.send(publish)

})

//10
routes.post('/editBlog/:id', verifyToken, async (req, res)=>{
  const updateBlog = await blogModel.findByIdAndUpdate({_id: req.params.id}, req.body);
  res.send({data:updateBlog})
})

//11
routes.post('/deleteBlog/:id', verifyToken,async (req, res)=>{
 const del = await blogModel.findByIdAndRemove({_id: req.params.id})
})

//12
routes.get('/personalBlogs', verifyToken, async (req, res)=>{
  const userBlog = await blogModel.aggregate([{
    $match:{author: req.user._id}
  }])

  if(userBlog.length === 0){
    return res.send('No post yet')
  }

  res.send(userBlog)
})


module.exports = routes