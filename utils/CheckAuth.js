import jwt from 'jsonwebtoken'

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\S?/, '')

	if (token) {
		try {
			const decoded = jwt.verify(token, 'secret123')
			req.userId = decoded._id
			next()
		} catch (e) {
			return res.status(403).json({
				message: 'К сожалению у вас нет доступа',
			})
		}
	} else {
		return res.status(403).json({
			message: 'К сожалению у вас нет доступа',
		})
	}
}