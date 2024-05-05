const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/User');
const fs = require('fs');
const Place = require('./models/Place');
const app = express(); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const imageDownloader = require('image-downloader');
const cookieParser = require('cookie-parser');
const BookingModel = require('./models/Booking');
require('dotenv').config();
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'areyoureadytobehappy';
const bucket = 'aditya-booking-app';




app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))

app.use(cors({
    credentials: true,
    origin:'http://localhost:5173',
}));

async function uploadToS3(path,originalFilename,mimetype){
    const client = new S3Client({
        region:'us-east-1',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    const parts = originalFilename.split('.')
    const ext = parts[parts.length-1];
    const newFileName = Date.now()+'.'+ext;

   await client.send(new PutObjectCommand({
        Bucket:bucket,
        Body:fs.readFileSync(path),
        Key:newFileName,
        ContentType:mimetype,
        ACL:'public-read',
    }))

   return `https://${bucket}.s3.amazonaws.com/${newFileName}`;



}




app.get('/test',(req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    res.json('test okkkkkk')
})

app.post('/register',async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const{name,email,password}  = req.body;
   const user =  await UserModel.create({
        name,
        email,
        password:bcrypt.hashSync(password,bcryptSalt)
    });

    res.json(user);



    
})

app.post('/login',async(req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const{email,password} = req.body;

  const userDocument = await UserModel.findOne({email:email})

  if(userDocument!= null){
    const passOK = bcrypt.compareSync(password,userDocument.password)

    if(passOK){
        jwt.sign({email:userDocument.email,id:userDocument._id,name:userDocument.name},jwtSecret,{},(err,token)=>{
            if(err){
                throw err;
            }
            else{
                res.cookie('token',token).json(userDocument)

            }
        })
       
    }
    else{
        res.status(422).json('not ok')
    }
  }
  else{
    res.json('not found')
  }
})


app.get('/profile',(req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');

    const {token}  = req.cookies;
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,result)=>{
            if(err){
                throw err;
            }
            else{
              const {name,email,_id} = await  UserModel.findById(result.id);
                res.json({name,email,_id});
            }

        })

    }
    else{
        res.json(null);
    }
    
})

app.post('/upload-by-link',async (req,res)=>{
   
    const {link} = req.body;
    const newName = 'photo'+Date.now()+'.jpg'

    try{
   await imageDownloader.image({
        url:link,
        dest:'/tmp/'+newName,
    });
}
catch(e){
   res.json("provide url...")
} 
    const url =  await uploadToS3('/tmp/'+newName,newName,mime.lookup('/tmp/'+newName));
    res.json(url);


})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
})

app.post('/places',async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');

    const {token}  =req.cookies;
    const {title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;

    jwt.verify(token,jwtSecret,{},async (err,result)=>{
        if(err){
            throw err;
        }
     const placeDoc =   await Place.create({
            owner: result.id,
            price:price,
            title:title,
            address:address,
            photos:addedPhotos,
            description:description,
            perks:perks,
            extraInfo:extraInfo,
            checkIn:checkIn,
            checkOut:checkOut,
            maxGuests:maxGuests




        })

        res.json(placeDoc); 
    })
})


app.get('/user-places',(req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const {token}  =req.cookies;
    jwt.verify(token,jwtSecret,{},async (err,result)=>{
       const {id} =  result;
       res.json( await Place.find({owner:id}))

    })

})

app.put('/places',async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const {token}  =req.cookies;

    const { id,title,address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;

   

    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        const placeDoc = await Place.findById(id); 
        if(userData.id === placeDoc.owner.toString()){ //since it returns object
            placeDoc.set({
                title:title,
                address:address,
                photos:addedPhotos,
                description:description,
                perks:perks,
                extraInfo:extraInfo,
                checkIn:checkIn,
                checkOut:checkOut,
                maxGuests:maxGuests,
                price:price
            })
           await placeDoc.save();

            res.json('ok');
        }
        
    })
    

})

app.get('/places/:id', async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const {id} = req.params;

    res.json(await Place.findById(id))
})

app.get('/places', async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    res.json( await Place.find())
})

app.post('/bookings', async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
    const userData = await getUserDataFromToken(req);
    const{place,checkIn,checkOut,numberOfGuests,name,mobile,price} =  req.body;

     BookingModel.create({
        place,checkIn,checkOut,numberOfGuests,name,mobile,price,user:userData.id,
     }).then((err,doc)=>{

        try{
        if(err){
            throw err;
        }}
        catch(e){
            res.json('error occured')
        }
        
        res.json(doc);
     })


})

function getUserDataFromToken(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwtSecret,{},async (err,result)=>{
            if(err) throw err;
  
            resolve(result);
   
       })
         
    })

    
    
     

}

app.get('/bookings',async (req,res)=>{
    mongoose.connect('mongodb+srv://devchakkeaditya37:Dd4nooSkcSSYLjgj@cluster0.hbqhz10.mongodb.net/');
   const userData =  await getUserDataFromToken(req);
   res.json( await BookingModel.find({user:userData.id}).populate('place'))

    

})



app.listen(3000); 

