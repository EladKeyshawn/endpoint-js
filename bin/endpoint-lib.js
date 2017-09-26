let path = require('path');
const fs = require('fs');
const _ = require('lodash');
var events = require('events');
const RouterStarter =
  "module.exports = [\n" +
  "  \n" +
  "    // ====== EXAMPLE ====== //\n" +
  "    // {\n" +
  "    //     path: '/status',\n" +
  "    //     handler: rootRequire('app/routes/status'),\n" +
  "    // },\n" +
  "    // {\n" +
  "    //     path: '/another-path',\n" +
  "    //     subpaths: [\n" +
  "    //         {\n" +
  "    //             path: '/specific-subpath',\n" +
  "    //             handler: rootRequire('app/routes/another-path/specific-subpath')\n" +
  "    //         }\n" +
  "    //     ]\n" +
  "    // }\n" +
  "];";


function generateBoilerplate(routerPath) {
    console.log("generating app routing...");
    if (!fs.existsSync(routerPath + 'app')) {
        fs.mkdirSync(routerPath + 'app');
        // main.emit('create', routerPath + 'app');
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

        fs.writeFileSync(routerFilePath, RouterStarter);

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

    const saveCtrlPath = appPath + CONTROLLERS_FOLDER + controller;
    const saveRoutePath = appPath + ROUTES_FOLDER + router;
    const RouterPath = appPath + ROUTER_FILE;

    let Router;
    try {
        Router = require(RouterPath);
    } catch (err) {
        console.error("could not find Router.js... did you call endpoint --init ?");
        return;
    }
    console.log("Router.js: ", Router);

    if (!fs.existsSync(saveRoutePath)) {
        fs.openSync(saveRoutePath, 'a');
        fs.writeFileSync(saveRoutePath, "'boilerplate stub!'");
        console.log(saveRoutePath + " created!");
    }
    if (!fs.existsSync(saveCtrlPath)) {
        fs.openSync(saveCtrlPath, 'a');
        fs.writeFileSync(saveCtrlPath, "'boilerplate stub!'");
        console.log(saveCtrlPath + " created!");
    }
    Router.push({path: endpointPath, handler: saveRoutePath});
    const routerJsData = "module.exports = \n" + JSON.stringify(Router);

    fs.openSync(RouterPath, 'a');
    fs.writeFileSync(RouterPath, routerJsData);
    console.log(RouterPath + " updated!");
};




module.exports = {
    initEndpoint: initEndpointStructure,
    addEndpoint: addEndpoint
};