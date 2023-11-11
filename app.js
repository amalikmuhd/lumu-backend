const Joi = require('joi');
const express = require('express');
const app = express();

// middleware
app.use(express.json());

const store = [
  { id: 1, name: 'play station 5', price: '500000', location: 'abuja' },
  { id: 2, name: 'macbook pro 2015', price: '350000', location: 'kaduna' },
  { id: 3, name: 'cable charger iphone 14', price: '20000', location: 'lagos' },
  { id: 4, name: 'iphone 14', price: '800000', location: 'abuja' },
];

// get all the data from marketplace
app.get('/api/marketplace', (req, res) => {
  res.send(store);
  res.end();
});

// filter given ID from the marketplace
app.get('/api/marketplace/:id', (req, res) => {
  // Lookup for id
  const marketplace = store.find((result) => result.id === parseInt(req.params.id));
  // if not existing, return 404
  if (!marketplace) return res.status(404).send('No result found');
  // Return the marketplace data
  res.send(JSON.stringify(marketplace));
  res.end();
});

// create an item to marketplace
app.post('/api/marketplace', (req, res) => {
  // Validate
  const { error } = marketplaceSchema(req.body);
  // if invalid, return 400 - Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  store.push({
    id: store.length + 1,
    name: req.body.name,
    price: req.body.price,
    location: req.body.location,
  });
  res.send(store);
});

// update an item to marketplace
app.put('/api/marketplace/:id', (req, res) => {
  // Lookup for id
  const marketplace = store.find((result) => result.id === parseInt(req.params.id));
  // if not existing, return 404
  if (!marketplace) res.status(404).send('No result found');

  // Validate
  const { error } = marketplaceSchema(req.body);
  // if invalid, return 400 - Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  const updateItem = store.indexOf(marketplace);
  // Update item
  store[updateItem] = {
    name: req.body.name,
    price: req.body.price,
    location: req.body.location,
  };

  // Return the updated marketplace
  res.send(store);
  res.end();
});

// Delete an item to marketplace
app.delete('/api/marketplace/:id', (req, res) => {
  // Lookup for id
  const marketplace = store.find((result) => result.id === parseInt(req.params.id));
  // if not existing, return 404
  if (!marketplace) return res.status(404).send('No result found');

  const removeItem = store.indexOf(marketplace);
  store.splice(removeItem, 1);
  // Return the updated marketplace item
  res.send(store);
});

const marketplaceSchema = (req) => {
  // validate the inputs
  const schema = {
    id: Joi.number(),
    name: Joi.string().min(10).max(50).required(),
    price: Joi.string().required(),
    location: Joi.string().required(),
  };
  // return the either error or value
  return Joi.validate(req, schema);
};

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to ${port}`);
});
