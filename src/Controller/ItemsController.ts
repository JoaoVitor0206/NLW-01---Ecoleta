import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');
  
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`, // rota para acessar arquivos estáticos (imagens) (http://localhost:3333/uploads/imagename.jpg)
      };
    });
  
    return response.json(serializedItems);
  }
}

export default ItemsController;