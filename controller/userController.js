import User from '../model/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register=async(req,res)=>{
    let name=req.body.name;
    let email=req.body.email;
    let password=req.body.password;

    try {
        const edata=await User.findOne({email:email})
        if(edata) return res.send("Email is already used")
        const salt_routes=10;
        bcrypt.hash(password,salt_routes,async function(err,hash){
            const data= await User.insertMany({
                name,
                email,
                password:hash,
            })
            if(data) return res.send('User Addedd')
        })
    } catch (error) {
        return res.send(error.message)
    }
}

const login=async(req,res)=>{
    let email=req.body.email;
    let pwd=req.body.pwd;
    try {
        const data= await User.findOne({email:email})
        if(data){
        bcrypt.compare(pwd,data.password,async function(err, result){
            if(result==true){
                const token=jwt.sign({_id:data._id},''+process.env.SECRET)
                // return res.header({'x-auth-token':token}).send('welcome '+data.name)
                // localStorage.setItem(token)
                return res.send(token)
                // return res.send(data)
            }
            return res.send("Please enter correct id and password")
        })
    }
    else{
        return res.send("No user on that email")
    }
    } catch (error) {
       return res.send(error.message)
    }
}
const getme=async(req,res)=>{
    // res.send('hello')
    let _id=req.user._id
    try {
       const data=await User.findOne({_id:_id}) 
       if (data) return res.send(data)
    } catch (error) {
        return res.send(error.message)
    }

}

const deposit=async(req,res)=>{
    let amt=Number(req.body.amount)
    if(!amt)return res.send('please enter amount')
    try {
        const fbal=await User.findOne({_id:req.user._id},{balance:1,_id:0})
        if(!fbal) return res.send("error in find balance")
        const data=await User.updateOne({_id:req.user._id},{$set:{
            balance:amt+fbal.balance
        }})
        if(data){
            const nbal=await User.findOne({_id:req.user._id},{balance:1,_id:0})
            return res.send({'bal':nbal.balance})
        }
        
    } catch (error) {
        return res.send(error.message)
    }
}

const withdrawal=async(req,res)=>{
    let amt=Number(req.body.amount)

    try {
        const fbal=await User.findOne({_id:req.user._id},{balance:1,_id:0})
        if(fbal.balance<amt) return res.send("you dont have efficient amount")
        const data=await User.updateOne({_id:req.user._id},{$set:{
            balance:fbal.balance-amt
        }})
        if(data){
            const nbal=await User.findOne({_id:req.user._id},{balance:1,_id:0})
            return res.send({'bal':nbal.balance})
        }

    } catch (error) {
        return res.send(error.message)
    }
}

export {register,login,deposit,withdrawal,getme}

