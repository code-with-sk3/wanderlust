const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req,res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.render("users/signup");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true }), 
        async (req, res) => {
            res.flash("success", "Logged in successfully");
            res.redirect("/listings");
        }
    
);

module.exports = router;