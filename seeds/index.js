const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbPort = 27017;
const dbName = 'camp';
mongoose.connect(`mongodb://localhost:${ dbPort }/${ dbName }`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`==========> DB server is running on port: ${ dbPort }`);
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for(let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "60d5b1d27dd1942decf50084",
            location: `${ cities[random].city }, ${ cities[random].state }`,
            title: `${ sample(descriptors) } ${ sample(places) }`,
            images: [
                {
                    filename: 'Nevada Las Vegas',
                    url: 'https://res.cloudinary.com/ux-ui-designer/image/upload/v1624727506/Campgrounds/nevada-las-vegas_rwgkxh.jpg'
                },
                {
                    filename: 'Tent Camping',
                    url: 'https://res.cloudinary.com/ux-ui-designer/image/upload/v1624727504/Campgrounds/tent-camping_d7j1nt.jpg'
                }
            ],
            description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude
                ]
            }
        });

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});