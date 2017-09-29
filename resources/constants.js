module.exports = {
    ROUTER_JS_STARTER:
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
    "];",

    ROUTER_FILE_BOILERPLATE:
    "'use strict';\n" +
    "\n" +
    "/**\n" +
    " * path: {endpointPath} \n" +
    " ******************** */\n" +
    "\n" +
    "let Controller = require('{controllerPath}');\n" +
    "let express = require('express');\n" +
    "let router = express.Router();\n" +
    "\n" +
    "\n" +
    "router.get('/health', Controller.health);\n" +
    "\n\n\n" +
    "module.exports = router;",

    CONTROLLER_FILE_BOILERPLATE:
    "module.exports = {\n" +
    "    health (req,res) {\n" +
    "        res.status(200).send(\"I'm healthy!\");\n" +
    "    },\n" +
    "\n" +
    "};"

};