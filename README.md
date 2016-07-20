# Collaborative note taking Ionic application

A collaborative touch enabled ionic application for note taking. Draw notes on canvas and store them the server. The app is in development stage. 

## Table of contents
* [Getting started] (#getting-started)
* [Tools and Libraries] (#libraries-used)
* [Documentation] (#documentation)
* [File Structure] (#file-structure)
* [Screenshots] (#screenshots)

## Getting started
Download and install [cordova] (https://cordova.apache.org/#getstarted) and [ionic] (http://ionicframework.com/getting-started/).

Run the following command to build a sample tabs project:

```javascript
ionic start collaborative-drawing-app tabs
cordova plugin add cordova-plugin-inappbrowser
```
### How to run ?
Clone this repository. Replace the www directory and run the following.

```javascript
ionic build ios
ionic run ios
```
## Tools and Libraries
* [easel.js] (http://www.createjs.com/easeljs) : For working with HTML5 canvas
* [gulp] (http://gulpjs.com) : For compiling sass files and minifying code

## Documentation
* Touch enablement on canvas
* Google oauth

For complete documentation on the above features, refer to the Wiki

## File Structure
```
├── collaborative-drawing-ionic/
│   ├── scss
│   │   ├── ionic.app.scss
│   ├── www
│   │   ├── index.html
│   │   ├── templates
│   │   ├── js
│   │   │   ├── controllers
│   │   │   ├── services
```

