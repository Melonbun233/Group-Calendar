var Project = require('../models/project');

async function putEventOwner (req, res) {
	try{
		await Project.isOwner(req.body.projectId, req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		await Project.putEventOwner(req.body.eventId, req.body.update);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({error});
	}
}

// return eventId[]
async function createEvents (req, res){
	try{
		await Project.isOwner(req.body.projectId, req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	var eventId;
	try{
		eventId = await Project.createEvents(req.body.projectId, req.body.event);
		res.status(200).json({eventId});
	} catch (error) {
		res.status(400).json({error});
	}
}

async function deleteEvents (req, res){
	try{
		await Project.isOwner(req.body.projectId, req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}
	
	try{
		await Project.deleteEvents(req.body.eventId);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({error});
	}
}


async function getProject (req, res) {
	var projectId = req.param('projectId');
	var userId = req.param('userId');

	try{
		await Project.isUserInProject(projectId, userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	/* get project */
	var project;
	var events;
	var memberId;
	try{
		project = await Project.getProject(projectId);
		events = await Project.getEvents(projectId);
		memberId = await Project.getMemberId(projectId);
	} catch (error) {
		return res.status(400).json({error});
	}

	/* add events to json project */
	project.events = events;
	project.memberId = memberId;

	res.status(200).json({project});
}

async function putProject(req, res){
	try{
		await Project.isOwner(req.body.projectId, req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		await Project.putProject(req.body.projectId, req.body.update);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({error});
	}
}

async function createProject (req, res){
	try{
		var projectId = await Project.createProject(req.body.project, req.body.userId);
		res.status(200).json({projectId});
	} catch (error){
		res.status(400).json({error});
	}
}

async function deleteProject (req, res){
	try{
		await Project.isOwner(req.body.projectId, req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		await Project.deleteProject(req.body.projectId);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({error});
	}
}

module.exports = {
	putEventOwner,
	createEvents,
	deleteEvents,
	getProject,
	putProject,
	createProject,
	deleteProject,
	// inviteUser
}