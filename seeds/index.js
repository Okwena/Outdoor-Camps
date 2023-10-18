const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++){
        const price = Math.floor(Math.random() * 1000)
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '64a2705f6232c4f54bb99b3c',//your user ID
            location: `${cities[random1000].city}, ${[cities[random1000].state]}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est autem molestiae omnis obcaecati maxime. Reprehenderit voluptates voluptas sapiente ducimus repudiandae veritatis dolores obcaecati necessitatibus. Voluptatibus neque animi debitis numquam quae.',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            }
            ,
            images: [
                {
                  url: 'https://res.cloudinary.com/dopbostpi/image/upload/v1689834297/YelpCamp/qjuricqtdhvbqegyf1o2.jpg',
                  filename: 'YelpCamp/qjuricqtdhvbqegyf1o2',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dopbostpi/image/upload/v1689834297/YelpCamp/lbv0zqjeuyfqb0o0ytls.jpg',
                  filename: 'YelpCamp/lbv0zqjeuyfqb0o0ytls',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dopbostpi/image/upload/v1689834297/YelpCamp/ae7eixwwjhitwdeqmcjo.jpg',
                  filename: 'YelpCamp/ae7eixwwjhitwdeqmcjo',
                 
                },
                {
                  url: 'https://res.cloudinary.com/dopbostpi/image/upload/v1689834297/YelpCamp/n7pgvuq3cqchyvhw8dzb.jpg',
                  filename: 'YelpCamp/n7pgvuq3cqchyvhw8dzb',
                  
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});