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

function constructPath({pathParsed, endpointData, Router}) {

    if (Router.length === 0) {
        if (pathParsed.length === 1) {
            // controller file
            if (!fs.existsSync(endpointData.controllersFolder + '/' + endpointData.controller)) {
                fs.openSync(endpointData.controllersFolder + '/' + endpointData.controller, 'a');
                fs.writeFileSync(endpointData.controllersFolder + '/' + endpointData.controller, format(constants.CONTROLLER_FILE_BOILERPLATE, endpointData));
                console.log(endpointData.controllersFolder + '/' + endpointData.controller + " created!");
            }

            endpointData.controllerPath = endpointData.controllersFolder + '/' + endpointData.controller;

            // router file
            if (!fs.existsSync(endpointData.routersFolder + '/' + endpointData.router)) {
                fs.openSync(endpointData.routersFolder + '/' + endpointData.router, 'a');
                fs.writeFileSync(endpointData.routersFolder + '/' + endpointData.router, format(constants.ROUTER_FILE_BOILERPLATE, endpointData));
                console.log(endpointData.routersFolder + '/' + endpointData.router + " created!");
            }
            Router.push({path: pathParsed[0], handler: endpointData.routersFolder + '/' + endpointData.router});
            return Router;
        }
        else {

            if (!fs.existsSync(endpointData.controllersFolder + pathParsed[0])) {
                fs.mkdirSync(endpointData.controllersFolder + pathParsed[0]);
                console.log(endpointData.controllersFolder + pathParsed[0], "created.");
            }
            endpointData.controllersFolder += pathParsed[0];

            if (!fs.existsSync(endpointData.routersFolder + pathParsed[0])) {
                fs.mkdirSync(endpointData.routersFolder + pathParsed[0]);
                console.log(endpointData.routersFolder + pathParsed[0], "created.");
            }
            endpointData.routersFolder += pathParsed[0];

            Router.push({
                path: pathParsed[0],
                subpaths: constructPath({pathParsed: pathParsed.splice(1), endpointData, Router: []})
            });
            return Router;
        }
    }

    Router.forEach((endpoint, idx, array) => {
        console.log(`idx: ${idx} out of ${array.length}, path: ${endpoint.path}`);

        if (idx === array.length - 1 && endpoint.path !== pathParsed[0]) {
            if (pathParsed.length === 1) {

                // controller file
                if (!fs.existsSync(endpointData.controllersFolder + '/' + endpointData.controller)) {
                    fs.openSync(endpointData.controllersFolder + '/' + endpointData.controller, 'a');
                    fs.writeFileSync(endpointData.controllersFolder + '/' + endpointData.controller, format(constants.CONTROLLER_FILE_BOILERPLATE, endpointData));
                    console.log(endpointData.controllersFolder + '/' + endpointData.controller + " created!");
                }
                endpointData.controllerPath = endpointData.controllersFolder + '/' + endpointData.controller;
                // router file
                if (!fs.existsSync(endpointData.routersFolder + '/' + endpointData.router)) {
                    fs.openSync(endpointData.routersFolder + '/' + endpointData.router, 'a');
                    fs.writeFileSync(endpointData.routersFolder + '/' + endpointData.router, format(constants.ROUTER_FILE_BOILERPLATE, endpointData));
                    console.log(endpointData.routersFolder + '/' + endpointData.router + " created!");
                }

                Router.push({path: pathParsed[0], handler: endpointData.routersFolder + '/' + endpointData.router});
            } else {

                if (!fs.existsSync(endpointData.controllersFolder + pathParsed[0])) {
                    fs.mkdirSync(endpointData.controllersFolder + pathParsed[0]);
                    console.log(endpointData.controllersFolder + pathParsed[0], "created.");
                }
                endpointData.controllersFolder += pathParsed[0];

                if (!fs.existsSync(endpointData.routersFolder + pathParsed[0])) {
                    fs.mkdirSync(endpointData.routersFolder + pathParsed[0]);
                    console.log(endpointData.routersFolder +  pathParsed[0], "created.");
                }
                endpointData.routersFolder += pathParsed[0];

                Router.push({
                    path: pathParsed[0],
                    subpaths: constructPath({pathParsed: pathParsed.splice(1), endpointData, Router: []})
                });
            }
            return Router;
        }

        if (pathParsed.length === 1 && endpoint.path === pathParsed[0]) {
            throw new Error("endpoint already exists!");
        }
        if (pathParsed.length > 1 && endpoint.path === pathParsed[0]) {

                if (_.has(endpoint, "subpaths")) {
                    endpoint.subpaths = constructPath({
                        pathParsed: pathParsed.splice(1),
                        endpointData,
                        Router: endpoint.subpaths
                    });
                    return Router;
                } else {
                    throw new Error("handler for this endpoint already exists!");
                }
            }

    });

    return Router;
}

const addEndpoint = function ({endpointPath, router, controller}, test) {
    let appPath = path.normalize(`${__dirname}/../../../app/`);
    if (test) {
        appPath = path.normalize(`${__dirname}/../app/`);
        console.log('testing mode, routing folder', appPath);
    }

    const ROUTER_FILE = 'Router.js';
    const CONTROLLERS_FOLDER = 'controllers';
    const ROUTES_FOLDER = 'routes';


    const routerJsFilePath = appPath + ROUTER_FILE;

    let endpointData = {
        endpointPath,
        controllersFolder: appPath + CONTROLLERS_FOLDER,
        routersFolder: appPath + ROUTES_FOLDER,
        controller,
        router
    };

    let Router;
    try {
        Router = require(routerJsFilePath);
    } catch (err) {
        console.log("could not find Router.js... did you call endpoint --init ?");
        return;
    }
    console.log("Router.js: ", Router);


    const pathParsed = endpointPath.split('/').splice(1).map(part => '/' + part);
    console.log(pathParsed);

    console.log("constructing Path");
    let constructedRouteJs;
    try {
        constructedRouteJs = constructPath({pathParsed, endpointData, Router})
    } catch (err) {
        console.log(err);
    }
    if(!constructedRouteJs) console.log("error adding endpoint...");
    const routerJsData = "module.exports = \n" + JSON.stringify(constructedRouteJs, null, 2);

    fs.openSync(routerJsFilePath, 'a');
    fs.writeFileSync(routerJsFilePath, routerJsData);
    console.log(routerJsFilePath + " updated!");


};


module.exports = {
    initEndpoint: initEndpointStructure,
    addEndpoint: addEndpoint
};