"use strict";
var users_1 = require("../controller/users");
/**
 * All application routes.
 */
exports.AppRoutes = [
    {
        path: "/users",
        method: "get",
        action: users_1.userGetAllAction
    },
    {
        path: "/users/:id",
        method: "get",
        action: users_1.userGetByIdAction
    }
];
