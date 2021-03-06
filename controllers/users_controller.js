const User = require("../models/user");
const fs = require('fs');
const path = require('path');
// const Post = require('../models/post');
// const Like = require('../models/likes');
// const Comment = require('../models/comment');


module.exports.profile = function (req, res) {
  User.findById(req.params.id, function(err, user){
    return res.render("user_profile", {
      title: "Users Profile",
      profile_user:user
    });
  });
};

module.exports.update = async function(req, res){
  // if(req.user.id==req.params.id){
  //   User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
  //     req.flash('success','Details Updated');
  //     return res.redirect('back');
  //   });
  // }
  // else{
  //   req.flash('error','Access Denied');
  //   return res.status(401).send("Unauthorized");
  // }
  if(req.user.id == req.params.id){

    try{

      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req,res,function(err){
        if(err){
          console.log("****Multer Error:****",err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

       
        if(req.file){

          if(user.avatar){
            fs.unlinkSync(path.join(__dirname, '..',user.avatar));
          }
           // this is saving the path of uploaded file into avatar filed in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back')
      });
    }
    catch(err){
      req.flash('error',err);
      return res.redirect('back');
    }
  }
  else{
    req.flash('error','Unauthorized:');
    return res.status(401).send("Unauthorized");
  }
}

// render signup page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signup", {
    title: "Codeial | Sign Up",
  });
};

// render signin page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signin", {
    title: "Codeial | Sign In",
  });
};


// get the sign in data
module.exports.create = function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user in signing Up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in finding user in signing Up");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create session for user
module.exports.createSession = function (req, res) {
  req.flash('success','Logged In Successfully');
  return res.redirect("/");
};


// logout
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash('success','Logged Out Successfully');
  return res.redirect("/");
};