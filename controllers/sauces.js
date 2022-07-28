const Sauce = require('../models/Sauce');
const fs =  require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.updateSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) =>{
      if(sauce.userId !== req.auth.userId){
        res.status(403).json({message:'unauthorized request'})
      } else {
        if(req.file){
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {});
        }
        const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
          ...req.body
        }
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({message:'sauce modifiée'}))
          .catch(error => res.status(400).json({error}));
      }
    })
    .catch(error => res.status(400).json({error}));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((object) => {
        if(object.userId !== req.auth.userId){
          res.status(403).json({message:'unauthorized request'})
        } else {
          const filename = object.imageUrl.split('/images')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({message: 'image supprimée'}))
            .catch(error => res.status(404).json({ error }))
          })
        }
      })
      .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((object) => {

      if(!object.usersLiked.includes(req.body.userId) && req.body.like === 1){
          Sauce.updateOne(
            {_id: req.params.id},
            {
              $inc: {likes: 1},
              $push: {usersLiked: req.body.userId}
            }
            )
            .then(() => res.status(201).json({message:'like + 1'}))
            .catch(error => { res.status(400).json( { error } )});  
          };

      if(object.usersLiked.includes(req.body.userId) && req.body.like === 0){
        Sauce.updateOne(
          {_id: req.params.id},
          {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId}
          })
          .then(() => res.status(201).json({message:'like 0'}))
          .catch(error => { res.status(400).json( { error } )});      
      }; 

      if(!object.usersDisliked.includes(req.body.userId) && req.body.like === -1){
        Sauce.updateOne(
          {_id: req.params.id},
          {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId}
          }
          )
          .then(() => res.status(201).json({message:'dislike + 1'}))
          .catch(error => { res.status(400).json( { error } )});  
        };

        if(object.usersDisliked.includes(req.body.userId) && req.body.like === 0){
          Sauce.updateOne(
            {_id: req.params.id},
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId}
            })
            .then(() => res.status(201).json({message:'dislike 0'}))
            .catch(error => { res.status(400).json( { error } )});      
        }; 

    })  
    .catch(error => { res.status(404).json( { error } )});
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({error}));
  };