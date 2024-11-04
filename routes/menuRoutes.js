const express=require("express");
const router=express.Router();
const MenuItem = require('./../models/menu.js');


router.get("/",async(req,res)=>{
    try{
        const data=await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});
router.post("/",async(req,res)=>{
    try{
        const data=req.body;
        const newMenuItem=new MenuItem(data);
        const response= await newMenuItem.save();
        console.log("data saved");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});
router.get("/:tastetype",async(req,res)=>{
    try{
        const tasteType=req.params.tastetype;
        if(tasteType == "spicy" || tasteType == "sweet" || tasteType =="sour"){
            const data=await MenuItem.find({taste:tasteType});
            console.log('data fetched');
            res.status(200).json(data);
        }else{
            res.status(404).json({error:"invalid taste"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});

module.exports=router;