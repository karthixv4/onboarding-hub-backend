// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // const token = req?.cookies?.todoToken
    // if (!token) return res.status(403).send('A token is required for authentication');

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;
    //     next();
    // } catch (err) {
    //     return res.status(401).send('Invalid Token');
    // }
    next();
};
