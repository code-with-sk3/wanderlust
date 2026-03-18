const Listing = require("../models/listing");
const Async = require("../utils/wrapAsync");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });

};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
        populate: {
            path: "author"
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Cannot find the listing!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        // If an image was uploaded via multer/cloudinary, store its URL.
        if (req.file && req.file.path) {
            newListing.image = req.file.path;
        }
    
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let originalImageurl = listing.image;
    originalImageurl = originalImageurl.replace("/upload/", "/upload/w_300/"); // Resize to width 300px for thumbnail
    listing.image = originalImageurl;


    req.flash("success", "Successfully fetched the listing!");
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req,res) => {
    
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);

    // If a new image was uploaded, update the listing's image URL.
    if (req.file && req.file.path) {
        listing.image = req.file.path;
        await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};