const express = require('express');
const { Firestore, Timestamp } = require('@google-cloud/firestore');

// Inicializa Express y Firestore
const app = express();
const firestore = new Firestore();
app.use(express.json());

// Middleware para manejar errores de parseo JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error de parseo JSON:', err);
    return res.status(400).send({ mensaje: 'Cuerpo de solicitud inválido o mal formado.' });
  }
  next();
});

// Endpoint para obtener todas las reservas
app.get('/obtener-reservas', async (req, res) => {
    const reservasRef = firestore.collection('reservas');
    const snapshot = await reservasRef.get();

    if (snapshot.empty) {
        return res.status(404).json({ mensaje: "No se encontraron reservas." });
    }

    const reservas = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        // Convierte el Timestamp a un objeto Date y luego a un string formateado
        const fechaHora = data.datetime.toDate(); // Asegúrate de que 'datetime' es el campo correcto
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short', hour12: true };
        const fechaHoraStr = fechaHora.toLocaleString('es-MX', opciones);

        reservas.push({
            datetime: fechaHoraStr,
            name: data.name,
            invitees: data.invitees,
        });
    });

    res.status(200).json(reservas);
});

// Endpoint para crear una reserva
app.post('/crear-reserva', async (req, res) => {
    const { date, time, name, invitees } = req.body;
    // Combina 'fecha' y 'hora' para crear un objeto Date de JavaScript
    const dateTime = new Date(`${date}T${time}:00.000Z`); // Añade :00.000Z para asegurar el formato correcto

    try {
        const reservaRef = firestore.collection('reservas').doc(); // Usando un ID autogenerado
        await reservaRef.set({
            datetime: Timestamp.fromDate(dateTime), // Convierte 'dateTime' a Timestamp
            name: name,
            invitees: invitees,
        });
        res.status(200).json({ mensaje: "Reserva creada exitosamente." });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).json({ mensaje: "Error al procesar la solicitud." });
    }
});

// Manejar solicitudes GET en la ruta raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la página principal de MYRESTaurant Reservas!');
});

// Inicia el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
