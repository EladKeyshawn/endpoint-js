#!/usr/bin/env node

const lib = require('../resources/endpoint-lib');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clopts = require('cliclopts')([
    {
        name: 'init',
        abbr: 'i',
        help: 'init endpoint.js app directory'
    },
    {
        name: 'add',
        abbr: 'a',
        help: 'add endpoint to api structure'
    },
    {
        name: 'version',
        abbr: 'v',
        boolean: true,
        help: 'show version information'
    },
    {
        name: 'force',
        abbr: 'f',
        help: 'show help',
        boolean: true
    },
    {
        name: 'help',
        abbr: 'h',
        help: 'show help',
        boolean: true
    }
]);
const argv = require('minimist')(process.argv.slice(2), {
    alias: clopts.alias(),
    boolean: clopts.boolean(),
    default: clopts.default()
});
const add_endpoint_prompt_questions = [
    {
        type: 'input',
        name: 'endpointPath',
        message: 'endpoint path?',
        default: '/api'
    },
    {
        type: 'input',
        name: 'router',
        message: 'Router file name?',
        default: 'api.js'
    },
    {
        type: 'input',
        name: 'controller',
        message: 'controller file name?',
        default: 'apiController.js'
    },
];


// command action functions
function addEndpointPrompt () {
    inquirer.prompt(add_endpoint_prompt_questions).then(function (data) {
        console.log(data);
        lib.addEndpoint(data,true);
    });
}

function initEndpointStructure() {
    lib.initEndpoint({test:true});
}

function catchInputErrors () {
    const errs = 0;

    if (argv.version) {
        console.log(require(path.resolve(__dirname, '..', 'package.json')).version)
        process.exit(0)
    }

    if (argv.help) {
        console.log('Usage: module-init [options]')
        clopts.print()
        process.exit(0)
    }

    if (errs) process.exit(1)
}

function main() {
    catchInputErrors();

    if(argv.add) {
        addEndpointPrompt();
    }
    else if (argv.init) {
        initEndpointStructure();
    }
}

main();

// function init (data) {
//     lib({})
//       .on('create', function (file) {
//           // file created
//           console.log(chalk.green('✓ ') + chalk.bold(file) + ' created')
//       })
//       .on('warn', function (msg) {
//           // something weird happened
//           console.log(chalk.yellow('✗ ' + msg))
//       })
//       .on('err', function (err) {
//           // something went horribly wrong!
//           console.error(err)
//           process.exit(1)
//       })
//       .on('done', function (res) {
//           // we did it!
//           console.log(chalk.green('✓ ') + chalk.bold(res.pkgName) + ' initialized')
//           process.exit(0)
//       })
//       .run() // run the thing
// }