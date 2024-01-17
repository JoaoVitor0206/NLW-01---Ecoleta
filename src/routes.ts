import express from 'express';

import PointsController from './Controller/PointsController';
import ItemsController from './Controller/ItemsController';

//index (listagem), show (exibir um único registro), create, update, delete

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;