var express=require("express");
var bodyParser=require("body-parser");
const mongoose = require('mongoose');


mongoose.connect('mongodb://mongo:27017/Akshara');
var db=mongoose.connection;


db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));


//Validations
function isValidEmail(email) {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phone) {    
    return /^\d{10}$/.test(phone);
}

app.post('/sign_up', function(req,res)
{
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	var phone =req.body.phone;
	var location=req.body.location;
	var cropname=req.body.cropname;
	var cropdisease=req.body.cropdisease;

	var data = 
	{
		"name": name,
		"email":email,
		"password":pass,
		"phone":phone,
		"location":location,
		"cropname":cropname,
		"cropdisease":cropdisease
	}


    if (!isValidEmail(email)) {
        return res.status(400).send("Invalid email address");
    }
	if (!isValidPhoneNumber(phone)) {
        return res.status(400).send("Invalid phone number");
    }

	db.collection('details').insertOne(data, function (err, collection) {
		if (err) throw err;
		console.log("Record inserted Successfully");
		console.log(data);
	  });
		
	return res.redirect('/signup_success.html');
})


app.get('/',function(req,res){
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('index.html');
})

app.listen(3000, function() {
console.log("server listening at port 3000");
});