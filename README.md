# AHP's Streaming App

This project is in the initial development stages, but just to give a brief overview, I'm working on a perspective web application that will allow for public userbase to create, configure, and employ a host of different features and functionalities to enhance their streaming experience, particularly by creating graphical layouts that respond in real time to state variables that can be managed by a user interface as well as the deployment of a remote bot that can interface directly through a chat application.

Currently in the initial stages I'm utilizing:

* SvelteKit - for frontend UI components as well as some Server Side Logic
* SupaBase - for DB and user auth
* Skeleton - a Tailwind based UI library that also supports custom theming

## Exciting future developments

* **Custom functionality for layout nodes** - Periodic animations / temporary layout elements with custom transitions.
* **Extended node hierarchy** - Support for a full node tree with a parent/child hierarchy, and additional support for logic around lists/mappings of state variables.
* **In browser WYSIWIG style node editing** - Direct editing of nodes through a graphical interface that allows easy sizing and positioning in addition to node content and styles.
* **More complete state logic for node contents** - Support for more custom interpolation, multiple dependent state values, conditional logic and iteration directly supported within node contents.

## Even more future

* **Utilizing the OBS Broswer plugin's support for Service Integration** - Not only being able to apply read information from OBS with regards to state logic but full
integration of UI interaction through OBS itself to make editing more seemless and not require a separate browser.
* **Integration with AHP Twitch Bot** - Direct support for deployment of bots using the JSON spec described in my related project, AHP Twitch Bot, including support for automated co-development of layouts and bot functionality.