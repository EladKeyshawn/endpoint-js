const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const format = require('string-format');
const constants = require('./constants');

function generateBoilerplate(routerPath) {
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
    let routerPath = `${process.cwd()}/`;

    if (test) {
        routerPath = `${__dirname}/../`;
        console.log('testing mode, routing folder:', routerPath);
    } else {
        console.log("production mode, routing folder:", routerPath);
    }
    generateBoilerplate(routerPath);
};

function constructPath({pathParsed, endpointData, Router}) {

    if (Router.length === 0) {
        if (pathParsed.length === 1) {
            Router.push({
                path: pathParsed[0],
                handler: endpointData.routersFolder + '/' + endpointData.router,
                controller: endpointData.controllersFolder + '/' + endpointData.controller
            });
            return Router;
        }
        else {

            endpointData.controllersFolder += pathParsed[0];
            endpointData.routersFolder += pathParsed[0];

            Router.push({
                path: pathParsed[0],
                subpaths: constructPath({pathParsed: pathParsed.splice(1), endpointData, Router: []})
            });
            return Router;
        }
    }

    Router.forEach((endpoint, idx, array) => {

        if (idx === array.length - 1 && endpoint.path !== pathParsed[0]) {
            if (pathParsed.length === 1) {

                Router.push({
                    path: pathParsed[0],
                    handler: endpointData.routersFolder + '/' + endpointData.router,
                    controller: endpointData.controllersFolder + '/' + endpointData.controller
                });

            } else {

                endpointData.controllersFolder += pathParsed[0];
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

                endpointData.controllersFolder += pathParsed[0];
                endpointData.routersFolder += pathParsed[0];

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

function constructFolderStructure(routeJs, {controllersFolder, routersFolder, currEndpointPath}) {
    if (routeJs.length < 1){
        return;
    }

    routeJs.forEach(endpoint => {
        console.log(endpoint);
        if (_.has(endpoint, "subpaths")) {
            // controllers sub-folder
            if (!fs.existsSync(controllersFolder + endpoint.path)) {
                fs.mkdirSync(controllersFolder + endpoint.path);
                console.log(controllersFolder + endpoint.path, "created.");
            }

            // routers sub-folder
            if (!fs.existsSync(routersFolder + endpoint.path)) {
                fs.mkdirSync(routersFolder + endpoint.path);
                console.log(routersFolder + endpoint.path, "created.");
            }

            constructFolderStructure(endpoint.subpaths,
              {controllersFolder: controllersFolder + endpoint.path, routersFolder: routersFolder + endpoint.path, currEndpointPath: currEndpointPath + endpoint.path});
        }
        else if (_.has(endpoint, "handler")) {
            // controller file
            if (!fs.existsSync(endpoint.controller)) {
                fs.openSync(endpoint.controller, 'a');
                fs.writeFileSync(endpoint.controller, format(constants.CONTROLLER_FILE_BOILERPLATE, {}));
                console.log(endpoint.controller + " created!");
            }

            // router file
            if (!fs.existsSync(endpoint.handler)) {
                fs.openSync(endpoint.handler, 'a');
                fs.writeFileSync(endpoint.handler, format(constants.ROUTER_FILE_BOILERPLATE, {controllerPath: endpoint.controller, endpointPath: currEndpointPath + endpoint.path}));
                console.log(endpoint.handler + " created!");
            }
        }


    });

}

const addEndpoint = function ({endpointPath, router, controller}, test) {
    let appPath = `${process.cwd()}/app/`;

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

    const pathParsed = endpointPath.split('/').splice(1).map(part => '/' + part);

    let constructedRouteJs;
    try {
        constructedRouteJs = constructPath({pathParsed, endpointData, Router})
    } catch (err) {
        console.log(err.message);
        return;
    }

    constructFolderStructure(constructedRouteJs, {
        controllersFolder: appPath + CONTROLLERS_FOLDER,
        routersFolder: appPath + ROUTES_FOLDER,
        currEndpointPath: ''
    });

    const routerJsData = "module.exports = \n" + JSON.stringify(constructedRouteJs, null, 2);

    fs.openSync(routerJsFilePath, 'a');
    fs.writeFileSync(routerJsFilePath, routerJsData);
    console.log(routerJsFilePath + " updated!");

};

module.exports = {
    initEndpoint: initEndpointStructure,
    addEndpoint: addEndpoint
};