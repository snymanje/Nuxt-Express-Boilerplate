const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
 
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLECLIENTID,
    clientSecret: process.env.GOOGLECLIENTSECRET,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile)
        done(null, accessToken);
    
  } catch(error) {
        done(error, false, error.message);
  }   
}));