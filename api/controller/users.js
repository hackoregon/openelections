"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var typeorm_1 = require("typeorm");
var User_1 = require("../models/entity/User");
/**
 * Loads all users from the database.
 */
function userGetAllAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var userManager = typeorm_1.getManager().getRepository(User_1.User);
        var users = yield userManager.find();
        // return loaded posts
        response.status(200);
        response.send({ users: users });
    });
}
exports.userGetAllAction = userGetAllAction;
function userGetByIdAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var userManager = typeorm_1.getManager().getRepository(User_1.User);
        var user = yield userManager.find(request.params.id);
        response.status(200);
        response.send({ user: user });
    });
}
exports.userGetByIdAction = userGetByIdAction;
