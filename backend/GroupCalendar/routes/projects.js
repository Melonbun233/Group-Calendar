var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var projectController = require('../controllers/peojectController');
var url = require('url');  

/* project/event */
// check uuid in session firstly for every methods

/**
 * GET: 
 * req: projectId, userId
 *
 * res: event(json)
 */
router.get('/event', function(req, res){
	projectController.getEvents;
});

/**
 * PUT: 
 * req: projectId, eventId, userId, updatedInfo(json)
 *
 * res: event(json)
 */
router.put('/event', function(req, res){
	projectController.putEvents;
});

/**
 * POST: 
 * req: projectId, userId, event(json)
 *
 * res: eventId
 */
router.post('/event', function(req, res){
	projectController.createEvents;
});

/**
 * DELETE: 
 * req: projectId, eventId
 *
 * res: end
 */
router.delete('/event', function(req, res){
	projectController.deleteEvents;
});

/**
 * GET: 
 * req: projectId, userId
 *
 * res: project(json)
 */
router.get('/', function(req, res){
	projectController.getProject;
});

/**
 * PUT: 
 * req: projectId, userId, updatedInfo(json)
 *
 * res: project(json)
 */
router.put('/', function(req, res){
	projectController.putProject;
});

/**
 * POST: 
 * req: userId, project(json)
 *
 * res: projectId
 */
router.post('/', function(req, res){
	projectController.createProject;
});

/**
 * DELETE: 
 * req: projectId, projectId
 *
 * res: end
 */
router.delete('/', function(req, res){
	projectController.deleteProject;
});

/**
 * DELETE: 
 * req: projectId, userId, invitedId
 *
 * res: end
 */
router.post('/invite', function(req, res){
	projectController.inviteUser;
});


module.exports = router;