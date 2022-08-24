import jwt from 'jsonwebtoken'

console.log({ token: process.env.JWT_TOKEN })


//                                          payload,      secret key,           config
export const generateToken = id => jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "30d" })