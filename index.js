let path = require('path');
const fs = require('fs');
const _ = require('lodash');

function setupRootRequire() {
    global.rootRequire = function (name) {
        // escape this dir and node_modules/
        // console.log(path.normalize(`${__dirname}/../../${name}`));
        try {
            return require(path.normalize(`${__dirname}/../../${name}`));
        } catch (err) {
            console.log("rootRequire error: file could not be found ");
            return null;
        }
    };
}

module.exports = function (app, {prefix, test}) {

    setupRootRequire();

    if (!prefix) prefix = "";
    // let routerPath = path.normalize(`${__dirname}/../../app/`);
    //
    // if (test) {
    //     routerPath = './app/';
    //     console.log('testing mode, routing folder', routerPath);
    // }
    const Router = rootRequire('app/Router.js');
    console.log("Router.js: ", Router);
    if (!Router) return;

    Router.forEach((route) => {
        layPathStructure(prefix, route);
    });

    function layPathStructure(prefix, route) {
        if (_.has(route, 'subpaths')) {
            route.subpaths.forEach((subpath) => {
                layPathStructure(prefix + route.path, subpath);
            })
        } else {
            console.log("attaching endpoint: ", prefix + route.path);
            app.use(prefix + route.path, rootRequire(route.handler));
        }
    }

};