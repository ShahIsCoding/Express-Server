var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



exports.getToken = function(user){
        return jwt.sign(user,config.secretKey,
            {expiresIn:3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassort = 
        passport.use( new JwtStrategy(opts,(jwt_playload,done) =>{
            User.findOne({_id:jwt_playload._id},(err,user)=>{
                if(err) return done(err,false);
                else if(user) return done(null,user);
                else return done(null,false);
            });
        }));
exports.verifyUser = 
        passport.authenticate('jwt',{session:false});

exports.verifyAdmin = (req,res,next) =>{
    if(req.user.admin) next();
    else {
        err = new Error('You are not an admin ');
        err.status = 403;
        return next(err);
    }
}