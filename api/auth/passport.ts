//
// import { compare as compareHash } from 'bcryptjs';
import { validateHash } from '../services/UserService';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Connection, getManager } from 'typeorm';
import { User } from '../models/entity/User';

export default (app, connection: Connection) => {
  const userRepo = connection.getRepository(User);

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
  });

  passport.deserializeUser( async (id, done) => {
    console.log('[Passport.ts]: deserializeUser');
    const userManager = getManager().getRepository(User);
    const user = await userRepo.findOne(id);
    if (user) {
      done(undefined, user.toJSON());
    } else {
        done(undefined, {});
    }
  });

  passport.use('local', new LocalStrategy( { usernameField: 'email' },
    async function(email: string, password: string, done: Function) {
      console.log('[LOCAL STRATEGY]: ', email, password);
      try {
        console.log('[LOCAL STRATEGY]: Trying . . . ', email, password);
        const user = await userRepo.findOne({ email });
        console.log('[LOCAL STRATEGY]: validHash?', user.passwordHash, user.salt, password );
        if (await validateHash(user.passwordHash, user.salt, password)) {
          console.log('[LOCAL STRATEGY]: valid hash!!!')
          done(undefined, user.toJSON());
        } else {
          done(undefined, false);
        }
      } catch (err) {
        done(err);
      }
    }));
};

// export const isAuthenticated = (request: Request, response: Response, next: Function) => {
//   if (request.isAuthenticated()) {
//     return next();
//   }
//   response.send(JSON.stringify('nooo'))
// };