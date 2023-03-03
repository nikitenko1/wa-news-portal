require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminRouteRoute = require('./routes/admin');
const assessmentRoute = require('./routes/assessments');
const authRoute = require('./routes/auth');
const blogsRoute = require('./routes/blogs');
const notificationsRoute = require('./routes/notifications');
const profileRoute = require('./routes/profile');
const questionsRoute = require('./routes/questions');
const searchRoute = require('./routes/search');
const topicsRoute = require('./routes/topics');

const { connectToMySQL } = require('./sql/mysql');

const app = express();

app.use(
  express.json({
    limit: '10mb',
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use('/api/admin', adminRouteRoute);
app.use('/api/assessments', assessmentRoute);
app.use('/api/auth', authRoute);
app.use('/api/blogs', blogsRoute);
app.use('/api/profile', profileRoute);
app.use('/api/questions', questionsRoute);
app.use('/api/search', searchRoute);
app.use('/api/topics', topicsRoute);
app.use('/api/notifications', notificationsRoute);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  await connectToMySQL();
});
