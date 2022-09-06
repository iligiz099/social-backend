import jwt from 'jsonwebtoken'

//                                          payload,      secret key,           config
export const generateToken = id => jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" })