const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const Err = require('./utils/Err');
const { reviewSchema } = require('./validate');
const campgrounds = require('./routes/campgrounds');

const dbPort = 27017;
const dbName = 'camp';
mongoose.connect(`mongodb://localhost:${ dbPort }/${ dbName }`, {
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
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'assets')));

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(elm => elm.message).join(', ');
        throw new Err(msg, 400);
    } else {
        next();
    }
}

app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home');

    console.log(`==========> requested path: ${ req.url }`);
});

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

app.all('*', (req, res, next) => {
    next(new Err('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong :(';

    res.status(statusCode).render('error', { err });
});

const port = 3000;
app.listen(port, () => {
    console.log(`==========> server is running on port: ${ port }`);
});
