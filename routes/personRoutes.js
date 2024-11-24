const express=require("express");
const router=express.Router();
const Person = require('./../models/Person.js'); 
const jwt = require('jsonwebtoken');
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
//signup route
router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log("data saved");
        const payload={
            id:response.id,
            username:response.username
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload);
        console.log("Token is : ",token);
        res.status(200).json({AuthenticatorResponse:response,token:token}); // Use res.status(201) for successful creation
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
});
//Login Route
router.post('/login',async(req,res)=>{
    
    try{
        //Extract username and password from the request body
        const {username,password}=req.body;
        //find the user by username
        const user=await Person.findOne({username:username});
        //if user does not exist or password does not match,return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"Invalid username or password"});
        }
        //generate token
        const payload={
            id:user.id,
            username:user.username
        };
        const token=generateToken(payload);
        res.json(token);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});

    }
});
//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user;
        console.log("User Data: ",userData);
        const userId=userData.id;
        const user=await Person.findById(userId);
        res.status(500).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})
router.get("/",jwtAuthMiddleware,async(req,res)=>{
    try{
        const data=await Person.find();
        console.log("data fetched");
        res.status(200).json(data); 
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
});

router.get("/:worktype",async(req,res)=>{
    try{
        const workType=req.params.worktype;
        if(workType == "chef" || workType == "waiter" || workType == "manager"){
            const response=await Person.find({work:workType});
            console.log("response fetched");
            res.status(200).json(response);
        }else{
            res.status(404).json({error:"invalid work type"});
        }

        }catch(err){
            console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});

router.put("/:id",async(req,res)=>{
    try{
        const personId=req.params.id;
        const updatedPersonData=req.body;
        const response=await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new:true,
            runValidators:true,
        })
        if(!response){
            return res.status(404).json({error:"person not found"});
        }
       console.log("data updated");
       res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});

router.delete("/:id",async(req,res)=>{
    try{
        const personId=req.params.id;
        const response=await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error:"person not found"});
        }
       console.log("data deleted");
       res.status(200).json({message:"person deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});

module.exports=router;