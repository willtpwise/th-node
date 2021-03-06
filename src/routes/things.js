const { Router } = require('express');
const httperrors = require('httperrors');
const Thing = require('../models/thing');
const pagination = require('../lib/pagination');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Thing.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const thing = await Thing.findById(req.params.id);

    if (!thing) throw httperrors.NotFound();

    res.json(thing);
  })
  .post('', async (req, res) => {
    const payload = req.body;

    if (!payload) {
      throw httperrors.BadRequest();
    }

    if (payload.quantity < 10) {
      throw httperrors.BadRequest();
    }

    if (new RegExp(/:/).test(payload.name) && req.auth.name !== 'admin') {
      throw httperrors.Forbidden();
    }

    const created = await Thing.create(payload);

    res.json(created);
  });
