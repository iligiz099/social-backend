import mongoose from 'mongoose';

// helps to check is valid mongodb id 
export const validateMongodbId = id => {
    const isValid = mongoose.Types.ObjectId.isValid(id)

    if (!isValid) {
        throw new Error("User id is not valid or found")
    }
}