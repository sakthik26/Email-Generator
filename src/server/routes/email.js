const express = require('express');
const router = express.Router();


const loadDB = require('../dbs');

//Fetches all the domains that are in the system
router.get('/getdomains', async (req, res) => {

    const db = await loadDB();
    const emailFormatCollection = db.collection('email_formats');

    try {
        let domains = await emailFormatCollection.find().toArray();
        res.json(domains)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Generates email based on a companies email format

router.post('/generatemail', async (req, res) => {

    if (req.body.domain && req.body.firstname && req.body.lastname) {

        const db = await loadDB();
        const emailFormatCollection = db.collection('email_formats');

        //Insert new domain if not present in the database
        const firstname = req.body.firstname.toLowerCase();
        const lastname = req.body.lastname.toLowerCase();
        const companyDomain = req.body.domain;
        try {
            let domain = await emailFormatCollection.findOne({ 'domain': companyDomain });
            if (domain.withInitials) {
                res.json({ data: firstname[0] + lastname + '@' + companyDomain })
            }
            else {
                res.json({ data: firstname + lastname + '@' + companyDomain })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }


    }
})

// Creates a new Domain if the company domain doesn't exist.
router.post('/createdomain', async (req, res) => {

    if (req.body.email && req.body.firstname && req.body.lastname) {

        const db = await loadDB();
        const emailFormatCollection = db.collection('email_formats');

        //Insert new domain if not present in the database

        let email = req.body.email.toLowerCase();
        let domain = email.split('@')[1];
        if (await emailFormatCollection.findOne({ 'domain': domain }) != null) {
            res.json({ data: 'Domain already exists' })
        }
        else {
            let firstname = req.body.firstname.toLowerCase()
            let lastname = req.body.lastname.toLowerCase()

            let emailUsername = email.split('@')[0]
            let emailWithInitials = false
            if (firstname[0] + lastname === emailUsername)
                emailWithInitials = true


            emailFormatCollection.insertOne({ domain: domain, withInitials: emailWithInitials })
                .then(result => {

                    res.json({ data: result.ops[0] })
                })
                .catch(error => console.error(error))
        }
    }

})
module.exports = router;
