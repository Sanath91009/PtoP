const {
  createUser,
  getUser,
} = require("../../DB/models/User.js");

const { 
  checkIfLogin, 
  performLogin
} = require("../../Services/Auth/LoginService");

const {
   haveCodeforces
} = require("../../Helpers/Auth/codeforces");


async function HandleUserRegister(req,res,next) {
  const { 
    username, 
    password, 
    email_id 
  } = req.body;
  
  const result = await getUser(username)
  console.log(result);
  if ( result === undefined || result === null) {
        try {   
           const verify = await haveCodeforces(username,email_id);
           if ( verify.code != 404 ) {
                await createUser(username,email_id,password);
                performLogin(res,username,password) 
                .then( (token) => {
                  res.status(200);
                  verify.token = token;
                  res.send(verify);
                })
                .catch((err) => {
                  next(err);
                })
          } else {
             res.send(verify);
          }
        } catch (err) {
          next(err);
        }
      } else {
          console.log("Iam already in db")
          const err = new Error("You have already registered");
          err.code = 400;
          next(err);
      }
}


async function HandleUserRegisterJee(req,res,next) {
  const { 
    username, 
    password, 
    email_id 
  } = req.body;
  const result = await getUser(username)
  console.log(result);
  if ( result === undefined || result === null) {
        try {   
            await createUser(username,email_id,password);
            performLogin(res,username,password) 
            .then( (token) => {
              res.status(200);
              res.send({"code":200,token});
            })
            .catch((err) => {
              next(err);
            })
        } catch (err) {
            next(err);
        }
      } else {
          console.log("Iam already in db")
          const err = new Error("You have already registered");
          err.code = 400;
          next(err);
      }
}


function HandleUserLogin(req,res,next) {
  checkIfLogin(req.cookies.__AT__)
    .then((token) => {
      res.send({"code": 200,token})
    })
    .catch((err) => {
      performLogin(res,req.body.username, req.body.password) 
        .then( (token) => {
          res.status(200);
          res.send({"code": 200,token});
        })
        .catch((err) => {
          next(err);
        })
    })
}

async function HandleUserLogout(req, res, next) {
  console.log("Into Handle user LogOut")
  console.log(req.cookies);
  res.clearCookie('__AT__',{sameSite: 'none', secure: true} );
  res.send({"code":200,message:"Logged out successfully"})
  console.log("User Logged out")
          
}

module.exports = {  
  HandleUserLogin, 
  HandleUserRegister, 
  HandleUserRegisterJee,
  HandleUserLogout
};

