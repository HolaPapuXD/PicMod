require('dotenv').config();
const express = require('express');
const path = require('path');
const { sendAdminEmail, sendUserConfirmation } = require('./src/config/email');
const app = express();
const port = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos desde la carpeta src
app.use(express.static(path.join(__dirname, 'src')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Endpoint para el formulario de contacto
app.post('/api/contact', async (req, res) => {
    console.log('Recibida solicitud de contacto:', req.body);
    
    try {
        const { name, email, subject, message } = req.body;

        // Validar que todos los campos estén presentes
        if (!name || !email || !subject || !message) {
            console.log('Campos faltantes:', { name, email, subject, message });
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los campos son requeridos' 
            });
        }

        console.log('Enviando correo al administrador...');
        // Enviar correo al administrador
        const adminEmailSent = await sendAdminEmail(email, name, subject, message);
        console.log('Resultado envío admin:', adminEmailSent);
        
        console.log('Enviando correo de confirmación al usuario...');
        // Enviar correo de confirmación al usuario
        const userEmailSent = await sendUserConfirmation(email, name);
        console.log('Resultado envío usuario:', userEmailSent);

        if (adminEmailSent && userEmailSent) {
            console.log('Correos enviados exitosamente');
            res.json({ 
                success: true, 
                message: 'Mensaje enviado correctamente' 
            });
        } else {
            throw new Error('Error al enviar los correos');
        }
    } catch (error) {
        console.error('Error detallado en el endpoint de contacto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al enviar el mensaje',
            error: error.message
        });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('EMAIL_PASSWORD configurado:', !!process.env.EMAIL_PASSWORD);
}); 