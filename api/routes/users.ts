import * as express from 'express';

const router = express.Router();
import { User } from '../models/User';

/* GET users listing. */
export default router.get('/', async (req, res, next) => {
    res.status(200);
    res.contentType('application/json');
    const count = await User.count();
    res.send(JSON.stringify({
        users: {
            count,
        }
    }));
});
