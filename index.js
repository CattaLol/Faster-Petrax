const fs = require('fs');
const path = require('path');
const configJsonPath = path.resolve(__dirname,'config.json');

const PETRAX_ZONE_ID = 9126;
const SCOREBOARD_PETRAX_NPC_ID = { huntingZoneId : 126, templateId : 107 };
const WITHERED_PETRAX_NPC_ID = { huntingZoneId : 126, templateId : 1071 };

module.exports = function fasterPetrax(dispatch) {	
	const command = dispatch.command || dispatch.require.command;
	let currentZone = -1;
	let id = -1;
	let config = loadJson(configJsonPath);
	let petraxSpawnLoc = undefined;
	let petraxAngle = undefined
	
	// Get the current zone ID (so we know if/when we enter the dungeon).
	dispatch.hook('S_LOAD_TOPO', 3, (event) => {
		currentZone = event.zone;
		if (event.zone == PETRAX_ZONE_ID) {
			command.message(`Welcome! Faster-Petrax is currently ${config.enabled ? 'enabled' : 'disabled'}.`);
			command.message(`Teleport set to ${config.teleportDistance} units, facing Petrax's ${getPositionString()}`)
		}
	});
	
	// Get our gameID.
	dispatch.hook('S_LOGIN', 13 , (event) => {
		id = event.gameId
	});	
	
	// Check if the NPC spawned is Mr. Petrax himself.
	dispatch.hook('S_SPAWN_NPC', 11, (event) => {		
		if (compareNPC(event, SCOREBOARD_PETRAX_NPC_ID) || compareNPC(event, WITHERED_PETRAX_NPC_ID)) {
			petraxSpawnLoc = Object.assign({}, event.loc);
			petraxAngle = event.w
			if (config.enabled){
				command.message(`Petrax spawn detected! Teleporting in ${config.teleportDelay/1000} seconds!`)
				setTimeout(teleportToPetrax, config.teleportDelay);
			}
			else{
				command.message(`Petrax spawn detected, but module is currently disabled.`)
			}
		}		
	});
	
	// In-game access to settings
	command.add('fasterPetrax', (arg, arg2) => {
		if (arg != undefined){
			arg = arg.toLowerCase();
			switch (arg) {
				case 'facing':
					config.back = !config.back;
					command.message(`Teleport facing Petrax's ${getPositionString()}`);
					saveJson(config, configJsonPath);
					break;
				case 'distance':
					config.teleportDistance = parseInt(arg2);
					command.message(`Teleports ${config.teleportDistance} units away from Petrax (current direction set to facing Petrax's ${getPositionString()})`);
					saveJson(config, configJsonPath);
					break;
				case 'delay':
					config.teleportDelay = parseInt(arg2);
					command.message(`Teleport delay set to ${config.teleportDelay} milliseconds after petrax spawn.`)
					saveJson(config, configJsonPath);
					break;
				// QoL :^)
				case 'settings':
					command.message(`Current Faster-Petrax settings:`)
					command.message(`\t Direction: facing Petrax's ${getPositionString()}.`)
					command.message(`\t Distance: ${config.teleportDistance} units away from Petrax.`)
					command.message(`\t Delay: ${config.teleportDelay} milliseconds after detecting Petrax spawn.`)
					break;
				// QoL :^^)
				default:
					command.message(`Valid Faster-Petrax commands are:`)
					command.message(`\t fasterPetrax facing [arg]: to set direction.`)
					command.message(`\t fasterPetrax distance [arg]: to set distance.`)
					command.message(`\t fasterPetrax delay [arg]: to set teleport delay (in ms).`)
					command.message(`\t fasterPetrax settings: view current settings.`)
					command.message(`\t fasterPetrax: to enable/disable mod.`)
					break;
			}
		}
		else{
			config.enabled = !config.enabled;			
			command.message(`Faster Petrax is now ${config.enabled ? 'enabled' : 'disabled'}.`);
			saveJson(config, configJsonPath);
		}			
	});
	
	// Manual teleport.
	command.add('toPetrax', () => {
		if (currentZone == PETRAX_ZONE_ID) {			
			teleportToPetrax();
		}
		else{
			command.message(`You are not in the Pit of Petrax.`)
		}
	})
	
	// :^)
	function teleportToPetrax() {
		command.message(`Teleporting near Petrax spawn...`)
		if (petraxSpawnLoc != undefined){
			dispatch.toClient('S_INSTANT_MOVE', 3, {
				gameId: id,
				loc: getTeleportLoc(),
				w: 0
			});
		}
		else {
			command.message(`Invalid Petrax Location (undefined)`);
		}
	}
	
	// :ZzZ:
	function getPositionString() {
		return config.back ? `back` : `front`;
	}
	
	// teleport to his front or back?
	function getTeleportLoc() {
		let direction = config.back ? reverseAngle(petraxAngle) : petraxAngle;
		return getDestinationPoint(petraxSpawnLoc, direction, config.teleportDistance);
	}
	
	// Check if huntingzoneid and templateid are equivalent. Return true if matching, false if not matching.
	function compareNPC(checkData, referenceData){
		return (checkData.huntingZoneId == referenceData.huntingZoneId && checkData.templateId == referenceData.templateId);
	}

	// Reverse direction (in radians)
	function reverseAngle(angle){
		return angle > 0 ? angle - Math.PI : angle + Math.PI;
	}
	
	// Get point B from point A, given distance and angle (radians)
	function getDestinationPoint(originLoc, angle, distance, altitudeChange = 0){		
		let dx = distance * Math.cos(angle);
		let dy = distance * Math.sin(angle);
		let newLoc = {
			x : originLoc.x + dx,
			y : originLoc.y + dy,
			z : originLoc.z + altitudeChange
		}
		return newLoc;
	}
	
	// :pepepoggers:
	function saveJson(data, path) {
		fs.writeFile(path, JSON.stringify(data, null, '\t'), 'utf8', function (err) {
			if (!err){
				console.log(`The JSON at ${path} has been successfully updated.`)
			}
			else{
				console.log(`Error writing to ${path}!`)
			}
		});
	}
	
	// :pepeoggers:
	function loadJson(filePath){
		try {
			let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
			if (!data){
				console.log(`Error loading JSON at ${filePath}! Loading default parameters.`)				
			}
			else{
				console.log(`Loaded data from JSON at ${filePath}`)
			}
			return data ? data : getDefaultJson();
		}
		catch (err) {
			console.log(`Error loading JSON at ${filePath}! Loading default parameters.`)
			return getDefaultJson();
		}
	}
	
	// :shrug:
	function getDefaultJson() {
		let settings = {
			enabled: true,
			back : true,
			teleportDelay : 1000, 
			teleportDistance : 500
		}
		return settings;
	}
}
