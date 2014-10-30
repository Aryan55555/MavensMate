/* compile-metadata commander component
 * To use add require('../cmds/compile-metadata.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var util 							= require('../lib/util').instance;
var Project 					= require('../lib/project');
var OrgConnection 		= require('../lib/org-connection');

var Command = function(){};

Command.execute = function(command) {
	var self = command;

	util.getPayload()
		.then(function() {
			global.project = new Project();
			return global.project.initialize();
		})
		.then(function() {
			return OrgConnection.add(global.payload.username, global.payload.password, global.payload.orgType);
		})
		.then(function(result) {
			util.respond(self, result);
		})
		['catch'](function(error) {
			util.respond(self, 'Could not create org connection', false, error);
		})
		.done();	
};

exports.command = Command;
exports.addSubCommand = function(program) {
	program
		.command('new-connection')
		.version('0.0.1')
		.description('Adds a new deployment connection')
		.action(function(/* Args here */){
			Command.execute(this);
		});
};