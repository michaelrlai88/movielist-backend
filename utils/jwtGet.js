const jwt = require("jsonwebtoken");

//Generates jwt token, takes user's id and inserts it into payload
const jwtGet = (user_id) => {
  const payload = {
    user_id,
  };

  return jwt.sign(payload, process.env.jwtKey, { expiresIn: "1h" });
};

module.exports = jwtGet;
