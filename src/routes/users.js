const express = require ('express');
const router = express.Router();

const User = require ('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) =>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup', (req, res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
    const { nombre, correo, password, confirm_password } = req.body;
    const errores = [];
    if(nombre.length <= 0){
        errores.push({text: 'Por Favor Ingrese Un Nombre'});
    }
    if(password != confirm_password){
        errores.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4){
        errores.push({text: 'La contraseña debe ser mayor a caracteres'});
    }
    if(errores.length > 0){
        res.render('users/signup', {errores, nombre, correo, password, confirm_password});
    }else{
        const correoUser = await User.findOne({correo: correo});
        if(correoUser){
            req.flash('mensaje_error', 'El Correo Ya Existe')
            res.redirect('/users/signin');  
        }
        const newUser = new User({nombre, correo, password});
        newUser.password = await newUser.encrypPassword(password);
        await newUser.save();
        req.flash('mensaje_exitoso', 'Registro Exitoso');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})


module.exports = router;