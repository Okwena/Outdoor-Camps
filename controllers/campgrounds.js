const Campground = require('../models/campground.js');
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")//colt steele
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');//from mapbox website
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken})


module.exports.index = async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
   
    res.render('campgrounds/new.ejs')
}

module.exports.createCampground = async(req,res,next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    
    console.log(campground)
    req.flash('success', 'Succesfully Made A New Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    
}

module.exports.showCampground = async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
    populate: {
        path: 'author'
    }}).populate('author')
   // console.log(campground)
    if(!campground){
        req.flash('error','Cannot find that campground!')
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    console.log(req.body)
     const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
     const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
     campground.images.push(...imgs)
     await campground.save()

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: { filename: {$in: req.body.deleteImages}}}})
        //console.log(campground)
    }

    req.flash('success', 'Succesfully Updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground')
    res.redirect('/campgrounds');
}