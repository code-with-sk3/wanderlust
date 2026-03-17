const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//Index route for listing
router
    .route("/")
    .get(listingController.index)
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));

// new route - display form
router.get("/new", isLoggedIn, listingController.renderNewForm);


// update route
// delete route
// show route
router.route("/:id")
.put(isLoggedIn, isOwner, validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))
.get(wrapAsync(listingController.showListing));





// edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));







module.exports = router;