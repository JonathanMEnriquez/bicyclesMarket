var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();
var Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(session({secret: 'drowssap'}));
app.use(express.static(path.join(__dirname, './bicycleApp', '/dist')));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bicycleApp');

var usersSchema = new mongoose.Schema({
    first_name: {type: String, required: true, minlength: 3},
    last_name: {type: String, required: true, minlength: 3},
    email: {type: String, required: true, minlength: 8, unique: true},
    password: {type: String, required: true, minlength: 8},
    bicycles: { type: Schema.Types.ObjectId, ref: "Bicycles" }
}, {timestamps: true});

var bicyclesSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 3},
    desc: {type: String, required: true, minlength: 3},
    price: {type: String, required: true, minlength: 8, unique: true},
    location: {type: String, required: true, minlength: 8},
    bicycles: { type: Schema.Types.ObjectId, ref: "Bicycles" },
    imgUrl: { type: String },
    _user: { type: Schema.Types.ObjectId, ref: "Users" }
}, {timestamps: true});

mongoose.model('Users', usersSchema);
mongoose.model('Bicycles', bicyclesSchema);
var User = mongoose.model('Users');
var Bike = mongoose.model('Bicycles');

// login
app.post('/api/login', function(req, res) {
    User.findOne({email: req.body.email}, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.json({message: "Error", errors: err});
        } else {
            if (foundUser == null) {
                res.json({message: "Incorrect login info"});
            } else {
                if (foundUser.password == req.body.password) {
                    req.session.userId = foundUser._id;
                    res.json({message: "Logged in", data: foundUser});
                } else {
                    res.json({message: "Incorrect login info"});
                }
            }
        }
    })
})

// register
app.post('/api/user', function(req, res) {
    let newUser = new User(req.body);
    newUser.save(function(err, user) {
        if (err) {
            console.log('error in post', err);
            res.json({message: "Error", errors: err});
        } else {
            req.session.userId = user._id;
            res.json({message: "Successfully created a new user", data: user});
        }
    })
})

// get  all of everything!!!
app.get('/api/bikes', function(req, res) {
    User.find({}, function(err) {
        if (err){
            console.log(err);
            res.json({message: "Error", errors: err});
        }
    })
    .populate('bicycles')
    .exec(function(err, users) {
        if (err){
            console.log(err);
            res.json({message: "Error", errors: err});
        } else {
            res.json({message: "Success", users: users});
        }
    })
})

app.all('*', (req, res, next)=> {
    res.sendFile(path.resolve('./bicycleApp/dist/index.html'));
})

app.listen(8000, function() {
    console.log('listening on port 8000');
})