const PETRAX_ZONE_ID = 9126;
const PETRAX_NPC_ID = { huntingZoneId : 126, templateId : 107 };
const WITHERED_PETRAX_NPC_ID = { huntingZoneId : 126, templateId : 1071 };
// Location data (modify these to your preference so you don't need to move after teleporting to begin your combos).
const PETRAX_SPAWN_LOC_BACK = { x: -130616, y: -113510, z: 248 };
const PETRAX_SPAWN_LOC_FRONT = { x: -130587, y: -113981, z: 248 };

module.exports = function fasterPetrax(dispatch) {	
	const command = dispatch.command;
	let currentZone = -1;
	let id = -1;
	let config = require('./config.json')
	
	// Get the current zone ID (so we know if/when we enter the dungeon).
	dispatch.hook('S_LOAD_TOPO', 3, (event) => {
		currentZone = event.zone;
		if (event.zone == PETRAX_ZONE_ID) {
			command.message(`Welcome! Faster-Petrax is currently ${config.enabled ? 'enabled' : 'disabled'}.`);
			command.message(`Teleports facing Petrax's ${getPositionString()}`)
		}
	});
	
	// Get our gameID.
	dispatch.hook('S_LOGIN', 12, (event) => {
		id = event.gameId
	});	
	
	// Check if the NPC is Mr. Petrax himself.
	dispatch.hook('S_SPAWN_NPC', 11, (event) => {		
		if (config.enabled && (compareNPC(event, PETRAX_NPC_ID) || compareNPC(event, WITHERED_PETRAX_NPC_ID))) {
			setTimeout(teleportToPetrax, 500);
		}		
	});
	
	// Enable/Disable.
	command.add('fasterPetrax', (arg) => {
		if (arg != undefined){
			arg = arg.toLowerCase();		
		}
		switch (arg) {
			case 'facing':
				config.back = !config.back;
				command.message(`Teleport facing Petrax's ${getPositionString()}`);
				break;
			
			default:
				config.enabled = !config.enabled;			
				command.message(`Now ${config.enabled ? 'enabled' : 'disabled'}.`);		
				break;
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
	
	// Do the thing... y'know... the "thing".
	function teleportToPetrax() {
		command.message(`Teleporting to ${getPositionString()} of Petrax spawn.`)
		dispatch.toClient('S_INSTANT_MOVE', 3, {
			gameId: id,
			loc: getTeleportLoc(),
			w: 0
		});
	}
	
	// zzz
	function getPositionString() {
		return config.back ? `back` : `front`;
	}
	
	// teleport to his front or back?
	function getTeleportLoc() {
		return config.back ? PETRAX_SPAWN_LOC_BACK : PETRAX_SPAWN_LOC_FRONT;
	}
	
	// Check if huntingzoneid and templateid are equivalent. Return true if matching, false if not matching.
	function compareNPC(checkData, referenceData){
		return (checkData.huntingZoneId == referenceData.huntingZoneId && checkData.templateId == referenceData.templateId);
	}
}
