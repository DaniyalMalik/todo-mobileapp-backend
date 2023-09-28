require('colors');

const express = require('express'),
  app = express(),
  dotenv = require('dotenv'),
  cors = require('cors'),
  userAdminRoutes = require('./routes/admin/user'),
  authAdminRoutes = require('./routes/admin/authAdmin'),
  adminRoutes = require('./routes/admin/admin'),
  authRoutes = require('./routes/user/authUser'),
  connectDB = require('./config/db'),
  morgan = require('morgan'),
  xss = require('xss-clean'),
  helmet = require('helmet'),
  hpp = require('hpp'),
  error = require('./middleware/error'),
  mongoSanitize = require('express-mongo-sanitize');

dotenv.config({ path: 'config/config.env' });

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept',
//   );

//   next();
// });

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  }),
);
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// admin routes
// app.use('/api/admin/auth', authAdminRoutes);
// app.use('/api/admin/admins', adminRoutes);
// app.use('/api/admin/sessions', sessionAdminRoutes);
// app.use('/api/admin/users', userAdminRoutes);
// app.use('/api/admin/tips', tipAdminRoutes);
// app.use('/api/admin/notifications', notificationAdminRoutes);

// user routes
// app.use('/api/auth', authRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/tips', tipRoutes);
// app.use('/api/notifications', notificationRoutes);

app.use(error);

const PORT = process.env.PORT || 8000;
const ENVIRONMENT = process.env.NODE_ENV;

const server = app.listen(PORT, () =>
  console.log(
    `Server started running in ${ENVIRONMENT} mode on PORT ${PORT}`.blue.bold,
  ),
);

connectDB();

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  server.close(() => process.exit(1));
});
