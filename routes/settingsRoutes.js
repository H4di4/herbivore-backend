const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const Currency = require('../models/Currency');
const LanguageCurrencyMap = require('../models/LanguageCurrencyMap');

// GET /api/settings/languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching languages' });
  }
});

// GET /api/settings/currencies
router.get('/currencies', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching currencies' });
  }
});

// GET /api/settings/language-currency-map
router.get('/language-currency-map', async (req, res) => {
  try {
    const map = await LanguageCurrencyMap.find();
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching language-currency mapping' });
  }
});

module.exports = router;
