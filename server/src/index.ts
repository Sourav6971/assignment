import express from "express"
import { Admin, Book, User} from "./db";
import adminMiddleware from "./middlewares/admin";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"
import cors from "cors"


const app= express();
app.use(cors());

app.use(express.json())

app.get("/",(req,res)=>{
    res.json({msg:"App running successfully"})
})


app.post("/signup",async(req,res)=>{
    
    const {username,password,firstName,lastName}= req.body;
    const hashedPassword=bcrypt.hashSync(password);
    const secret= process.env.SECRET||"";

    try{
        const user = await User.findOne({username});
        if(user)
        {
            res.json({msg:"User already exists"});
            return;
        }

       const response=  await User.create({
            username,
            password:hashedPassword,
            firstName,
            lastName
        })
        if(!response)
        {
            res.json({msg:"Could not sign up"});
            return
        }
        const token= await jwt.sign(response._id.toString(),secret);
        res.json({
            msg:"User added successfully",
            token
        })
        return

        }
    catch{
        res.json({msg:"Error signing up"})
        return
    }
})
app.post("/signin",async(req,res)=>{
    const{username,password,role}= req.body;
    const secret = process.env.SECRET||"";
    
 try{

    switch(role){
        case "user":{
            const user= await User.findOne({username});
            if(!user){
                res.json({msg:"User does not exist"});
                return
            }
            const hashedPassword= user?.password||"";
            const response= bcrypt.compareSync(password,hashedPassword);
            if(!response){
                res.json({msg:"Wrong password"});
                return
            }
            const token = await jwt.sign(user._id.toString(),secret);
            res.json({msg:"User signed in",token,firstName:user.firstName,lastName:user.lastName,role:"user"})
            return;
        }
        case "admin":{
            const admin= await Admin.findOne({username});
            if(!admin){
                res.json({msg:"Admin does not exist"});
                return
            }

            const hashedPassword= admin?.password||"";
            const response=await bcrypt.compareSync(password,hashedPassword);
            if(!response){
                res.json({msg:"Wrong password"});
                return;
            }
            const token= await jwt.sign(admin._id.toString(),secret);
            res.json({
                msg:"Admin signed in",
                token,
                role:"admin"
            })
        }
    }
 }  
 catch(e){
    console.error(e)
    res.status(500).json({msg:"Internal server error"});
    return
 }
    
})



app.get("/books",async(req,res)=>{
const page= req.query.page;

const id = req.query.id;
if(id){
    const data= await Book.find({_id:id})
    if(!data)
    {res.json({msg:"Book does not exist"})
return}
res.json({books:data})
}
const end= Number(page)*10+1;
const start= end-10;
const data= await Book.find({});

if(!data){
    res.json({msg:"Could not retrieve books"})
    return;
}
const books= data.slice(start-1,end-1);
res.json({books})
return
})

app.post("/books",adminMiddleware,async(req,res)=>{
    const {name,author}= req.body;
    try{
    await Book.create({
        name,
        author
    })
    res.json({msg:"Book added successfully"});
}
catch{
    res.json({msg:"Could not add book"});
    return
}
})



app.get("/reviews",async(req,res)=>{

    const id= req.query.id;
    if(!id)
    {
        res.json({msg:"Check your params"});
        return
    }

    const book= await Book.findOne({
        _id:id||""
    });
  
    if(!book){
        res.json({
            msg:"Book does not exist"
        })
        return
    }
    const reviews= book.reviews;
    res.json({
        reviews
    })
    return
})

app.post("/reviews",async(req,res)=>{
    const {id,review,rating}= req.body;
    const book = await Book.findOne({_id:id});

    if(!book)
    {
        res.json({msg:"Could not find the book"})
    }
 
 
    let oldRating = book?.ratings ?? { count: 0, value: 0 };
const newCount = (oldRating.count || 0) + 1;
const newValue = ((oldRating.value || 0) * (oldRating.count || 0) + rating) / newCount;
const newRating = {
    count: newCount,
    value: Number(newValue.toFixed(2))
};


    try{

        await Book.updateOne(
            { _id: id },
            { 
                $push: { reviews: review },
                ratings: {
                    count: newRating.count,
                    value: Number(newRating.value?.toFixed(2))
                }
            }
        )
        res.json({msg:"Review added"})
    }
    catch{
        res.json({msg:"Could not add review"})
    }
})

app.get("/users",async(req,res)=>{
    const id= req.query.id;
    const user= await User.findOne({_id:id},{password:false});
    if(!user){
        res.json({
            msg:"User does not exist"
        });
        return
    }
    res.json({user})
})

app.put("/users",async(req,res)=>{
    const {firstName,lastName,id} = req.body;
    const user= await User.findOne({_id:id});
    if(!user){
        res.json({msg:"User does not exist"});
        return
    }
    try{
    await User.updateOne(
        { _id: id },
        { firstName, lastName }
    )
res.json({msg:"User details updated"});
return}
catch{
    res.status(500).json({msg:"Internal server error"});
    return
}
})

app.post("/admin/signup",async(req,res)=>{
    const {username,password}= req.body;
    const admin= await Admin.findOne({username});
    if(admin){
        res.json({msg:"Admin already exist"});
        return
    }
    const hashedPassword= await bcrypt.hashSync(password)
    try{
        await Admin.create({
            username,
            password:hashedPassword
        })
        res.json({
            msg:"Admin created successfully"
        });
        return
    }
    catch(e){
        console.error(e)
        res.status(500).json({msg:"Internal server error"})
    }
})


app.listen(3000,()=>{console.log('App running on localhost 3000')});