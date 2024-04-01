const express = require('express');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
app.use(express.json());

const firestore = new Firestore();

// Middleware para manejar errores de parseo JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error de parseo JSON:', err);
    return res.status(400).send({ mensaje: 'Cuerpo de solicitud inválido o mal formado.' });
  }
  next();
});

// Función para añadir una reserva a Firestore
async function crearReserva({ fecha, hora, nombre, invitados }) {
  try {
    const reservaId = `${fecha}:${hora}`; // Generar un ID único basado en fecha y hora
    const reservaRef = firestore.collection('reservas').doc(reservaId);
    const doc = await reservaRef.get();

    if (doc.exists) {
      // Manejar el caso de que ya exista una reserva en esa fecha y hora
      return { error: true, mensaje: "Ya existe una reserva en esta fecha y hora." };
    } else {
      await reservaRef.set({ fecha, hora, nombre, invitados });
      return { error: false, mensaje: "Reserva creada exitosamente." };
    }
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return { error: true, mensaje: "Error al procesar la solicitud." };
  }
}

// Función para obtener reservas de una fecha específica de Firestore
async function obtenerReservasPorFecha(fecha) {
  const reservasRef = firestore.collection('reservas');
  const snapshot = await reservasRef.where('fecha', '==', fecha).get();

  if (snapshot.empty) {
    return null;
  }

  const reservas = [];
  snapshot.forEach(doc => {
    reservas.push(doc.data());
  });

  return reservas;
}

// Endpoint para crear una reserva
app.post('/crear-reserva', async (req, res) => {
  const resultado = await crearReserva(req.body);
  if (resultado.error) {
    res.status(500).json({ mensaje: resultado.mensaje });
  } else {
    res.status(200).json({ mensaje: resultado.mensaje });
  }
});

// Endpoint para obtener reservas de una fecha específica
app.get('/obtener-reservas', async (req, res) => {
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).send({ mensaje: 'Debe proporcionar una fecha.' });
  }

  const reservas = await obtenerReservasPorFecha(fecha);
  if (reservas) {
    res.status(200).json(reservas);
  } else {
    res.status(404).json({ mensaje: "No se encontraron reservas para esta fecha." });
  }
});

// Manejar solicitudes GET en la ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal de MYRESTaurant Reservas!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
