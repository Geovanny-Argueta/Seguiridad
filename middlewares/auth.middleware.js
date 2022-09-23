const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const protecSession = async (req, res, next) => {
  try {
    //Get Token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //Extrac Token
      //req.headers.authorization = 'Bearer token'
      token = req.headers.authorization.split(" ")[1];
    }
    //Check if the token was sent yes or not
    if (!token) {
      return res.status(403).json({
        status: "Error",
        message: "Invalid Sesion",
      });
    }

    //Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //verify the token owners
    const user = await User.findOne({
      where: {
        id: decoded.id,
        status: "active",
      },
    });
    if (!user) {
      return res.status(403).json({
        status: "Error",
        message: "the owner of the sesion is not longer active",
      });
    }
    req.sessionUser = user;
    next();

    //Grant access
  } catch (error) {
    console.log(error);
  }
};

//Create a middle to protect the users Accoount
const protectUsersAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  //Check the sessionUser to compare to the one that wants to be update/deleted
  //If the users (id), dont match, send a error, otherwise continue
  if (sessionUser.id !== user.id) {
    return res.status(403).json({
      status: "Error",
      message: "you are not the owner of this account",
    });
  }

  //If the Id make match, grant access
  next();
};

//Create a middleware to protect the post
const protectPostsOwners = (req, res, next) => {
  const { sessionUser, post } = req;

  if (sessionUser.id !== post.userId) {
    return res.status(403).json({
      status: "Error",
      message: "This post does not belong to you",
    });
  }
  next();
};

//Create a middleware to Protect the comments
const protectCommentsOwners = (req, res, next)=>{
  const {sessionUser, comment}= req
  if(sessionUser.id !== comment.userId){
    return res.status(403).json({
      status:"Error",
      message:"The commment does not belong to you"
    })
  }
  next();
}

//Create a middlaware that only grants access to admin users
const protectAdmin = (req, res, next)=>{
  const {sessionUser} = req

  if(sessionUser.rol !== 'admin'){
    return res.status(403).json({
      status:'Error',
      message:'You not have to access level for this data'
    })
  }
  next()
}

module.exports = {
  protecSession,
  protectUsersAccount,
  protectPostsOwners,
  protectCommentsOwners,
  protectAdmin
};
