# Project Overview: "Велика България"

This project is a web-based fantasy strategy game, "Велика България" (Great Bulgaria).

## File Structure & Functions

### Core & Logic Files
- `database.js`: Manages local data persistence for game state.
- `logic.js`: Contains main game mechanics and loop logic.
- `mechanics.js`: Additional game mechanics rules.
- `rpg_system.js`: RPG elements: hero stats, leveling, and management.
- `economy.js`: Handles resources (gold), production, and trade.
- `time.js`: Manages game time, seasons, and years.
- `battle.js`: Battles and strategic combat simulation.
- `armyMarket.js`: UI and logic for army and troop management.
- `barracks.js`: Barracks management logic.
- `diplomacy.js`: Diplomatic relationships.
- `expeditions.js`: Logic for historical expeditions.
- `quests.js`: Quest system and rewards.
- `regions.js`: Map regions and management.
- `rivalry.js`: Rivalry systems between states.
- `soloMode.js`: Special solo gameplay modes.
- `world_data.js`: Global configuration and data.
- `troopsData.js`: Data definitions for various troop types.
- `items.js`: Defines various items available in the game.

### UI & Presentation Files
- `index.html`: Main entry point, structure of the game interface.
- `style.css`: Global styles, layout, theme definitions, and media queries for responsiveness.
- `ui.js`: Manages user interface interactions, popups, sidebar menu, and dynamic updates to the DOM.
- `skills-ui.js`: Specific UI components related to the skills system.
- `skills.js`: Logic behind the skills system.
- `events.js`: Event system for UI updates or in-game events.
- `classes.js`: Class definitions for game entities.
