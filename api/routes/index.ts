import * as express from "express";
const router = express.Router();

export default router.get("/", (req, res, next) => {
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify({page: "home"}));
});
