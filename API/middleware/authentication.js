const jwt = require('jsonwebtoken');
const JWT_KEY="anSHul2114CraNK";
module.exports = (req,res,next) => {
  const header=req.headers.authorization;
  console.log(header);
  if(header == null){throw Error("Authentication Failed {Token Not Provided}");}
  const token =header.trim().split(" ")[1];
  try{
  const decoded= jwt.verify(token,JWT_KEY);
  req.userData=decoded;

  next();
}
catch(err){
  return res.status(401).json({msg:"Authentication Failed"});
}
}
