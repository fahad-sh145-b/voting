const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate');

const User = require('../models/user');


const { jwtAuthmiddleware, generatetoken } = require('./../jwt');

const checkAdminRole = async (userId) => {
    try {
        const foundUser = await User.findById(userId);

        if (foundUser.role === 'admin') {

            return true;
        }
    }

    catch (err) {
        return false;
    }


}

router.post('/', jwtAuthmiddleware, async (req, res) => {


    try {
        if (!(await checkAdminRole(req.user.id)))

            return res.status(403).json({ message: 'user  does has not an admin role' });


        //assuming the request body  contains to the candidate data
        const data = req.body;

        //create a new user using the mongoose model

        const newcandidate = new Candidate(data);

        //save the new user to the database

        const response = await newcandidate.save();
        console.log("data saved");




        res.status(200).json({ response: response });
    }

    catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'internal server error' });
    }



})


router.put('/:candidateId', jwtAuthmiddleware, async (req, res) => {
    try {

        if (! await checkAdminRole(req.user.id))

            return res.status(403).json({ message: 'user  does has not an admin role' });

        //extract the id from url parameter

        const candidateId = req.params.candidateId;

        //updated data from the candidate

        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {

            new: true, //return the updated document
            runValidators: true, //run mongoose validation


        })

        if (!response) {
            return res.status(404).json({ error: 'candidate  not found' });
        }

        console.log(' candidate data updated');

        res.status(200).json(response);
    }

    catch (err) {

        console.log(err);
        res.status(500).json({ error: 'invalid  server error' })
    }
})



router.delete('/:candidateId', jwtAuthmiddleware, async (req, res) => {
    try {

        if (! await checkAdminRole(req.user.id))

            return res.status(403).json({ message: 'user  does has not an admin role' });

        //extract the id from url parameter

        const candidateId = req.params.candidateId;



        const response = await Candidate.findByIdAndDelete(candidateId)

        if (!response) {
            return res.status(404).json({ error: 'candidate  not found' });
        }

        console.log(' candidate data updated');

        res.status(200).json(response);
    }

    catch (err) {

        console.log(err);
        res.status(500).json({ error: 'invalid  server error' })
    }
})

//lets start voting

router.post('/vote/:candidateId', jwtAuthmiddleware, async (req, res) => {

    //no admin can vote
    //user can vote once

    candidateId = req.params.candidateId;
    userId = req.user.id;

    try {

        //find the candidate document with the specified candidate id

        const candidate = await Candidate.findById(candidateId);

        // if (! candidateId) {
        //     return res.status(404).json({ error: 'candidate not found' });

        // }

        if (!candidate) {
            return res.status(404).json({ error: 'candidate not found' });
        }


        const foundUser = await User.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'user not found' });
        }

        if (foundUser.isVoted) {
            return res.status(400).json({ message: 'you have already voted' });
        }

        if (foundUser.role == 'admin') {
            return res.status(403).json({ error: 'admin is not allowed' });
        }



        //update the  candidate document  to record the vote


        candidate.votes.push({ user: userId });

        // candidate.votes.push({foundUser:userId });

        candidate.voteCount++;

        await candidate.save();

        //update the user document

        foundUser.isVoted = true;
        await foundUser.save();

        return res.status(200).json({ message: 'vote recorded successfully' });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'invalid  server error' })
    }
})

//vote count

router.get('/vote/count', async (req, res) => {
    try {

        //find all candidates and sort them by votecount is descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        //map the candidates to only return their name and votecount

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }

        });

        return res.status(200).json({ voteRecord });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'invalid  server error' })
    }
});




// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get List of all candidates with only name and party fields
router.get('/user', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const foundUser = await User.find({}, 'name age -_id');

        // Return the list of candidates
        res.status(200).json(foundUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
