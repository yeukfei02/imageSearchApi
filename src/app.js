const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

const env = require('dotenv');
env.config();

const graphqlHTTP = require('express-graphql');
const { getGraphqlSchema, getGraphqlRoot } = require('./graphql/graphql');
const schema = getGraphqlSchema();
const root = getGraphqlRoot();

const app = express();
const port = process.env.PORT || 3000;

const { connectDB } = require('./db/db');

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const imageSearchRoutes = require('./routes/imageSearch');
const videoSearchRoutes = require('./routes/videoSearch');

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB(app);

app.use('/', mainRoutes);
app.use('/api/user', userRoutes);
app.use('/api/image-search', imageSearchRoutes);
app.use('/api/video-search', videoSearchRoutes);

// open graphql in browser
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
