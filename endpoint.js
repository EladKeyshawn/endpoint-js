let path = require('path');
const fs = require('fs');
module.exports = function() {

    global.rootRequire = function(name) {
        // escape this dir and node_modules/
        console.log(path.normalize(`${__dirname}/../../${name}`));
        try {
           return require(path.normalize(`${__dirname}/../../${name}`));
        } catch (err) {
            console.log("rootRequire error: file could not be found ");
           return null;
        }
    };
    let testingRouterPath = './Router.js';
    let routerPath = path.normalize(`${__dirname}/../../Router.js`);

    console.log("Processing Router.js ", testingRouterPath);
    if (!fs.existsSync(testingRouterPath)) {
        console.log("No Route.js was found!");


        fs.open(testingRouterPath,'a', function (err) {
            if (err) {
                console.error(err);
                console.error("endpoint.js: could not create Router.js file");
                return;
            }
                console.log("Router.js created!");
            const RouterStarter = fs.readFileSync('./test/RouterStarter.txt');

            fs.writeFile(testingRouterPath,RouterStarter, function (err) {
                if(!err) {
                    console.log("Router.js boilerplate ready!");
                }
            })
        });
    }

    // let Router = rootRequire('app/Router');
    // Router.forEach((route) => {
    //     layPathStructure("/api",route);
    // });

    function layPathStructure(prefix, route){
        if(_.has(route, 'subpaths')) {
            route.subpaths.forEach((subpath) => {
                layPathStructure(prefix + route.path,subpath);
            })
        } else {
            console.log("attaching endpoint: ", prefix + route.path);
            app.use(prefix + route.path, route.handler);
        }
    }

};