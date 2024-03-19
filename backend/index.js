const port=4000;
const express=require("express");
const app=express(); 
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");  // path which help to access backend directory 
const cors=require("cors");  // accaess to the react project 
const { rmSync } = require("fs"); 

// pass=Agarwal456

// Database Connection With MongoDB 

// mongodb+srv://ishajindal2k02:<password>@cluster0.nd9esyj.mongodb.net/



app.use(express.json());  // request that parse to json 
app.use(cors()); //  connect to express through 4000 port 

// mongodb+srv://ishajindal2k02:<password>@cluster0.nd9esyj.mongodb.net/
mongoose.connect("mongodb+srv://ishajindal2k02:Agarwal456@cluster0.nd9esyj.mongodb.net/Shopify");


app.use(express.static(path.join(__dirname,"../frontened/build")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontened/build/index.js"));
})

// API Creation 

app.get("/",(req,res)=>{
     res.send("Express App is Running");
}) 

// image stoarge engine

const storage=multer.diskStorage({
   destination:'./upload/images',
   filename:(req,file,cb)=>{
      return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
})

// creating function that pass this configuration
const upload=multer({storage:storage})

// creating upload Endpoint for creating an image
app.use("/images",express.static('upload/images'));
app.post("/upload",upload.single('product'),(req,res)=>{
   res.json({
    success:1, 
    image_url:`http://localhost:${port}/images/${req.file.filename}`
   })

})


// app.post()
// Schema for creating Products 
const Product=mongoose.model("Product",{
       id:{
          type:Number,
          requiered: true ,
       },
       name:{
         type: String, 
         required:true,
       },
       image:{
          type: String,
          required: true,
       },
       category:{
         type: String, 
         required: true,
       },
       new_price:{
          type:Number,
          required: true,
       },
       old_price:{
         type: Number,
         required:true,
       },
       date:{
          type: Date,
          default: Date.now,
       },
       availbale:{
         type: Boolean,
         default:true,
       }
})

// creating an user schema 
const User=mongoose.model("User",{
      username:{
      type: String,
      required:true
      },
      email:{
        type:String,
        required:true,
        unique:true
      },
      password:{
        type:String,
        required:true
      },
      cartDate:{
        type:Object
      },
      Date:{
        type:Date,
        Default:Date.now(),
      }
})

// creating an endpoint for registring the user  

app.post('/signup',async(req,res)=>{ 
    let check=await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"Existing User Found"});
    }
    else{
          let cart={};
          for(let i=0;i<300;++i){
             cart[i]=0;
          }
          const user=new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            cartDate:cart
          })
      await user.save(); 

      // creating jwt authentication
      
      const data={
         user:{
          id:user.id   // creating a token
         }
      }

      const token=jwt.sign(data,'secret_ecom');
       res.json({success:true,token});
    }
})

// creating a middleware to fetch the user 
const fetchUser=async(req,res,next)=>{
        const token=req.header('auth-token');
        if(!token){
          res.status(401).send({errors:"Please Authenticate using valid token"})
        }
        else{
          try{
             const data=jwt.verify(token,'secret_ecom');
             req.user=data.user;
             next();
          }catch(error){
            res.status(401).send({errors:"valid authentication"});
            
          }
        }
    
    }

// creating an endpoint for addaing the product 
app.post('/addToCart',fetchUser,async(req,res)=>{
        console.log("Added",req.body.itemId);
        let userData=await User.findOne({_id:req.user.id}); 
        userData.cartDate[req.body.itemId]+=1; 
        console.log(req.body.itemId);
        await User.findOneAndUpdate({_id:req.user.id},{cartDate:userData.cartDate});
        res.send("Added");
})
// creating an endpoint to remove product from the cartdata

app.post('/removefromcart', fetchUser,async(req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData=await User.findOne({_id:req.user.id});
    if(userData.cartDate[req.body.itemId]>0){
    userData.cartDate[req.body.itemId]-=1; 
    }
    console.log(req.body.itemId);
    await User.findOneAndUpdate({_id:req.user.id},{cartDate:userData.cartDate});
    res.send("Removed");     
})

// creating an api Endpoint to get an cart data 
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("Get Cart");
    let userData=await User.findOne({_id:req.user.id});
    res.json(userData.cartDate);
})

app.post('/login',async(req,res)=>{
    let user=await User.findOne({email:req.body.email});
    if(user){
        const passCompare=user.password===req.body.password;
        if(passCompare){
             const data={
               user:{
                   id:user.id 
               }
             } 
             const token=jwt.sign(data,'secret_ecom'); 
             return res.json({success:true,token});
        }
        else{
           return res.send({sucess:false,error:"Wrong Passwod"});
        }
    }
    else{
       return res.send({sucess:false,error:"Wrong Passwod"});  
    }
})



app.post('/addproduct',async(req,res)=>{ 
         let products=await Product.find({}); 
         console.log(products);
         let id;
         if(products.length>0){
         let last_product_array=products.slice(-1); 
         let last_product=last_product_array[0];
         id=last_product.id+1;
         }   
         else{
           id=1;
         }
         console.log("The Id is "+ id);
         const product=new Product({
           id:id,
           name:req.body.name, 
           image:req.body.image,
           category:req.body.category, 
           new_price:req.body.new_price,
           old_price:req.body.old_price
        }); 
        console.log(product); 
        await product.save();
        console.log("Saved"); 
        res.json({
          success:1,
          name:req.body.name,
        })
})

// Creating API for deleting Products 

app.post('/removeproduct',async(req,res)=>{
      await Product.findOneAndDelete({id:req.body.id}); 
      console.log("Removed"); 
      res.json({
       success:1,
       name: req.body.name
      })
})

// Creating Api for getting all products 

app.get('/allproducts',async(req,res)=>{
      let products=await Product.find({});
      // console.log("All Products Fetched"); 
       res.send(products);
   })

// listening on port 
app.listen(port,(error)=>{
     if(!error){
       console.log("Server running on "+ port);
     }
     else{
       console.log("Error : "+ error);
     }
})

