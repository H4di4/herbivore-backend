
const express = require('express');
const router = express.Router();
const SocialLinks = require('../models/SocialLinks');


router.get('/', async (req, res) => {
    try {
        let links = await SocialLinks.findOne({});
        if (!links) {
          // If no links document exists yet, create default one
          links = await SocialLinks.create({});
        }
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update social links
router.post('/', async (req, res) => {
    try {
        const { facebook, instagram, twitter , youtube} = req.body;


        let links = await SocialLinks.findOne({});
        if (!links) {
            links = new SocialLinks({ instagram, facebook, youtube, twitter });
        } else {

            links.instagram = instagram;
            links.facebook = facebook;
            links.youtube = youtube;
            links.twitter = twitter;
            

        }
        await links.save();
        res.json({ message: 'Social links updated', data: links });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
