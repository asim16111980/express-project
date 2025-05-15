import jwt from "jsonwebtoken";
const generateJWT = (payload, expire) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: expire });
};

export default generateJWT;
