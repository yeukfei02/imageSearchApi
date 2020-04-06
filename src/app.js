const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

const graphqlHTTP = require('express-graphql');
const { getGraphqlSchema, getGraphqlRoot } = require('./graphql/graphql');
const schema = getGraphqlSchema();
const root = getGraphqlRoot();

const env = require('dotenv');
env.config();

const userRoutes = require('./routes/user');
const imageSearchRoutes = require('./routes/imageSearch');
const videoSearchRoutes = require('./routes/videoSearch');

const environment = app.get('env');
if (environment === 'development') {
  // mongo local db
  mongoose.connect('mongodb://localhost:27017/image-search', { useNewUrlParser: true, useUnifiedTopology: true });
} else {
  // mongo atlas
  // mongoose.connect(
  //   `mongodb+srv://yeukfei02:${process.env.MONGO_ATLAS_PASSWORD}@imagesearchapi-d0rro.mongodb.net/test?retryWrites=true&w=majority`,
  //   { useNewUrlParser: true, useUnifiedTopology: true },
  // );

  // docker local mongodb
  mongoose.connect('mongodb://mongo:27017/image-search', { useNewUrlParser: true, useUnifiedTopology: true });
}

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use('/api/user', userRoutes);
app.use('/api/image-search', imageSearchRoutes);
app.use('/api/video-search', videoSearchRoutes);
// open graphql in browser
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

module.exports = app;
