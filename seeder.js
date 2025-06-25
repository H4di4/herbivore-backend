const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Language = require('./models/Language');
const Currency = require('./models/Currency');
const LanguageCurrencyMap = require('./models/LanguageCurrencyMap');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Language.deleteMany();
        await Currency.deleteMany();
        await LanguageCurrencyMap.deleteMany();

        // Languages
        const languages = await Language.insertMany([
            { code: 'en', label: 'English', dir: 'ltr', country: 'United States' },
            { code: 'hi', label: 'Hindi', dir: 'ltr', country: 'India' },
            { code: 'es', label: 'Spanish', dir: 'ltr', country: 'Argentina' },
            { code: 'fr', label: 'French', dir: 'ltr', country: 'France' },
            { code: 'ur', label: 'Urdu', dir: 'rtl', country: 'Pakistan' },
            { code: 'zh', label: 'Chinese', dir: 'ltr', country: 'China' },
        ]);


        const currencies = await Currency.insertMany([
            { country: 'United States', currency: 'Dollar', code: 'USD', symbol: '$' },
            { country: 'India', currency: 'Rupee', code: 'INR', symbol: '₹' },
            { country: 'Pakistan', currency: 'Rupee', code: 'PKR', symbol: '₨' },
            { country: 'France', currency: 'Euro', code: 'EUR', symbol: '€' },
            { country: 'Argentina', currency: 'Peso', code: 'ARS', symbol: '$' },
            { country: 'China', currency: 'Yuan Renminbi', code: 'CNY', symbol: '¥' },
        ]);


        // Language-Currency Mapping
        const mapData = [
            { languageCode: 'en', currencyCode: 'USD' },
            { languageCode: 'hi', currencyCode: 'INR' },
            { languageCode: 'es', currencyCode: 'ARS' },
            { languageCode: 'fr', currencyCode: 'EUR' },
            { languageCode: 'ur', currencyCode: 'PKR' },
            { languageCode: 'zh', currencyCode: 'CNY' },
        ];

        await LanguageCurrencyMap.insertMany(mapData);

        console.log('✅ Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
