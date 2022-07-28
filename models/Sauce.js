const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: [true, 'le nom est requis' ]},
    manufacturer: { type: String, required: [true, 'le créateur de la sauce doit être indiqué'] },
    description: { type: String, required: [true, 'la description est requise'] },
    mainPepper: { type: String, required: [true, "l'ingrédient principale est requis"] },
    imageUrl: { type: String, required: [true, 'une image doit être insérer'] },
    heat: { type: Number, required: [true, 'la valeur de chaleur est requise'] },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauces', saucesSchema);