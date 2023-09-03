const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
app.use(express.static('public'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const hostname= '127.0.0.1'
const port = 3000;

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/api/data', (req, res) => {
    const data = [100, 50, 300, 40, 350, 250]; // assuming this is coming from the database
    res.json(data);
});

app.listen(port, hostname, () =>{
  console.log(port)

});
