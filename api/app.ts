import createError from 'http-errors';
import * as express from'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
// import * as session 'express-session';
// import * as passport from 'passport';
import sequelize from './models/db';
import passportSetup from './auth/passport';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: true
// }));

passportSetup(app, sequelize);

app.use(express.static(path.join(__dirname, 'public')));

sequelize
  .authenticate()
  .then(() => {
    console.log('[APP.JS]: Connection has been established successfully.');
  })
  .catch(err => {
    console.error('[APP.JS]: Unable to connect to the database:', err);
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
