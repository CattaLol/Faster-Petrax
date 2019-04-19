# Faster-Petrax

By: Cattalol

Tera-Proxy QoL module for faster Pit of Petrax runs. 

To be specific, this module will save you roughly 10 seconds (more or less, depending on how many dashes/jumps/blinks/etc your class offers) as you will no longer need to spend time manually walking up to Petrax when he spawns.

You (as the user of this content) are solely responsible for your own actions and any consequences that result from your actions.

## Proxy compatibility:
- Tested on Caali's proxy only.

## Usage:
- When enabled, this module will teleport you to Petrax (either behind or in front, dependent on settings) when the boss spawns.
   - This means you will be teleported beside Petrax _**after**_ interacting with the computer terminal at the start of the dungeon.
     - You can extend (or reduce) the delay between when Petrax spawns and the timing of the teleport by adjusting the `teleportDelay` property within config.json file.
   - You will also be teleported beside Petrax _**immediately**_ upon entering the dungeon, **if** you had to respawn inside without killing the boss.
- Edit config.json to change default settings.

## Commands (in the proxy channel):
### fasterPetrax 
- Toggles enable/disable 
### fasterPetrax facing 
- Toggles teleport location between front/back of Petrax's spawn.
### toPetrax
- Manual teleport to the designated position in front or behind Petrax's spawn. Does not work outside the dungeon.

## Config.json Properties
### enabled [true/false]
- Whether this module is enabled upon starting the game
### back [true/false]
- If true, the location you will be teleported to will be to Petrax's back. If false, then you will be teleported to Petrax's front.
### teleportDelay [number > 0]
- Sets the delay between the NPC spawning and you teleporting.
