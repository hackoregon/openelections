import * as express from "express";
const router = express.Router();

/* GET users listing. */
export default router.get("/", (req, res, next) => {
    res.status(200);
    res.contentType("application/json");
    res.send(JSON.stringify({page: "users index"}));
});
