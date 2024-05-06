const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
// Load variables
dotenv.config();

//const secret = crypto.randomBytes(64).toString('hex');
// Start Server
const app = express();
const secret = uuidv4()

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 36000000 }
}))

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Home Route
app.get('/', (req, res) => {
    res.sendFile('signup.html', {root: 'public'});
});
app.get('/sucess', (req, res) => {
    res.sendFile('sucess.html', {root: 'public'});
});

//Cancel
app.get('/cancel', (req, res) => {
    res.sendFile('cancel.html', {root: 'public'});
});



mongoose.connect('mongodb://localhost:27017/Triple-T-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connected to Database");
}).catch((err)=>{
    console.error("Error connecting to Databse:", err);
});

const orderSchema = new mongoose.Schema({
    username: String,
    items: [
        {
            title: String,
            quantity: Number,
            price: Number,
            
        }
    ],
    totalPrice: Number,
});

const Order = mongoose.model('Order', orderSchema);

app.post('/add-to-cart', async (req, res) => {
    try {
        const { cartItems, price, username } = req.body;

        //console.log("Request Body:", req.body);
        // console.log("Received username:", username);
        // console.log("Received cartItems:", cartItems);
        if (!cartItems || !Array.isArray(cartItems)) {
            return res.status(400).json({ error: 'Cart items are missing or invalid' });
        }

        //const name = username;
        const totalPrice = Number(price);
        const orderItems = cartItems.map(item => ({
            title: item.title,
            quantity: Number(item.quantity), // Convert quantity to number
            price: Number(item.price.replace(/[^0-9.]+/g, ''))
        }));

        const order = new Order({
            username: username,
            items: orderItems,
            totalPrice: totalPrice
        });

        await order.save();

//        res.redirect('/success');
        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}));

var db = mongoose.connection;

db.on('error',()=> console.log("Error in connecting to Database"));
db.once('open', ()=>console.log("Connected to Database"));


app.post("/sign_up", async (req,res)=>{
    var id = Date.now().toString();
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var phno = req.body.phno;
    var address = req.body.address
    var password = req.body.password;
    var gender = req.body.gender;

    var data = {
        "id": id,
        "fname": fname,
        "lname": lname,
        "email": email,
        "phno": phno,
        "address": address,
        "password": password,
        "gender": gender
    }

    const existingUser = await db.collection('users').findOne({email: req.body.email});
    if(existingUser){
        res.send("User already exists");
    }else {
        await db.collection('users').insertOne(data);
            console.log("Record Inserted Successfully");
            return res.redirect('login.html');
    }
});


app.get("/",(req,res)=>{
    return res.redirect('login.html');
})
app.post("/login", async (request, response)=>{
    

    try {
        //get data from index.html form
        const email = request.body.email;
        const password = request.body.password;

        //now get data from database
        const user = await db.collection('users').findOne({ email: email });

        if (!user) {
            response.send("Information not match. Please create account first");
        } else {
            if (user.password === password) {
                console.log("login successfully");
                const username = user.fname; // Assuming 'name' is the username field in your user document
                request.session.username = username;
                response.redirect(`/products.html?name=${username}`);
            } else {
                console.log("password not match");
                response.send("Password not match");
            }
        }
    } catch (error) {
        console.log("Invalid Information", error);
        response.status(500).send("Internal server error");
    }
});

app.get("/profile/:name", async (req, res) => {
    const userName = req.params.name;

    try {
        
        const user = await db.collection('users').findOne({ fname: userName });
        

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json({
            name: user.fname,
            email: user.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('products.html', (req, res) => {
    const {name} = req.query;
    if (!name) {
        return res.redirect('/login.html');
    }
    res.sendFile('products.html', { root: 'public' });
});

app.get('/login.html', (req,res)=> {
    res.sendFile('login.html', {root: 'public'});
});

app.get('/signout', (req, res) => {
    // Assuming you are using sessions, clear the session data upon sign-out
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Redirect the user to the login page after sign-out
        res.redirect('/login.html');
    });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});