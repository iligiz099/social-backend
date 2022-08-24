import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required !"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required !"]
    },
    profilePhoto: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_960_720.png"
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    bio: String,
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    postCount: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["Admin", "Guest", "Blogger"]
    },
    isFollowing: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },

    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },

    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },

    following: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },

    passwordChangedAt: Date,
    passwordRessetToken: String,
    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


// One of variants to hash passwords (middleware): 

// userSchema.pre("save", async function (next) {
//     const salt = bcrypt.salt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })


// compile schema into model
export default mongoose.model("User", userSchema)