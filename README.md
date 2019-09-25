# Faster-Petrax

By: Cattalol

Tera-Toolbox / Tera-Proxy QoL module for faster Pit of Petrax runs. 

To be specific, this module will save you roughly 10 seconds (more or less, depending on how many dashes/jumps/blinks/etc your class offers) as you will no longer need to spend time manually walking up to Petrax when he spawns.

You (as the user of this content) are solely responsible for your own actions and any consequences that result from your actions.

## Proxy compatibility:
- Tested on Caali's proxy only.
- To bypass the current (as of 2019-09-25) built-in blacklist in [Tera-Proxy](https://github.com/tera-proxy/tera-proxy), rename the module folder to anything that doesn't contain the phrase "faster-petrax" (e.g. "FstPtrx").

## Usage:
- When enabled, this module will teleport you to Petrax (either behind or in front, dependent on settings) **_when the BAM spawns_**.
   - This means you will not teleport to the boss if your spawn render distance is too low; set _**PC View Distance**_ to the maximum value.
   - This means you will not be teleported beside Petrax until _**after**_ interacting with the computer terminal at the start of the dungeon.
   - If you did not kill the BAM, and you are re-entering the dungeon, this means you will be teleported beside Petrax _**immediately**_ upon entering the dungeon.
- Edit config.json or access the commands detailed below, to modify settings. Modifications are persistent between game sessions.

## Commands (in the toolbox/proxy channel):
### fasterPetrax 
- Toggles enable/disable 
### fasterPetrax facing
- Toggles teleport location between front/back of Petrax's spawn.
### fasterPetrax distance [number > 0 in game distance units]
- Sets teleport distance away from Petrax. 
- Note: 25 game-distance-units is equivalent to 1 meter.
### fasterPetrax delay [number > 0 in milliseconds]
- Sets the delay between detecting Petrax spawn and teleporting to Petrax.
### fasterPetrax settings
- Prints the current settings of the module.
### fasterPetrax [anything else]
- Prints the available commands in the toolbox/proxy channel.
### toPetrax
- Manual teleport to the designated position in front or behind Petrax's spawn. 
- This will not work outside of the dungeon.

## Config.json Properties
### enabled [true/false]
- Whether this module is enabled upon starting the game
### back [true/false]
- If true, the location you will be teleported to will be to Petrax's back. If false, then you will be teleported to Petrax's front.
### teleportDelay [number > 0]
- Sets the delay between the NPC spawning and you teleporting.
