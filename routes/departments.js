const departments = require('express').Router();
// load model.
const Department = require('../models/department');


// read all departments.
departments.get('/', function(req, res){
  Department.find({}, function(err, departments){
    if(err) return res.status(500).json({success: false, msg: 'server error'});
    if(!departments) return res.status(404).json({success: false, msg: 'Departments not found'});
    res.status(200).json({success: true, departments});
  });
});


// read department by id.
departments.get('/:id', function(req, res){
  Department.findById(req.params.id, function(err, department){
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!department) return res.status(404).json({success: false, msg: 'Department not found'});
    res.status(200).json({success: true, department});
  });
});


// create a department.
departments.post('/', function(req, res){
  // if the user is not an admin.
  if(!req.isAdmin)  return res.status(401).json({success: false, msg: 'You are not allowed to create a department'});

  let createDepartment = {name: req.body.department.name,
    head: req.userId,
    subjects: req.body.department.subjects,
    professors: req.body.department.professors
  };

  Department.create(createDepartment, function(err, department){
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    res.status(200).json({success: true, department});
  });
});


// delete department by id.
departments.delete('/:id', function(req, res){
  // Search for the department.
  Department.findById(req.params.id, function(err, department){
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    else if(!department)  return res.status(404).json({success: false, msg: 'Department not found'});
    // if the user is not the department head.
    else if(req.userId.toString() !== department.head.toString())
      return res.status(401).json({success: false, msg: 'Only department head is allowed to delete the department'});
    // if everything is good then delete the department.
    else{
      Department.findByIdAndRemove(department._id, function(err, department){
        if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
        res.status(200).json({success: true, msg: 'Deleted successfuly'});
      });
    }
  });
});

/* ========================== Subjects =========================== */

// add subject to specific department by department head.
departments.post('/:id/subjects/:subjectId', function(req, res){

  // store the subject to subjects collection.
  Department.findById(req.params.id, 'head', function(err, department){

    // validate department and check if the request from the department head.
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!department) return res.status(404).json({success: false, msg: 'Department not found'});
    if(req.userId.toString() !== department.head.toString())
      return res.status(401).json({success: false, msg: 'Only department head is allowed to add subjects'});

    else
      // update the department subjects.
      department.update({$addToSet: {'subjects': req.params.subjectId}}, function(err, department){
        if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
        if(!department) return res.status(400).json({success: false, msg: 'subject not stored'});

        return res.status(200).json({success: true, department});
      });
  });
});


// remove a subject from department.
departments.delete('/:id/subjects/:subjectId', function(req, res){

  // find the requested departments.
  Department.findById(req.params.id, 'head', function(err, department){

    // validate department and check if the request from the department head.
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!department) return res.status(404).json({success: false, msg: 'department not found'});
    if(req.userId.toString() != department.head.toString())
      return res.status(401).json({success: false, msg: 'only department head is allowed to delete subjects'});

    // update the department subjects.
    department.update({$removeFromSet: {'subjects': req.params.subjectId}}, function(err, department){
      if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});

      return res.status(200).json({success: true, department});
    });
  });
});

/* ========================== Professors =========================== */

// add professor to the department.
departments.post('/:id/professors/:profId', function(req, res){

  // find the requested department.
  Department.findById(req.params.id, 'head', function(err, department){

    // validate department and check if the request from the department head.
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!department) return res.status(404).json({success: false, msg: 'department not found'});
    // if the user is not the department head.
    if(req.userId.toString() !== department.head.toString())
      return res.status(401).json({success: false, msg: 'only department head is allowed to add professors'});

    // update the department subjects.
    department.update({$addToSet: {'professors': req.params.profId}}, function(err, department){
      if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});

      res.status(200).json({success: true, department});
    });
  });
});


// add professor to the department.
departments.delete('/:id/professors/:profId', function(req, res){

  // find the requested department.
  Department.findById(req.params.id, 'head', function(err, department){

    // validate department and check if the request from the department head.
    if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});
    if(!department) return res.status(404).json({success: false, msg: 'department not found'});
    if(req.userId.toString() !== department.head.toString())
      return res.status(401).json({success: false, msg: 'only department head is allowed to delete professors'});

    // update the department subjects.
    department.update({$removeFromSet: {'professors': req.params.profId}}, function(err, department){
      if(err) return res.status(500).json({success: false, msg: 'Something went wrong, ' + err});

      res.status(200).json({success: true, department});
    });
  });
});

module.exports = departments;
