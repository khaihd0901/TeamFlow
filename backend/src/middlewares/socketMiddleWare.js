import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const socketAuthMiddleWare = async (socket,next) =>{
    try {
        const token = socket.handshake.auth?.token;
        if(!token){
            return next(new Error("Unauthorize - token not exit"))
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            return next(new Error('Unauthorize - token not valid or expired'))
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return next(new Error("User not exit"))
        }

        socket.user = user;
        next();
    } catch (error) {
        console.log("Error when verify JWT in socketMiddleWare", error);
        next(new Error('Unauthorize'))
    }
}