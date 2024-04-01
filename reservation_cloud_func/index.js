const express = require('express');
const { Firestore, Timestamp } = require('@google-cloud/firestore');

const app = express();
const firestore = new Firestore();
app.use(express.json());

const TOTAL_TABLES = 4;
const OPEN_HOUR = 9; // 9 AM in 24-hour format
const CLOSE_HOUR = 21; // 9 PM in 24-hour format

app.post('/create-reservation', async (req, res) => {
    const { date, time, name, invitees } = req.body;

    // Combine date and time and create a JavaScript Date object
    const dateTime = new Date(`${date}T${time}:00.000Z`);
    const reservationHour = dateTime.getUTCHours();

    // Check if the reservation time is within operational hours
    if (reservationHour < OPEN_HOUR || reservationHour >= CLOSE_HOUR || !(dateTime.getMinutes() === 0 || dateTime.getMinutes() === 30)) {
        return res.status(400).json({ message: "Reservations can only be made from 9 AM to 9 PM, on the hour or half past." });
    }

    // Define the start and end time of the reservation
    const reservationStart = Timestamp.fromDate(dateTime);
    const reservationEnd = Timestamp.fromDate(new Date(dateTime.getTime() + 60 * 60 * 1000)); // Plus 1 hour

    // Check for table availability
    try {
        const availableTables = await checkTableAvailability(reservationStart, reservationEnd);

        if (availableTables.length === 0) {
            return res.status(400).json({ message: "No tables available for this date and time." });
        }

        // Assign the first available table
        const assignedTable = availableTables[0];

        // Create the reservation with the assigned table
        await firestore.collection('reservations').add({
            reservationStart,
            reservationEnd,
            name,
            invitees,
            table: assignedTable
        });

        res.status(200).json({ message: "Reservation successfully created with table #" + assignedTable });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Error processing request." });
    }
});

async function checkTableAvailability(start, end) {
    const snapshot = await firestore.collection('reservations')
        .where('reservationEnd', '>', start)
        .where('reservationStart', '<', end)
        .get();

    const occupiedTables = snapshot.docs.map(doc => doc.data().table);
    const availableTables = [];

    for (let i = 1; i <= TOTAL_TABLES; i++) {
        if (!occupiedTables.includes(i)) {
            availableTables.push(i);
        }
    }

    return availableTables;
}

// GET endpoint to list all reservations
app.get('/get-reservations', async (req, res) => {
    const reservationsRef = firestore.collection('reservations');
    const snapshot = await reservationsRef.get();

    if (snapshot.empty) {
        return res.status(404).json({ message: "No reservations found." });
    }

    const reservations = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        const start = data.reservationStart.toDate();
        const end = data.reservationEnd.toDate();

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short', hour12: true };
        const startStr = start.toLocaleString('en-US', options);
        const endStr = end.toLocaleString('en-US', options);

        reservations.push({
            start: startStr,
            end: endStr,
            name: data.name,
            invitees: data.invitees,
            table: data.table
        });
    });

    res.status(200).json(reservations);
});

// Root GET request handler
app.get('/', (req, res) => {
    res.send('Welcome to the MYRESTaurant Reservation System!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
