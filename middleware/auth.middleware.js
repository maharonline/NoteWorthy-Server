import jwt from 'jsonwebtoken'

const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" })

    try {
        const decoded = jwt.verify(token, "secret-key")
        req.uid = decoded
        next()

    } catch (error) {
        res.status(403).json({ message: "Invalid Token" })
    }
}

export default authenticateUser