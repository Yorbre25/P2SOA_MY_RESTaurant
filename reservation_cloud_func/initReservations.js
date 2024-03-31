// initializeFirestore.js

const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();

async function crearReservaInicial(fecha, hora, nombre, invitados) {
    const docRef = firestore.collection('reservas').doc(fecha);
    const reserva = {
        [hora]: { nombre, invitados }
    };

    try {
        await docRef.set(reserva, { merge: true });
        console.log(`Reserva añadida para ${fecha} a las ${hora}`);
    } catch (error) {
        console.error("Error añadiendo reserva:", error);
    }
}

async function inicializarReservas() {
    // Añade aquí las reservas que quieres pre-cargar
    await crearReservaInicial('2024-04-01', '12:00', 'Adri', 4);
    await crearReservaInicial('2024-04-01', '13:00', 'Juan', 2);
    // Añade más llamadas a crearReservaInicial según sea necesario
}

inicializarReservas();
