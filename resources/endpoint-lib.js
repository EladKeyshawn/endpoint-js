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
    console.log(Router);
    if (Router.length === 0) {
        if (pathParsed.length === 1) {
            Router.push({path: `/${pathParsed[0]}`, handler: endpointData.routerPath});
            return Router;
        } else {
            let constructed_subpaths = constructPath({pathParsed: pathParsed.splice(1), endpointData, Router: []});
            if(!constructed_subpaths) return null;
            Router.push({
                path: `/${pathParsed[0]}`,
                subpaths: constructed_subpaths
            });
        }
    }

    Router.forEach((endpoint, idx, array) => {
        console.log(`running in router... idx = ${idx},  array.length =${array.length}`);
        if (idx === array.length - 1 && endpoint.path !== ('/' + pathParsed[0])) {
            console.log("last element and pathParse is not equal pathParsed[0]... pushing ");
            if (pathParsed.length === 1) {
                console.log("last element in pathParsed...pusing directry");
                Router.push({path: `/${pathParsed[0]}`, handler: endpointData.routerPath});
                return Router;
            } else {
                console.log("still not at end of pathParsed");
                const subpaths_constructed = constructPath({pathParsed: pathParsed.splice(1), endpointData, Router: []})
                if(!subpaths_constructed) return null;
                Router.push({
                    path: `/${pathParsed[0]}`,
                    subpaths: subpaths_constructed
                });
            }
        }

        if (pathParsed.length === 1 && endpoint.path === ('/' + pathParsed[0])) {
            console.error("endpoint already exists!");
            return null;
        }
        if (pathParsed.length > 1 && endpoint.path === ('/' + pathParsed[0])) {
                console.log("part of endpoint matched moving on...");
                if (_.has(endpoint, "subpaths")) {
                    endpoint.subpaths = constructPath({
                        pathParsed: pathParsed.splice(1),
                        endpointData,
                        Router: endpoint.subpaths
                    });
                    return Router;
                } else {
                    return null;
                    console.log("handler for this endpoint already exists!");
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
    const CONTROLLERS_FOLDER = 'controllers/';
    const ROUTES_FOLDER = 'routes/';

    const controllerFilePath = appPath + CONTROLLERS_FOLDER + controller;
    const routerFilePath = appPath + ROUTES_FOLDER + router;
    const routerJsFilePath = appPath + ROUTER_FILE;

    let endpointData = {
        endpointPath,
        controllerPath: 'app/' + CONTROLLERS_FOLDER + controller,
        routerPath: 'app/' + ROUTES_FOLDER + router
    };

    let Router;
    try {
        Router = require(routerJsFilePath);
    } catch (err) {
        console.error("could not find Router.js... did you call endpoint --init ?");
        return;
    }
    console.log("Router.js: ", Router);


    const pathParsed = endpointPath.split('/').splice(1);
    console.log(pathParsed);

    console.log("constructing Path");
    let res = constructPath({pathParsed, endpointData, Router});
    console.log("Construct res", JSON.stringify(res));
    var dumpData = "module.exports = \n" + JSON.stringify(res, null, 2);

    fs.openSync(routerJsFilePath, 'a');
    fs.writeFileSync(routerJsFilePath, dumpData);
    console.log(routerJsFilePath + " updated!");
    return;





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
    Router.push({path: endpointPath, handler: endpointData.routerPath});
    const routerJsData = "module.exports = \n" + JSON.stringify(Router, null, 2);

    fs.openSync(routerJsFilePath, 'a');
    fs.writeFileSync(routerJsFilePath, routerJsData);
    console.log(routerJsFilePath + " updated!");
};


module.exports = {
    initEndpoint: initEndpointStructure,
    addEndpoint: addEndpoint
};