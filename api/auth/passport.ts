// import crypto from 'crypto'
import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';


export default (app, sequelize) => {

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( (username, password, done) => {
  console.log('user name: ' + username)
  console.log('user password: ' + password)
  
  // Get user from DB
  // sequelize.query(`SELECT * FROM users WHERE username=${username}`).then( users => {
    
  // })
  sequelize.findOne({
    where: {
      username
    }
  }).then( user => {
    console.log(user)
  })


  // if valid user: return done(null, user);
  // if not return done(null, false);
  // return done(null, false, { message: 'Incorrect password.' });
  
}));

passport.serializeUser( (user: {id: string}, done) => {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Get user from DB. If pass: done(err, user);

});


// function hashPW(password: string, salt: string) {
//   const hash = crypto.createHash('sha256');
//   hash.update(password);
//   hash.update(salt);
//   return hash.digest('hex');
// }
// function genSalt() {
//     const salt = crypto.randomBytes(128).toString('base64');
//     return salt;
// }

}