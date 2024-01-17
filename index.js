const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const Location = require('./models/map_model'); // Import the Location model
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mapping-tool', { useNewUrlParser: true, });

// ...

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


app.get('/', async (req, res) => {
    res.render('index');
    });

// Use the Location model in your routes

app.post('/saveLocation', async (req, res) => {
  const { address } = req.body;

  // Use Google Maps Geocoding API to get coordinates from the address
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: 'YAIzaSyAeteAyYoWh46Cs1GxJci0g2BotXZkj7no',
      },
    });

    console.log(response.data);
    const { results } = response.data;

    if (results.length > 0) {
      const { formatted_address, geometry } = results[0];
      const { location } = geometry;

      // Save to MongoDB using the Location model
      const newLocation = new Location({
        address: formatted_address,
        latitude: location.lat,
        longitude: location.lng,
      });

      await newLocation.save();
      console.log(response.data);

      res.redirect('/');
    } else {
      res.status(404).send('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ...

