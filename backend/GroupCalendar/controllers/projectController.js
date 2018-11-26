var Project = require('../models/project');
var User = require('../models/project');

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
/**
 * addEventMember will only accept the req from project members. Owner could not use this function
 */

 async function addEventMember (req, res){
 	var projectId = req.body.projectId;
 	var userId = req.body.userId;
 	var eventIds = req.body.eventId;
 	var isValidMember;
 	console.log(projectId);
 	console.log(userId);
 	console.log(eventIds);

 // 	try {
 // 		await Project.isUserInProject(projectId, userId);
 // 	} catch (error) {
 // 		return res.status(400).json({error});
 // 	}

	// // this part is optional if owner could vote
	// try {
	// 	isValidMember = !(await Project.isOwner2(projectId, userId));
	// } catch (error) {
	// 	return res.status(400).json({error});
	// }

	try {
 		isValidMember = await Project.isUserInProject2(projectId, userId);
 	} catch (error) {
 		return res.status(400).json({error});
 	}


	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	// try{
	// 	if(await Project.isUserInEvents(eventIds, userId)){
	// 		return res.status(400).send('This user has already been in the event')
	// 	}
	// }	catch (error) {
	// 	res.status(400).json({error});
	// }
	try {
		await Project.addUserInEvents(eventIds, userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json();

}

async function deleteEventMember (req, res){
 	var projectId = req.body.projectId;
 	var userId = req.body.userId;
 	var eventIds = req.body.userId;
 	var isValidMember;

 	try {
 		isValidMember = await Project.isUserInProject2(projectId, userId);
 	} catch (error) {
 		return res.status(400).json({error});
 	}

	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	try {
		await Project.deleteUserInEvents(eventIds, userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json();

}

async function deleteEventMemberAll (req, res){
 	var projectId = req.body.projectId;
 	var userId = req.body.userId;
 	var isValidMember;

 	try {
 		isValidMember = await Project.isUserInProject2(projectId, userId);
 	} catch (error) {
 		return res.status(400).json({error});
 	}

	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	try {
		await Project.deleteUserInEventsAll(userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json();

}


async function inviteUser (req, res){
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var invitedEmail = req.body.invitedEmail;
	var invitedId;

	//this part is optional
	try {
		if(!(await Project.isOwner2(projectId, userId))){
			return res.status(400).send('Only Project Owner can invite');
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		var result = await User.getInfo(invitedEmail);
	} catch (error) {
		return res.status(400).json({error});
	}
	
	if (result == null){
			return res.status(400).send('Could not find the user');
		}
	var invitedId = result.userId;
	
	try {
		if(!(await Project.isUserInProject2(projectId, invitedId))){
			return res.status(400).send('Invited user has been in the project');
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try {
		await Project.addUserInInviteList(projectId, userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json();

}

async function deleteInvitedUser (req, res){
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var invitedEmail = req.body.invitedEmail;
	var invitedId;

	//this part is optional
	try {
		if(!(await Project.isOwner2(projectId, userId))){
			return res.status(400).send('Only Project Owner can delete invited user');
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		var result = await User.getInfo(invitedEmail);
	} catch (error) {
		return res.status(400).json({error});
	}

	if (result == null){
			return res.status(400).send('Could not find the user');
		}
	var invitedId = result.userId;

	try {
		if(!(await User.isUserInInviteList(projectId, invitedId))){
			return res.status(400).send('This user is not in the InvitedList');
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try {
		await Project.deleteUserInInviteList(projectId, userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json();

}


async function deleteMembers(req, res){
	try{
		await Project.deleteMembers(req.body.projectId, req.body.userId);
		res.status(200).end();
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
	addEventMember,
	deleteEventMember,
	deleteEventMemberAll,
	inviteUser,
	deleteInvitedUser,
	deleteMembers
}