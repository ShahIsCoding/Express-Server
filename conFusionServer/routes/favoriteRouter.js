const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res) =>{res.sendStatus = 200;})
.get(authenticate.verifyUser,(req,res,next)=>{
  Favorite.find({user:req.user._id})
  .populate('user')
  .populate('dishes')
    .then((list) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(list);
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .then((fav) => {
        if(fav){
            var len = req.body.length;
            for(var i = 0;i<len;i++){
                if(fav.dishes.indexOf(req.body[i]._id) === -1){
                    fav.dishes.push(req.body[i]._id);
                }
            }
            fav.save()
            .then((fav) =>{
                console.log('Favorite Dishes Added to the  List'+req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);   
            },(err)=> next(err))            
        }
        else{
            Favorite.create({user:req.user._id,dishes:req.body})
            .then((fav)=>{
                console.log('Favorite Dishes List Created'+ req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);   
            },(err)=> next(err))
        } 
    },(err)=> next(err)) 
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOneAndRemove({user:req.user._id})
    .then((list) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(list);
    },(err)=>next(err))
    .catch((err)=> next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res) =>{res.sendStatus = 200;})
.get(authenticate.verifyUser,(req,res,next)=>{
    err = new Error('GET Operation not suppoerted on favorite/:'+req.params.dishId);
    err.status = 403;
    return next(err);
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .then((fav) => {
        if(fav){
            if(fav.dishes.indexOf(req.params.dishId) === -1){
                fav.dishes.push(req.body[i]._id);
            }
            fav.save()
            .then((fav) =>{
                console.log('Favorite Dishes Added to the  List'+req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);   
            },(err)=> next(err))            
        }
        else{
            Favorite.create({user:req.user._id,dishes:req.body})
            .then((fav)=>{
                console.log('Favorite Dishes List Created'+ req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);   
            },(err)=> next(err))
        } 
    },(err)=> next(err)) 
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    err = new Error('PUT Operation not suppoerted on favorite/:'+req.params.dishId);
    err.status = 403;
    return next(err);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;