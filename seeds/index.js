const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

const dbPort = 27017;
const dbName = 'camp';
mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`==========> DB server is running on port: ${dbPort}`);
});

const sample = (arr) => {
    arr[Math.floor(Math.random() * arr.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});

    for(let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });

        await camp.save();
    }
}

seedDB();