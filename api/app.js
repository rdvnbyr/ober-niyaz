const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const Oberflache = require('./models/oberflache');
const mongoose = require('mongoose');

mongoose
  .connect('----mongo-uri---')
  .then((con) => {
    console.log(`Mongo connected: ${con}`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
// const read = fs.readFileSync('./public/sometext.txt', 'utf8', (err) => {
//   if (err) {
//     console.log(err);
//   }
// });

app.post('/api/add-server', async (req, res, next) => {
  const newOberflache = req.body;
  const oberflache = fs.readFileSync(__dirname + '/oberflache.json').toJSON();
  const oberflacheBuff = Buffer.from(oberflache.data).toString();
  const oberflacheJson = JSON.parse(oberflacheBuff);
  oberflacheJson.push({ id: oberflacheJson.length + 1, ...newOberflache });
  const buffToNewOberflache = Buffer(JSON.stringify(oberflacheJson));
  fs.writeFileSync(__dirname + '/oberflache.json', buffToNewOberflache);
  res.json({ message: 'Neue Oberflache hat erstellt.' });
});

app.get('/api/get-server', async (req, res, next) => {
  const oberflache = fs.readFileSync(__dirname + '/oberflache.json').toJSON();
  const oberflacheBuff = Buffer.from(oberflache.data).toString();
  const oberflacheJson = JSON.parse(oberflacheBuff);
  res.json(oberflacheJson);
});

app.post('/api/add', async (req, res, next) => {
  const { lieferdatum, ...restOberflache } = req.body;
  const createNewOberflache = new Oberflache({
    ...restOberflache,
    lieferdatum: new Date(lieferdatum),
  });
  await createNewOberflache.save();
  res.json({ message: 'Oberfläche ist erstellt geworden.' });
});

app.get('/api/get', async (req, res, next) => {
  const oberflachen = await Oberflache.find();
  res.json(oberflachen);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
