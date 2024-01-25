const LocalStrategy = require("passport-local").Strategy;
const {User} = require("./database.js");
exports.initializingPassport= (passport) =>{
    passport.use(new LocalStrategy(async (username, password, done) => {
        console.log("Authenticating user:", username);
        try {
            const user = await User.findOne({ username });
            console.log("Found user:", user);
            if (!user) return done(null, false);
            if (user.password !== password) {
                console.log("Incorrect password");
                return done(null, false);
            }
            console.log("Authentication successful");
            return done(null, user);
        } catch (err) {
            console.error("Authentication error:", err);
            return done(err, false);
        }
    }));
    


    passport.serializeUser((user,done) =>{
        done(null, user.id);
    })

    passport.deserializeUser(async(id,done) =>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }
        catch(err){
            done(err,false);
        }



    });
}


exports.isAuthenticated = (req,res,next) =>{
    if(req.user) return next();

    res.redirect("/login");
}