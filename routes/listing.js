const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next) => {
    
    let {error} = listingSchema.validate(req.body);

        if(error) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else{
            next();
        }
}


//Index route for listing
router.get("/", wrapAsync(async (req,res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", {allListing});
}));

// new route - display form
router.get("/new", (req,res) => {
    res.render("listings/new");
});

// show route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Cannot find the listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// create route - handle form submission
router.post("/", validateListing,wrapAsync(async (req,res,next) => {
        
        const newListing = new Listing(req.body.listing);
    
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);

// edit route
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Successfully fetched the listing!");
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.put("/:id", validateListing,wrapAsync(async (req,res) => {
    
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));


module.exports = router;