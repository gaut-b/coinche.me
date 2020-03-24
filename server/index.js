import express from 'express';

const app = express()

app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})