import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true,trim: true, lowercase: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: Number, required: true, unique: true},
    avatarUrl : {type: String},
    bio: {type: String},
    role: {type: String, enum: ['user','manager','admin'], default: 'user'},

    isVerify:{type: Boolean, default:false},
    verifyToken: {type:String},
    verifyTokenExpiry: {type:Date},
},{
    timestamps: true,
})

const User = mongoose.model('User', userSchema);
export default User;