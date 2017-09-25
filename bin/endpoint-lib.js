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
  "];"

function setupRootRequire() {
    global.rootRequire = function (name) {
        // escape this dir and node_modules/
        console.log(path.normalize(`${__dirname}/../../${name}`));
        try {
            return require(path.normalize(`${__dirname}/../../${name}`));
        } catch (err) {
            console.log("rootRequire error: file could not be found ");
            return null;
        }
    };
}

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

const main = function ({test}) {

    let routerPath = path.normalize(`${__dirname}/../../../`);

    if (test) {
        routerPath = './';
        console.log('testing mode, routing folder', routerPath);

    }

    generateBoilerplate(routerPath);

};


module.exports = main;