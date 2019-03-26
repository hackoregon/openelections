import * as express from 'express';
import * as passport from 'passport';
import { Op } from 'sequelize';

const router = express.Router();
import models from '../models/db';
const { User } = models;

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

router.post('/test', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('TEST', req.body);
    let message = await User.findAll({
        where: {
            username: username
        }
      }).then(user => {
          console.log('YOOO', user);
         return user;
      }).catch( err => {
        console.log('YOOO ERR', err);
          return err;
    });
    res.status(200);
    res.contentType('application/json');
    res.send(JSON.stringify({
        message
    }));
});
router.post('/login', function(req, res, next) {
    console.log(req.body);
    let message: any;
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        res.status(200);
        res.contentType('application/json');
        return message = 'no user';
      }
      req.logIn(user, function(err) {

        if (err) { return next(err); }
        res.status(200);
        res.contentType('application/json');
        return message = 'yes user';
      });
    })(req, res, next);

    res.send(JSON.stringify({message}));
    
  });
// router.post('/login',
//   passport.authenticate('local', { failureRedirect: '/' }),
//   function(req, res) {
//     res.status(200);
//     res.contentType('application/json');
//     res.send(JSON.stringify({
//         test: 'yep'
//     }));
// });