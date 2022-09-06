

export const notFound = (req, res, next) => {
    const message = new Error(`This page doesn't exist! ${req.originalUrl}`)
    throw message
}

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
    next()
}


export default errorHandler