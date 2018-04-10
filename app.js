var express = require("express");
var bodyParser = require("body-parser");
var glob = require("glob");
var path = require("path");

var app = express();
var port = process.env.port || 3000;

// middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function initRoutes(app) {
    // including all routes
    glob("./routes/*.js", {
        cwd: path.resolve("./")
    }, function(err, routes) {
        if (err) {
            return;
        }
        routes.forEach((routePath) => {
            require(routePath).default(app); // eslint-disable-line
        });
    });
};
initRoutes(app);

app.listen(port, function() {
})