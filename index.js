import express from 'express';
import cors from 'cors';
import { connectDb } from './db.js';
import {
  AuthRouter,
  ProductRouter,
  CartRouter,
  UserRouter,
  OrderRouter,
  PaymentRouter,
  AboutRouter,
  StatsRouter,
  CategoryRouter,
  BrandRouter,
  SettingRouter,
  CouponRouter,
  CampaignRouter,
} from './routers/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import helmet from 'helmet';

const app = express();
app.use(express.json());
app.use(cors());

const options = {
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
};

const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
delete cspDefaults['upgrade-insecure-requests'];

app.use(
  helmet({
    contentSecurityPolicy: { directives: cspDefaults },
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
app.use('/api/v1', AuthRouter);
app.use('/api/v1', ProductRouter);
app.use('/api/v1', CartRouter);
app.use('/api/v1', UserRouter);
app.use('/api/v1', OrderRouter);
app.use('/api/v1', PaymentRouter);
app.use('/api/v1', AboutRouter);
app.use('/api/v1', StatsRouter);
app.use('/api/v1', CategoryRouter);
app.use('/api/v1', BrandRouter);
app.use('/api/v1', SettingRouter);
app.use('/api/v1', CouponRouter);
app.use('/api/v1', CampaignRouter);
app.use('/index', (req, res) => {
  return res.body('OK');
});

const start = () => {
  connectDb(app);
};

start();
