const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.render("users/signup");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    savedRedirectUrl, 
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true }), 
        async (req, res) => {
            req.flash("success", "Logged in successfully");
            const redirectUrl = res.locals.redirectUrl || '/listings';
            res.redirect(redirectUrl);
});

router.get("/logout", (req,res,next) => {
    req.logout((err) => {
        if (err) { 
            return next(err); 
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });

});

module.exports = router;