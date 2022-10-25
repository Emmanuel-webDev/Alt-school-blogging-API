const express = require('express');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const blogModel = require('../model/blogModel')
const users = require('../controller/userRoutes')

const routes = express.Router()

const verifyToken = (req, res, next)=>{
  const token = req.cookies.access_token
  if(!token) return res.status(403).send('Forbidden');

  const verify = jwt.verify(token, "secret-word")
  if(!verify) return res.status(403).send('Forbidden')

  next()
}



routes.post('/createBlog', verifyToken, async (req, res)=>{
    const newBlog = new blogModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      timestamp: new Date(),
      body: req.body.body
    })
    await newBlog.save()
    res.send(newBlog)
})

module.exports = routes