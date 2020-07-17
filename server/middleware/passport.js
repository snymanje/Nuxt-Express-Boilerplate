const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleTokenStrategy = require('passport-google-id-token');

const User = require('../models/userModel');

passport.use('googleToken', new GoogleTokenStrategy({
    clientID: process.env.GOOGLECLIENTID,
    clientSecret: process.env.GOOGLECLIENTSECRET,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // check if the current user exists in the DB
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        // Id user does not exist creat a new one`);
        const newUser = await User.create({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        return done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));