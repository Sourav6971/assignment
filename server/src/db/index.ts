import mongoose, { mongo } from "mongoose"
import "dotenv/config"

mongoose.connect(process.env.DATABASE_URL??"").then(()=>{console.log("Connected to DB")})

const userSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    username:String,
    password:String
})


const adminSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    username:String,
    password:String
})


const bookSchema = new mongoose.Schema({
    name:String,
    author:String,
    reviews:[String],
    ratings:{
        count:Number,
        value:{default:0,type:Number}
    }
})


const Book= mongoose.model("Book",bookSchema);
const Admin = mongoose.model("Admin",adminSchema);
const User= mongoose.model("User",userSchema)

export {User,Book, Admin}



