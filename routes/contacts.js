const router = require('express').Router();
const jwt = require('jsonwebtoken');
const brcrypt = require('bcrypt-nodejs');
const Contact = require('../models/contact');

router.post('/addUser', (req, res, next) => {
    Contact.findOne({ Email: req.body.Email })
        .exec().then(result => {
            if (result) {
                console.log(result);
                res.status(409).json({ success: false, message: "User exists already" });
            } else {
                brcrypt.hash(req.body.Password, null, null, (err, hash) => {
                    console.log(hash);
                    if (err) return res.status(409).json({ success: false, message: "User creation failed" });
                    else {
                        const contact = new Contact({
                            FirstName: req.body.FirstName,
                            LastName: req.body.LastName,
                            PhoneNumber: req.body.PhoneNumber,
                            Email: req.body.Email,
                            Password: hash,
                            Role: req.body.Role,
                            ReportsTo: req.body.ReportsTo,
                            created_at: Date.now()
                        });
                        contact.save().then(() => {
                            res.status(201).json({ success: true, message: contact.FirstName + " is created successfully" });
                        }).catch((err) => {
                            res.status(500).json({ success: false, message: err });
                        })
                    }
                });
            }
        }).catch((err) => {
            res.status(500).json({ success: false, message: err });
        })
});

router.get('/getAllUsers', (req, res, next) => {
    Contact.find().exec().then(allUsers => {
        res.status(200).json({ success: true, allUsers: allUsers });
    }).catch(err => {
        res.status(500).json({ success: false, message: err });
    })
})

router.patch('/updateUser', (req, res, next) => {
    console.log(JSON.stringify(req.body))
    Contact.findOne({ Email: req.body.Email })
        .exec()
        .then(user => {
            const bodyFieldsValues = Object.entries(req.body);
            const toUpdate = {};
            for (doc of bodyFieldsValues) {
                if (doc[0] == 'Password') {
                    brcrypt.hash(doc[1], null, null, (err, hash) => {
                        // doc[1] = hash;
                        toUpdate.Password = hash
                    })
                }
                toUpdate[doc[0]] = doc[1];
            }
            console.log("toUpdate" + JSON.stringify(toUpdate));
            Contact.update({ Email: user.Email }, { $set: toUpdate }).exec().then(updatedUser => {
                res.status(201).json({ success: true, message: "User updated", updatedUser: updatedUser });
            }).catch(err => { res.status(500).json({ success: false, message: err }) });
        }).catch(err => { res.status(500).json({ success: false, message: err.message }) });
})

module.exports = router;