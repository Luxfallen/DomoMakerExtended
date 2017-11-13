const mongoose = require('mongoose');
const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! All fields required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    rawrLevel: req.body.rawrLevel,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR! Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occurred!' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ domos: docs });
  });
};

const delDomo = (request, response) => {
  const req = request;
  const res = response;
  Domo.DomoModel.findByIdAndRemove(JSON.parse(req.body._id), (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return false;
  });
  /*
  return res.json(mongoose.connection.db.collection.deleteOne({
    id: req.body._id,
    OR
    name: req.body.name,
    body: req.body.age,
    rawrLevel: req.body.rawrLevel,
    owner: req.session.account._id,
  }));
  */
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = delDomo;
