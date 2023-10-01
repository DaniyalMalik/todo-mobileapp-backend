require('colors');

const express = require('express'),
  app = express(),
  dotenv = require('dotenv'),
  cors = require('cors'),
  authRoutes = require('./routes/auth'),
  userRoutes = require('./routes/user'),
  todoRoutes = require('./routes/todo'),
  connectDB = require('./config/db'),
  morgan = require('morgan'),
  xss = require('xss-clean'),
  helmet = require('helmet'),
  hpp = require('hpp'),
  error = require('./middleware/error'),
  mongoSanitize = require('express-mongo-sanitize');

dotenv.config({ path: 'config/.env' });

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

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

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
