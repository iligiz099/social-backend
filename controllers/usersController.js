import bcrypt from 'bcrypt'
import expressAsyncHandler from 'express-async-handler'
import { generateToken } from '../config/token.js';
import { validateMongodbId } from '../utils/validateMongodbId.js';

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
    console.log({ generatedToken: token })
    console.log(req.body.password, user.password)

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return res.status(403).json({ message: "Authentication failed! Try again later." })
    res.status(200).json({ user, isValidPassword, token })
});


// get all users
export const getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
});

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


// update user data
export const updateUserData = expressAsyncHandler(async (req, res) => {
    const { _id } = req?.user
    const { firstName, lastName, email, bio } = req.body
    const updatedUser = await User.findByIdAndUpdate(_id,
        {
            firstName,
            lastName,
            email,
            bio,
        },
        {
            new: true,
            runValidators: true,
        });
    res.json(updatedUser)
});

// update user password
export const updateUserPassword = expressAsyncHandler(async (req, res) => {
    // destructure the login user
    const { _id } = req?.user
    const { password } = req.body
    validateMongodbId(_id)

    // Find the user by id
    const user = await User.findById(_id)

    if (password) {

        // generate new salt and hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        user.password = hash
        await user.save()

        res.status(200).json({
            message: "Password was updated !",
            name: user.firstName
        })
    } else {
        res.status(500).json({
            message: "Cannot change password !"
        })
    }
})



// follow function 
export const followUser = expressAsyncHandler(async (req, res) => {
    const loginUser = req.user._id
    const { followId } = req.body
    console.log(loginUser)

    // check have you already followed this user
    const targetUser = await User.findById(followId)
    const alreadyFollowed = targetUser.followers.includes(loginUser.toString())

    if (alreadyFollowed) {
        throw new Error("You have already followed this user")
    }

    // update target followers users list (in user you follow)
    await User.findByIdAndUpdate(followId, {
        $push: { followers: loginUser },
        isFollowing: true
    }, {
        new: true
    }
    )

    // update target followers users list (logged user)
    await User.findByIdAndUpdate(loginUser, {
        $push: { following: followId }
    }, {
        new: true
    }
    )

    res.json({
        message: "Following function",
        loginUser,
        followId
    })
});


// unfollow
export const unfollowUser = expressAsyncHandler(async (req, res) => {
    const loginUser = req.user._id
    const { unfollowId } = req.body

    await User.findByIdAndUpdate(unfollowId, {
        $pull: { followers: loginUser },
        isFollowing: false
    }, {
        new: true
    })


    await User.findByIdAndUpdate(loginUser, {
        $pull: { following: unfollowId }
    }, {
        new: true
    })

    res.json({
        message: "Following function",
        loginUser,
        unfollowId
    })


})

// block
export const blockUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params

    await User.findByIdAndUpdate(id, {
        isBlocked: true
    }, {
        new: true
    })

    res.status(200).json({
        message: "User was blocked!"
    })
})


// unblock
export const unblockUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params

    await User.findByIdAndUpdate(id, {
        isBlocked: false
    }, {
        new: true
    })

    res.status(200).json({
        message: "User was unblocked!"
    })
})