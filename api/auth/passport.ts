//
// import * as bcrypt from 'bcryptjs';
// import * as passport from 'passport';
// // import { Strategy as LocalStrategy } from 'passport-local';
// const LocalStrategy = require('passport-local').Strategy;
// import models from '../models/db';
// const User = models.User;
// export default (app, sequelize) => {
//   const Op = sequelize.Op;
//
//   app.use(passport.initialize());
//   app.use(passport.session());
//   passport.serializeUser<any, any>((user, done) => {
//     done(undefined, user.id);
//   });
//
//   passport.deserializeUser( async (id, done) => {
//     console.log('[Passport.ts]: deserializeUser')
//     await User.findOne({
//       where: {
//         id
//       }
//     }).then(user => {
//       done(undefined, user);
//     }).catch(err => done(err, undefined));
//   });
//   passport.use(new LocalStrategy( async (username: string, password: string, done) => {
//     console.log('[Passport.ts]: user name: ' + username);
//     console.log('[Passport.ts]: user password: ' + password);
//     // console.log('[Passport.ts]: have User db?: ', User.count());
//
//     // Get user from DB
//     await User.findOne({
//       [Op.or]: [
//         {
//           where: {
//             username: username
//           }
//         },
//         {
//           where: {
//             email: username
//           }
//         }
//       ]
//     }).then( user => {
//       console.log('Passport Auth: ', user);
//       if (!user) {
//         console.log('[Passport.ts]: No User!')
//         return done(undefined, false, { message: `Email or Username ${username} not found.` });
//       } else if (!user.validPassword(password)) {
//         return done(undefined, false, { message: `Wrong Password.` });
//       } else {
//         return done(undefined, user);
//       }
//     }).catch( error => console.log('[Passport.ts error]: ', error));
//     console.log('[Passport.ts]: no user found?')
//   }));
//
//
//
//
//   // function generateHash (password: string) {
//   //   const salt = bcrypt.genSaltSync();
//   //   const hash = bcrypt.hashSync(password, salt);
//   //   return hash;
//   // }
//   // function comparePass(userPassword: string, databasePassword: string) {
//   //   return bcrypt.compareSync(userPassword, databasePassword);
//   // }
//
// };
//
