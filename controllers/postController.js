import PostModel from '../models/PostModel.js'

// Created Post
export const createdNewPost = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})
		const post = await doc.save()

		res.json(post)
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'К сожалению не удалось...',
		})
	}
}
//  get all posts
export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		res.json(posts)
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'К сожалению не удалось',
		})
	}
}
// get single post
export const getSinglePost = async (res, req) => {
	try {
		const poemsId = await req.params.id

		PoemsModel.findByIdandUpdate(
			{
				_id: poemsId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					res.status(500).json({
						message: 'К сожалению не удалось',
					})
				}
				if (doc) {
					console.log(404).json({
						message: 'К сожалению не найдено',
					})
				}
				res.json(doc)
			}
		)
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'К сожалению не удалось',
		})
	}
}

// remove post
export const removePosts = async (req, res) => {
	try {
		const postId = await req.params.id

		PostModel.findByIdAndDelete({ _id: postId }, (err, doc) => {
			if (err) {
				console.log(err)
				return res.status(500).json({
					message: 'К сожалению не удалось...🥺',
				})
			}

			if (!doc) {
				return res.status(404).json({
					message: 'К сожалению не удалось...😞',
				})
			}
			res.json({
				succes: true,
			})
		})
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'К сожалению не удалось... 🥺',
		})
	}
}

// update post
export const updatePost = async (res, req) => {
	try {
		const postId = await req.params.id
		await PostModel.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		)
		res.json({
			succes: true,
		})
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'К сожалению не удалось... 🥺',
		})
	}
}
