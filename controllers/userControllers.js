import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import userModel from '../models/UserModel.js'
import jwt from 'JsonWebToken'

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new userModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})
		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'Не удалось зарегистрировать аккаунт 🤓',
		})
	}
}
// login

export const login = async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль🧐',
			})
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'Не удалось зарегистрировать аккаунт',
		})
	}
}
// get my profile

export const getMe = async (res, req) => {
	try {
		const user = await UserModel.findById(req.user.Id)
		if (!user) {
			return res.status(400).json({
				message: 'К сожалению на данный момент не удалось',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.josn({
			...userData,
		})
	} catch (err) {
		console.log(`Ошибка ${err}`)
		res.status(500).json({
			message: 'Вы ввели не верный е-маил или пароль 🤓',
		})
	}
}
