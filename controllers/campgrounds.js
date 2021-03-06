const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapboxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 2
    }).send()

    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'New campground was added successfully!');
    res.redirect(`/campgrounds/${ camp._id }`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found :(');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found :(');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.removeImages) {
        for(let file of req.body.removeImages) {
            await cloudinary.uploader.destroy(file);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.removeImages } } } });
    }
    const campgroundName = await Campground.findById(id);
    req.flash('success', `${ campgroundName.title } was updated successfully!`);
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground is removed');
    res.redirect('/campgrounds');
}
