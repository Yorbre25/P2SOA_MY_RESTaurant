// Import necessary dependencies.
const {Firestore} = require('@google-cloud/firestore');
const {LanguageServiceClient} = require('@google-cloud/language');
const firestore = new Firestore();
const language = new LanguageServiceClient();

const express = require('express');
const fetch = require('node-fetch'); // Ensure to have node-fetch installed
const app = express();
app.use(express.json());

// Endpoint to display the restaurant menu
app.get('/menu', async (req, res) => {
    const menuItems = await firestore.collection('menu').get();
    // Transform Firestore documents into a usable format and send as a response
    res.json(menuItems.docs.map(doc => doc.data()));
});

// Endpoint to handle reservation creation
app.post('/reservar', async (req, res) => {
    const { nombre, fecha, hora, personas } = req.body;
    // Assumes a function that checks availability
    const available = await verificarDisponibilidad(fecha, hora, personas);
    if(available) {
        // Code to create the reservation in the database
        const reservationId = await crearReservacion(nombre, fecha, hora, personas);
        res.status(200).json({ mensaje: "Reservación creada", id: reservationId });
    } else {
        res.status(400).json({ mensaje: "Horario no disponible" });
    }
});

// Endpoint to analyze user feedback
app.post('/feedback', async (req, res) => {
    const {text} = req.body;
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    try {
        const [result] = await language.analyzeSentiment({document});
        const sentiment = result.documentSentiment;
        // Decide what to do with the sentiment analysis here
        res.json({sentiment});
    } catch(error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({mensaje: "Error processing feedback"});
    }
});

// Endpoint to get food recommendations from an external API
app.post('/get-food-recommendations', async (req, res) => {
    const externalApiUrl = 'https://example.com/api/food-recommendations';
    try {
        const externalApiResponse = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        if (!externalApiResponse.ok) {
            throw new Error('Failed to fetch recommendations from the external API');
        }
        const recommendations = await externalApiResponse.json();
        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
});

// Initialize the server on the port provided by Cloud Functions
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
