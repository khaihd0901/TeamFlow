import User from '../models/User.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';
// REGISTER
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days
export const register = async (req, res) =>{
    try{
        const {email, password,confirmPassword, name, phone} = req.body;
        
        if(!email || !password || !confirmPassword || !name || !phone){
            return res.status(400).json({message: "All fields are required !!!"});
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match !!!"});
        }

        const duplicate = await User.findOne({email});
        if(duplicate){
            return res.status(409).json({message: "User already exists !!!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            name,
            phone
        })

        return res.sendStatus(204);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// LOGIN
export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Missing Email or Password !!!"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Email or Password !!!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Email or Password !!!"});
        }
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})
        const refreshToken = crypto.randomBytes(64).toString("hex");
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        })

        res.status(200).json({message: "User logged in successfully", accessToken} )
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

//LOGOUT
export const logout = async(req,res) =>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(400).json({message: "No refresh token found"});
        }
        await Session.deleteOne({refreshToken: token});
        res.clearCookie('refreshToken');
        res.status(200).json({message: "User logged out successfully"});
    }catch(err){
        console.log(err),
        res.status(500).json({message: "Internal Server Error"})
    }
}

//REFRESH TOKEN
export const refreshToken = async(req,res)=>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(400).json({message: "No refresh token found"});
        }
        const session = await Session.findOne({refreshToken: token});
        if(session?.expiresAt < new Date()){
            return res.status(403).json({message: "Invalid or expired refresh token"});
        }
        const accessToken = jwt.sign({userId: session.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})
        res.status(200).json({accessToken});
    }catch(err){
        console.log(err),
        res.status(500).json({message: "Internal Server Error"})
    }
}