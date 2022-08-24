import bcrypt from 'bcrypt'
import expressAsyncHandler from 'express-async-handler'
import { generateToken } from '../config/token.js';
import { validateMongodbId } from './utils/validateMongodbId.js';

// register user
import User from "../models/User.js"

export const registerUser = expressAsyncHandler(
    async (req, res) => {

        const { firstName, lastName, email, password } = req.body

        // check does user already exist
        const userExists = await User.findOne({ email })
        if (userExists) throw new Error("User already exists !")

        // generate new salt and hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await new User({
            firstName,
            lastName,
            email,
            password: hash
        });

        const doc = await user.save()

        res.status(201).json(doc)
    }
);


// login user

export const loginUser = expressAsyncHandler(async (req, res) => {

    const { email, password } = req.body

    // check if user exists
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("User doesn't exists !")
    }

    const token = generateToken(user._id)
    console.log(req.body.password, user.password)

    const isValidPassword = await bcrypt.compare(password, user.password)
    res.status(200).json({ user, isValidPassword, token })
});


// get all users
export const getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
})

// delete user
export const deleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    const deletedUser = await User.findByIdAndDelete(id)

    res.status(204).json({ deletedUser, success: true })
});


// get user details 
export const fetchUserDetails = expressAsyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        throw new Error("Cannot find a user !")
    }
});