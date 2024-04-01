const express = require('express');
const { Firestore, Timestamp } = require('@google-cloud/firestore');
const moment = require('moment-timezone');

const app = express();
const firestore = new Firestore();
app.use(express.json());

const TOTAL_TABLES = 4;
const OPEN_HOUR = 9; // 9 AM in 24-hour format
const CLOSE_HOUR = 21; // 9 PM in 24-hour format

app.post('/create-reservation', async (req, res) => {
    const { date, time, name, invitees } = req.body; // Expecting date & time as strings, e.g., date: "2024-03-31", time: "13:00"

    // Convertir la hora proporcionada a la zona horaria UTC-6
    const dateTimeInUTC6 = moment.tz(`${date}T${time}:00`, 'America/Belize');

    // Validar que la reservación está dentro del horario de operaciones
    const reservationHour = dateTimeInUTC6.hour();
    if (reservationHour < OPEN_HOUR || reservationHour >= CLOSE_HOUR || !(dateTimeInUTC6.minutes() === 0 || dateTimeInUTC6.minutes() === 30)) {
        return res.status(400).json({ message: "Reservations can only be made from 9 AM to 9 PM, on the hour or half past in UTC-6." });
    }

    // Preparar los Timestamps para Firestore
    const reservationStart = Timestamp.fromDate(dateTimeInUTC6.toDate());
    const reservationEnd = Timestamp.fromDate(dateTimeInUTC6.add(1, 'hours').toDate());

    try {
        const availableTables = await checkTableAvailability(reservationStart, reservationEnd);
        if (availableTables.length === 0) {
            return res.status(400).json({ message: "No tables available for this date and time." });
        }

        const assignedTable = availableTables[0];
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

        // Convertir y formatear las fechas a UTC-6
        const startStr = moment(start).tz('Etc/GMT+6').format('MMMM D, YYYY [at] h:mm:ss A [UTC-6]');
        const endStr = moment(end).tz('Etc/GMT+6').format('MMMM D, YYYY [at] h:mm:ss A [UTC-6]');

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


app.get('/recommend-reservation-time', async (req, res) => {
    const { mealType, date } = req.query; // mealType: 'brunch', 'lunch', 'merienda', 'dinner'; date: 'YYYY-MM-DD'

    // Define hour ranges for each meal type
    const mealRanges = {
        brunch: { start: 9, end: 11 }, // 9 AM - 11 AM
        lunch: { start: 12, end: 14 }, // 12 PM - 2 PM
        coffee: { start: 15, end: 17 }, // 3 PM - 5 PM
        dinner: { start: 18, end: 20 } // 6 PM - 8 PM
    };

    const range = mealRanges[mealType];
    if (!range) {
        return res.status(400).json({ message: "Invalid meal type. Choose 'brunch', 'lunch', 'coffee', or 'dinner'." });
    }

    try {
        // Convert start and end of the meal range to Timestamps
        const dayStart = new Date(`${date}T${range.start}:00:00.000Z`);
        const dayEnd = new Date(`${date}T${range.end}:59:59.999Z`);
        const reservationsSnapshot = await firestore.collection('reservations')
            .where('reservationStart', '>=', Timestamp.fromDate(dayStart))
            .where('reservationStart', '<=', Timestamp.fromDate(dayEnd))
            .get();

        // Calculate availability for each hour within the meal range
        let hourlyAvailability = {};
        for (let hour = range.start; hour <= range.end; hour++) {
            hourlyAvailability[hour] = 0; // Initialize reservation count per hour
        }

        reservationsSnapshot.forEach(doc => {
            const reservationHour = doc.data().reservationStart.toDate().getUTCHours();
            hourlyAvailability[reservationHour]++;
        });

        // Find the hour with the fewest reservations
        const bestHour = Object.entries(hourlyAvailability)
            .sort((a, b) => a[1] - b[1]) // Sort by fewest number of reservations
            .map(entry => entry[0])[0]; // Take the first one

        if (bestHour !== undefined) {
            res.status(200).json({
                message: "Recommended hour for your reservation:",
                bestHour: `${bestHour}:00`
            });
        } else {
            res.status(400).json({ message: "No available hours found within the selected range." });
        }
    } catch (error) {
        console.error("Error recommending reservation time:", error);
        res.status(500).json({ message: "Error processing request." });
    }
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
