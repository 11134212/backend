import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import CheckAuth from './utils/CheckAuth.js'
// import { getMe, login, register } from './controllers/userControllers.js'
import { registerValidation } from './validations/auth.js'
import { loginValidation } from './validations/loginValidation.js'
// import {
// 	createdNewPost,
// 	getAllPosts,
// 	getSinglePost,
// 	removePosts,
// 	updatePost,
// } from './controllers/PostController.js'
import { postController, userControllers } from './controllers/index.js'
import { postValidation } from './validations/postValidation.js'

mongoose
	.connect(
		'mongodb+srv://Admin:abai606505031212@cluster0.0i3cooe.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => console.log('Server BD Connected...'))
	.catch(() => console.log('Server BD Connected Error...'))

const app = express()
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

// Upload Images
app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.use('/uploads', express.static('uploads'))
// { User}
// Created user
app.post('/auth/register', registerValidation, userControllers.register)
//login User
app.post('/auth/login', loginValidation, userControllers.login)

app.get('/auth/profile', CheckAuth, userControllers.getMe)

//Post
// { Poems }
app.post('/post', CheckAuth, postValidation, postController.createdNewPost)
app.get('/posts', postController.getAllPosts)
//Get single post
app.get('/post:id', postController.getSinglePost)
//Remove post
app.delete('/post:id', CheckAuth, postController.removePosts)
//Update post
app.patch('/post:id', CheckAuth, postValidation, postController.updatePost)

app.listen('4000', (err) => {
	if (err) return console.log('Ошибка Сервера... ${err}')
	console.log('Сервер был успешно запущен...')
})
