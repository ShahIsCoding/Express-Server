const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('../routes/cors');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res) =>{res.sendStatus = 200;})
.get(cors.cors,(req,res,next) =>{
    Leaders.find({})
        .then((leader) =>{
            console.log('GETTING THE VALUES IN LEADER');
            res.statusCode = 200;
            res.setHeader('Context-Type','application/json');
            res.json(leader);
        },(err)=> next(err))
        .catch((err)=>next(er));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
        .then((leader) =>{
            console.log('CREATED THE LEADER : '+ req.body);
            res.statusCode = 200;
            res.setHeader('Context-Type','application/json');
            res.json(leader);
        },(err)=> next(err))
        .catch((err)=>next(er));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Operation not supported by leader');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
        .then((leader) =>{
            console.log('DELETED THE LEADERS');
            res.statusCode = 200;
            res.setHeader('Context-Type','application/json');
            res.json(leader);
        },(err)=> next(err))
        .catch((err)=>next(er));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res) =>{res.sendStatus = 200;})
.get(cors.cors,(req,res,next) =>{
    Leaders.findById(req.params.leaderId)
        .then((leader) =>{
            console.log('GETTING THE LEADER : '+ req.params.leaderId);
            res.statusCode = 200;
            res.setHeader('Context-Type','application/json');
            res.json(leader);
        },(err)=> next(err))
        .catch((err)=>next(er));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST Operation not supported by leader: '+ req.params.leaderId);})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,
        {$set:req.body},{new:true})
            .then((leader)=>{
                console.log('UPDATING THE LEADER VALUES: '+ req.params.leaderId);
                res.statusCode = 200;
                res.setHeader('Context-Type','application/json');
                res.json(leader);
            },(err)=> next(err))
            .catch((err)=>next(er));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
        .then((leader) =>{
            console.log('Deleted the leader:'+req.params.leaderId);
            res.statusCode =200;
            res.setHeader('Context-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err) => next(err));
});

module.exports = leaderRouter;