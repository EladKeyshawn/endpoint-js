#!/usr/bin/env node

const lib = require('./endpoint-lib');
var path = require('path');
var chalk = require('chalk');
var inquirer = require('inquirer');
var clopts = require('cliclopts')([
    {
        name: 'init',
        abbr: 'i',
        help: 'init endpoint.js app directory'
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
var argv = require('minimist')(process.argv.slice(2), {
    alias: clopts.alias(),
    boolean: clopts.boolean(),
    default: clopts.default()
});

catchInputErrors()

var questions = [
    {
        type: 'input',
        name: 'pkgName',
        message: 'name',
        default: path.basename(argv.dir || process.cwd())
    },
    {
        type: 'input',
        name: 'pkgVersion',
        message: 'version',
        default: '1.0.0'
    },
]

function initEndpointStructure() {
    lib({})
}

if (argv.force) {
    force()
}
else if (argv.init) {
    initEndpointStructure()
}
else {
    prompt()
}

function catchInputErrors () {
    var errs = 0

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

// function force () {
//     var data = {};
//
//     for (var i = 0; i < questions.length; i++) {
//         if (typeof questions[i].default !== 'undefined') {
//             data[questions[i].name] = questions[i].default
//         }
//     }
//
//     data = prepData(data);
//     init(data)
// }

function prompt () {
    inquirer.prompt(questions, function (data) {
        data = prepData(data)
        init(data)
    })
}

function prepData (data) {

    if (argv.dir) data.dir = argv.dir;
    if (!data.pkgDescription) data.pkgDescription = '';
    if (!data.pkgKeywords) data.pkgKeywords = '';
    if (data.pkgKeywords !== '') {
        data.pkgKeywords = data.pkgKeywords
          .split(/[\s,]+/)
          .filter(function (value, index, self) {
              return !!value && self.indexOf(value) === index
          })
          .map(function (value) {
              return '"' + value + '"'
          })
          .join(', ')
    }

    return data
}

function init (data) {
    lib({})
      // .on('create', function (file) {
      //     // file created
      //     console.log(chalk.green('✓ ') + chalk.bold(file) + ' created')
      // })
      // .on('warn', function (msg) {
      //     // something weird happened
      //     console.log(chalk.yellow('✗ ' + msg))
      // })
      // .on('err', function (err) {
      //     // something went horribly wrong!
      //     console.error(err)
      //     process.exit(1)
      // })
      // .on('done', function (res) {
      //     // we did it!
      //     console.log(chalk.green('✓ ') + chalk.bold(res.pkgName) + ' initialized')
      //     process.exit(0)
      // })
      // .run() // run the thing
}