require('dotenv').config()
const express = require('express')
const app = express()

const ejs = require('ejs')
const connectDB = require('./db/connect')
const User = require('./models/user')
const bodyParser = require('body-parser')
const md5 = require('md5')


app.use(bodyParser.urlencoded({extended:true}))


app.use(express.static("public"))
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/register',(req,res)=>{
    res.render("register");
})

app.post('/register',async (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password) 
    })

    await newUser.save().then((doc)=>{
        
        res.render(('secrets'))
    }).catch((err)=>{
        console.log(err)
    })
})

app.post("/login",async (req,res)=>{
    const username = req.body.username
    const password = md5(req.body.password)

    const found = await User.findOne({email: username})
    if (!found){
        throw new Error("No Match")
    }

    if (found.password === password){
        res.render('secrets')
    }
    else{
        throw new Error("No Authentication")
    }
})

const port = 3000

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`Server is listening on port 3000`)
        })
    } catch (error) {
        
    }
}

start()