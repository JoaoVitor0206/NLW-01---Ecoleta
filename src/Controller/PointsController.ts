import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items) // converte para string
      .split(',') // separa por vírgula
      .map(item => Number(item.trim())); // remove espaços antes e depois e converte para número

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id') // junta os dados das duas tabelas
      .whereIn('point_items.item_id', parsedItems) // busca os pontos que possuem os itens selecionados
      .where('city', String(city)) // busca os pontos na cidade selecionada
      .where('uf', String(uf)) // busca os pontos no estado selecionado
      .distinct() // retorna apenas um registro de cada ponto
      .select('points.*'); // seleciona todos os campos da tabela points

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first(); // first() retorna apenas um registro

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id') // junta os dados das duas tabelas
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    const trx = await knex.transaction(); // se uma query falhar, as outras não serão executadas

    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id, // id do ponto cadastrado
      };
    })

    await trx('point_items').insert(pointItems);

    await trx.commit(); // insere os dados no banco

    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;