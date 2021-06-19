const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');

const dbPort = 27017;
const dbName = 'camp';
mongoose.connect(`mongodb://localhost:${ dbPort }/${dbName}`, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`==========> db server is running on port: ${ dbPort }`);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');

    console.log(`==========> requested path: ${ req.url }`);
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

    console.log(`==========> requested path: ${ req.url }`);
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');

    console.log(`==========> requested path: ${ req.url }`);
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });

    console.log(`==========> requested path: ${ req.url }`);
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });

    console.log(`==========> requested path: ${ req.url }`);
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

    console.log(`==========> requested path: ${ req.url }`);
});

const port = 3000;
app.listen(port, () => {
    console.log(`==========> server is running on port: ${ port }`);
});