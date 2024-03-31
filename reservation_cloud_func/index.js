const express = require('express');
const {Firestore} = require('@google-cloud/firestore');

const app = express();
app.use(express.json());
const firestore = new Firestore();

// Función para añadir una reserva a Firestore
async function crearReserva(fecha, hora, nombre, invitados) {
    const docRef = firestore.collection('reservas').doc(fecha);
    await docRef.set({
        [hora]: { nombre, invitados },
    }, { merge: true });
}

// Función para obtener reservas de una fecha específica de Firestore
async function obtenerReservas(fecha) {
    const docRef = firestore.collection('reservas').doc(fecha);
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No hay reservas para esta fecha');
        return null;
    }
    return doc.data();
}

// Endpoint para crear una reserva
app.post('/crear-reserva', async (req, res) => {
    const { fecha, hora, nombre, invitados } = req.body;

    try {
        await crearReserva(fecha, hora, nombre, invitados);
        res.status(200).json({ mensaje: "Reserva creada exitosamente." });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).json({ mensaje: "Error al procesar la solicitud." });
    }
});

// Endpoint para obtener reservas de una fecha específica
app.get('/obtener-reservas', async (req, res) => {
    const { fecha } = req.query;

    try {
        const reservas = await obtenerReservas(fecha);
        if (reservas) {
            res.status(200).json(reservas);
        } else {
            res.status(404).json({ mensaje: "No se encontraron reservas para esta fecha." });
        }
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
