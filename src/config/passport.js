const passport = require ('passport');
const LocalStrategy =  require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
usernameField: 'correo'
}, async (correo, passwaord, done)=>{
   const user = await User.findOne({correo: correo});
   if(!user){
       return done(null, false, {message: 'Usuario No Encontrado'})
   }else{
      const match = await user.matchPassword(passwaord);
      if(match){
          return done (null, user);
      }else{
          return done (null, false, {message: 'Contraseña Incorrecta'});
      }
   }
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user)
    });
});