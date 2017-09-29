![]( https://github.com/EladKeyshawn/endpoint-js/blob/master/assets/logo.png )

# endpoint.js 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/88b108e818cc46c1aa01bbd037d6df15)](https://www.codacy.com/app/elad-keyshawn/endpoint-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EladKeyshawn/endpoint-js&amp;utm_campaign=Badge_Grade)

[![NPM](https://nodei.co/npm/endpoint-js.png)](https://npmjs.org/package/endpoint-js)
---

> Simplistic express routing management for NodeJS

- Manage all endpoints in a structure file
- Controller and routers folders and files are created automatically by route
- Built in CLI for creating boilerplate and adding new endpoints
- Automatically registers your (Endpoint | Router | Controller) with express 

## Install

> CLI
```
$ npm install --global endpoint-js
```

> endpoint.js
```
$ npm install --save endpoint-js
```

## Usage

In your home directory create endpoint app boilerplate:
```
$ endpoint --i
```
And your api routing folder and ready!

![](https://github.com/EladKeyshawn/endpoint-js/blob/master/assets/screenshot_init.png)

To add an API route (Endpoint)
```
$ endpoint --a
```
fill in the prompt with your endpoint details, for example:
- endpoint path: /api/is/awesome
- router file name: awesome.js
- controller file name: awesomeController.js

![](https://github.com/EladKeyshawn/endpoint-js/blob/master/assets/screenshot_add_endpoint_promt.png)


And an endpoint was added to Router.js (API structure file),
foldering and file creation is done automatically!


In your index.js or wherever you create your express app, simply:
```js
var app = express();
require('endpoint-js')(app);
```

OPTIONALS:

- if you want all of your endpoint structure to have some predetermined 
prefix you can do so:
```js
require('endpoint-js')(app, {prefix: "/someprefix"});
```


##### LICENCE & CREDITS
MIT © [Elad Keyshawn](https://github.com/eladkeyshawn)
