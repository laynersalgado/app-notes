const express = require ('express');
const router = express.Router();

const Note = require ('../models/Note');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-note');
})

router.post('/notes/new-note', isAuthenticated, async (req, res)=>{
    const {titulo, descripcion} = req.body;
    const errores = [];
    if(!titulo){
        errores.push({text: 'Por favor Inserte un Titulo'})
    }

    if(!descripcion){
        errores.push({text: 'Por favor Inserte una Description'})
    }

    if(errores.length > 0){
        res.render('notes/new-note', {
            errores,
            titulo,
            descripcion
        });
    }else{
        const NewNote = new Note({titulo, descripcion});
        NewNote.user = req.user.id;
        await NewNote.save();
        req.flash('mensaje_exitoso', 'Nota Agregada');
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticated, async (req, res) =>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-notes', {note});    
});

router.put('/notes/edit-notes/:id', isAuthenticated, async (req, res)=>{
    const {titulo, descripcion}= req.body;
    await Note.findByIdAndUpdate(req.params.id, {titulo, descripcion});
    req.flash('mensaje_exitoso','Nota Actualizada Exitosamente')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('mensaje_exitoso','Nota Eliminada Exitosamente')
    res.redirect('/notes');
});


module.exports = router;