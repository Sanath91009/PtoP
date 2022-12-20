const ServerInit = require("./HTTP/ServerInit");
const Conf = require("./HTTP/ConfigInit");
const routeInit = require("./HTTP/RouteInit");
const SinkErrorFor = require("./HTTP/ErrorSinkInit");
const SocketInit = require("./HTTP/socketInit");
const { app, server } = ServerInit(Conf);
/* The above function returns the main express app object by calling the top level express
   function and also configuring the middleware like bodyparser,cors,cookieparser,xss etc. */
routeInit(app); // This configures the routing middleware by registering route handlers to the route paths.
SinkErrorFor(app);
SocketInit(app, server);
