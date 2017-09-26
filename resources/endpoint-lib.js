const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const format = require('string-format');
const constants = require('./constants');

function generateBoilerplate(routerPath) {
    console.log("generating app routing...");
    if (!fs.existsSync(routerPath + 'app')) {
        fs.mkdirSync(routerPath + 'app');
        console.log(routerPath + 'app', "created.");

    }
    if (!fs.existsSync(routerPath + 'app/controllers')) {
        fs.mkdirSync(routerPath + 'app/controllers');
        console.log(routerPath + 'app/controllers', "created.");

    }
    if (!fs.existsSync(routerPath + 'app/middleware')) {
        fs.mkdirSync(routerPath + 'app/middleware');
        console.log(routerPath + 'app/middleware', "created.");

    }
    if (!fs.existsSync(routerPath + 'app/routes')) {
        fs.mkdirSync(routerPath + 'app/routes');
        console.log(routerPath + 'app/routes', "created.");

    }
    const routerFilePath = routerPath + 'app/Router.js';

    console.log("Processing Router.js ", routerFilePath);
    if (!fs.existsSync(routerFilePath)) {
        console.log("No Route.js was found!");

        fs.openSync(routerFilePath, 'a');
        console.log("Router.js created!");

        fs.writeFileSync(routerFilePath, constants.ROUTER_JS_STARTER);

        console.log("Router.js boilerplate ready!");
        return require(routerFilePath);
    } else {
        return require(routerFilePath);
    }
}

const initEndpointStructure = function ({test}) {

    let routerPath = path.normalize(`${__dirname}/../../../`);

    if (test) {
        routerPath = `${__dirname}/../`;
        console.log('testing mode, routing folder', routerPath);
    }
    generateBoilerplate(routerPath);
};

const addEndpoint = function ({endpointPath, router, controller}, test) {
    let appPath = path.normalize(`${__dirname}/../../../app/`);
    if (test) {
        appPath = path.normalize(`${__dirname}/../app/`);
        console.log('testing mode, routing folder', appPath);
    }
    const ROUTER_FILE = 'Router.js';
    const CONTROLLERS_FOLDER = 'controllers/';
    const ROUTES_FOLDER = 'routes/';

    const controllerFilePath = appPath + CONTROLLERS_FOLDER + controller;
    const routerFilePath = appPath + ROUTES_FOLDER + router;
    const routerJsFilePath = appPath + ROUTER_FILE;

    let endpointData = {endpointPath, controllerPath: 'app/' + CONTROLLERS_FOLDER + controller};

    let Router;
    try {
        Router = require(routerJsFilePath);
    } catch (err) {
        console.error("could not find Router.js... did you call endpoint --init ?");
        return;
    }
    console.log("Router.js: ", Router);

    // router file
    if (!fs.existsSync(routerFilePath)) {
        fs.openSync(routerFilePath, 'a');
        fs.writeFileSync(routerFilePath, format(constants.ROUTER_FILE_BOILERPLATE, endpointData));
        console.log(routerFilePath + " created!");
    }

    // controller file
    if (!fs.existsSync(controllerFilePath)) {
        fs.openSync(controllerFilePath, 'a');
        fs.writeFileSync(controllerFilePath, constants.CONTROLLER_FILE_BOILERPLATE);
        console.log(controllerFilePath + " created!");
    }

    // main Router.js
    Router.push({path: endpointPath, handler: routerFilePath});
    const routerJsData = "module.exports = \n" + JSON.stringify(Router, null, 2);

    fs.openSync(routerJsFilePath, 'a');
    fs.writeFileSync(routerJsFilePath, routerJsData);
    console.log(routerJsFilePath + " updated!");
};


module.exports = {
    initEndpoint: initEndpointStructure,
    addEndpoint: addEndpoint
};