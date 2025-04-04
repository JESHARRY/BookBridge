const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    const token = authHeader.split(" ")[1]; 
    console.log(token)

    jwt.verify(token, "$Hari2224@642422", (err, user) => {
        if(err){
            console.log(err)
            return res.status(403).json({message: "Token expired. Please SignIn again."});
        }
        req.user = user;
        next();
    });
};

module.exports = {authenticateToken};