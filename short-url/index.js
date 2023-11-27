const { urlencoded } = require('express');
const express = require('express')
const staticRoute = require('./routes/staticRouter.js')
const path = require('path')
const cookieParser = require('cookie-parser');
const urlRoute = require('./routes/url.js');
const userRoute = require('./routes/user.js');
const URL = require('./models/url.js');
const { readSync } = require('fs');
const app=express()
const PORT = 8001;
const connectDB = require('./connection.js')
const { restrictToLoggedinUserOnly ,checkAuth} = require('./middleware/auth.js');


//mongoose connection 
connectDB()
.then( () => {
    //app.listen se phle err bhi listen karke dekh lo 
    app.on("ERROR",(error)=>{
        console.log("ERR:",error);
        throw error;
    });
})
.catch( (err) => {
    console.log("MPNGO DB connevtion is failed !! ", err)
})


app.set("view engine","ejs");
app.set('views',path.resolve('./views'))

//middleware 

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());



// app.get("/test",async (req,res)=> {
//     // return res.end('<h1>hey from server </h1>');
//     const allUrls = await URL.find({});
//     return res.render('home',{
//         urls:allUrls
//     })
// })

app.use('/user',userRoute);
app.use('/url',restrictToLoggedinUserOnly,urlRoute);
app.get('/url/:shortId',async(req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },{
            $push:{
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );
    res.redirect(entry.redirectURL);
});
app.use('/',checkAuth,staticRoute);

//listen 
app.listen(PORT,()=> console.log(`App is listeninig on ${PORT}`));