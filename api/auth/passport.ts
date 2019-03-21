
import * as bcrypt from 'bcryptjs';
import * as passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
export default (app, sequelize) => {

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( (username, password, done) => {
  console.log('user name: ' + username);
  console.log('user password: ' + password);

  // Get user from DB
  // sequelize.query(`SELECT * FROM users WHERE username=${username}`).then( users => {

  // })
  sequelize.findOne({
    where: {
      username
    }
  }).then( user => {
    console.log(user);
  });


  // if valid user: return done(null, user);
  // if not return done(null, false);
  // return done(null, false, { message: 'Incorrect password.' });

}));

passport.serializeUser( (user: {id: string}, done) => {
  // done(null, user.id);

});

passport.deserializeUser(function(id, done) {
  // Get user from DB. If pass: done(err, user);

});


function generateHash (password: string) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

};

