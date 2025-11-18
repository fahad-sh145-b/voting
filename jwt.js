const jwt = require('jsonwebtoken')


const jwtAuthmiddleware = (req, res, next) => {


    // first check request header has authorization or not

    const authorization = req.headers.authorization;

    if (!authorization) return res.status(401).json({ error: 'Token not found' });

    // Extract the jwt token from the request headers

    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {

        //verify the jwt token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }
    catch (err) {

        console.log(err);
        return res.status(401).json({ error: 'authentication failed' });
    }

}

//function to generate jwt token

const generatetoken = (userData) => {

    //generate a new token using user data


    return jwt.sign(userData, process.env.JWT_SECRET);


}


module.exports = { jwtAuthmiddleware, generatetoken };
