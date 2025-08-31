const express = require('express');
const router = express.Router();

const User = require('../models/user');

// const { jwtAuthMiddleware, generatetoken } = require('../jwt');
const { jwtAuthmiddleware, generatetoken } = require('./../jwt');



router.post('/signup', async (req, res) => {

    try {

        const data = req.body;



        // Check if there is already an admin user

        const adminUser = await User.findOne({ role: 'admin' });

        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }



        // Validate Aadhar Card Number must have exactly 12 digit

        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must have exactly 12 digit' });
        }

        // Check if a user with the same Aadhar Card Number already exists

        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });

        if (existingUser) {
            return res.status(400).json({ error: ' user with the same Aadhar Card Number already exists' });
        }
        //create a new user using the mongoose model

        const newuser = new User(data);

        //save the new user to the database

        const response = await newuser.save();
        console.log("data saved");

        const payload = {
            id: response.id

        }


        console.log(JSON.stringify(payload));

        const token = generatetoken(payload);

        console.log('Token is', token);


        res.status(200).json({ response: response, token: token });
    }

    catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'internal server error' });
    }



})


router.post('/login', async (req, res) => {

    try {

        //Extract aadhar card number or password from a req body

        const { aadharCardNumber, password } = req.body;

        //find the user by aadhar card number

        const foundUser = await User.findOne({ aadharCardNumber: aadharCardNumber });

        // if user does not exist or password  does not match return error

        if (!foundUser || !(await foundUser.comparePassword(password))) {

            return res.status(401).json({ error: 'invalid username or password' })


        }

        const payload = {
            id: foundUser.id

        }

        const token = generatetoken(payload);

        //return token as response

        return res.json({ token });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error' });

    }

})

router.get('/profile', jwtAuthmiddleware, async (req, res) => {

    try {

        const userData = req.foundUser;




        const userId = userData.id;
        // const foundUserId = req.user.id;



        const foundUser = await User.findById(foundUserId);

        return res.status(200).json({ foundUser });
    }
    catch (err) {
        return res.status(500).json({ error: 'internal server error' });
    }
})

router.put('/profile/password', jwtAuthmiddleware, async (req, res) => {

    try {

        //Extract id from the token

        const foundUserId = req.user;

        // const foundUserId = req.user.id;  


        //Extract current and new passowrds from request body

        const { currentPassword, newPassword } = req.body;

        //find the user by userid

        const foundUser = await User.findById(foundUserId);

        //if password does not match return error

        if (!(await foundUser.comparePassword(currentPassword))) {

            return res.status(401).json({ error: 'invalid username or password' })

        }

        //update the user's password

        foundUser.password = newPassword;
        await foundUser.save();

        console.log('password updated');

        res.status(200).json({ message: 'password updated' })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal  server error' })
    }
})



module.exports = router;
