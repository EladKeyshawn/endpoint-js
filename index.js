let path = require('path');
const _ = require('lodash');

function setupRootRequire() {
    global.rootRequire = function (name) {
        try {
            return require(path.normalize(`${__dirname}/../../${name}`));
        } catch (err) {
            console.log("rootRequire error: file could not be found ");
            return null;
        }
    };
}

module.exports = function (app, options) {

    setupRootRequire();

    let prefix = "";
    if (options && options.prefix) {
        prefix = options.prefix;
    }
    const Router = rootRequire('app/Router.js');
    console.log("Router.js: ", Router);
    if (!Router){
        return;
    }

    Router.forEach((route) => {
        layPathStructure(prefix, route);
    });

    function layPathStructure(prefix, route) {
        if (_.has(route, 'subpaths')) {
            route.subpaths.forEach((subpath) => {
                layPathStructure(prefix + route.path, subpath);
            });
        } else {
            console.log("attaching endpoint: ", prefix + route.path);
            app.use(prefix + route.path, require(route.handler));
        }
    }


};


