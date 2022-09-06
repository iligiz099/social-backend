import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;

    // check does headers contains token
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        try {

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_KEY)
            console.log(decoded)
            // find the user by id ( return user exept password property. )
            const user = await User.findById(decoded?.id).select("-password")

            // attach the user to the request object
            req.user = user
            next()

        } catch (error) {
            throw new Error('Faild authorized !')
        }
    } else {
        throw new Error('Faild authorized ! Try again !')
    }
    console.log('middleware')
});