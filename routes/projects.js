const projects = require('express').Router();

const User = require('../models/user');
const Project = require('../models/project');
const Question = require('../models/question');


// read the projects that the user created.
projects.get('/', function(req, res){

  Project.find({createdBy: req.userId}, function(err, projects){
    if(err) return res.status(500).json({success: false, msg: err.message});
    if(!projects)  return res.status(404).json({success: false, msg: 'projects not found'});

    res.status(200).json({success: true, projects});
  });
});


// read specific project by it's id.
projects.get('/:id', function(req, res){
  Project.findById(req.params.id, function(err, project){
    if(err) return res.status(500).json({success: false, msg: err.message});
    if(!project)  return res.status(404).json({success: false, msg: 'project not found'});

    res.status(200).json({success: true, project})
  });
});


// create a project.
projects.post('/', function(req, res){

  Project.create(req.body.project, function(err, project){
    req.body.project.createdBy = req.userId;
    if(err) return res.status(400).json({success: false, msg: err.message});

    res.status(200).json({success: true, msg: 'project stored successfully', project});
  });
});


// create a question in specific project selected by its id
projects.post('/:id/questions', function(req, res){
  // store question to database.
  Question.create(req.body.question, function(err, question){
    if(err) return res.status(500).json({success: false, msg: err.message});
    //add reference of a question to the project.
    Project.findByIdAndUpdate(req.params.id, {$addToSet: {'questions': question._id}}, function(err, project){
      if(err) return res.status(500).json({success: false, msg: err.message});
      res.status(200).json({success: true, question});
    });
  });
});


module.exports = projects;
