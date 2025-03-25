const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'picmod2025@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// Template HTML común para los correos
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #3b82f6;
        }
        .logo-container {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 15px;
        }
        .logo {
            width: 150px;
            height: auto;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            background: #ffffff;
            padding: 40px 30px;
            color: #1a1a1a;
        }
        .message-box {
            background: #f8f9fa;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }
        .feature-item {
            background: rgba(59, 130, 246, 0.05);
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            transition: transform 0.2s;
        }
        .feature-item:hover {
            transform: translateX(5px);
        }
        .emoji {
            font-size: 24px;
            margin-right: 15px;
            min-width: 30px;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: transform 0.2s;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #1a1a1a;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-link {
            color: white;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 500;
        }
        .highlight {
            color: #3b82f6;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://picmod.vercel.app/img/logo.png" alt="PicMod Logo" class="logo">
            </div>
            <h1>PicMod</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© 2024 PicMod. Todos los derechos reservados.</p>
            <div class="social-links">
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Instagram</a>
                <a href="#" class="social-link">GitHub</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Función para enviar correo al administrador
const sendAdminEmail = async (userEmail, name, subject, message) => {
    try {
        const content = `
            <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                Nuevo Mensaje de Contacto
            </h2>
            <div class="message-box">
                <p><strong class="highlight">Nombre:</strong> ${name}</p>
                <p><strong class="highlight">Email:</strong> ${userEmail}</p>
                <p><strong class="highlight">Asunto:</strong> ${subject}</p>
                <p><strong class="highlight">Mensaje:</strong></p>
                <p style="white-space: pre-wrap; margin-top: 10px; padding: 15px; background: rgba(59, 130, 246, 0.05); border-radius: 6px;">
                    ${message}
                </p>
            </div>
            <div style="text-align: center;">
                <a href="mailto:${userEmail}" class="button">
                    Responder al Usuario
                </a>
            </div>
        `;

        const mailOptions = {
            from: 'PicMod <picmod2025@gmail.com>',
            to: 'picmod2025@gmail.com',
            subject: `📬 Nuevo mensaje de contacto: ${subject}`,
            html: emailTemplate(content)
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar correo al administrador:', error);
        return false;
    }
};

// Función para enviar correo de confirmación al usuario
const sendUserConfirmation = async (userEmail, name) => {
    try {
        const content = `
            <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 25px; text-align: center;">
                ¡Hola <span class="highlight">${name}</span>!
            </h2>
            <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px; text-align: center;">
                Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.
            </p>
            <div style="background: rgba(59, 130, 246, 0.05); padding: 25px; border-radius: 12px; margin: 30px 0;">
                <h3 style="color: #2563eb; margin-bottom: 20px; text-align: center;">
                    Descubre Nuestras Herramientas
                </h3>
                <ul class="feature-list">
                    <li class="feature-item">
                        <span class="emoji">🎨</span>
                        <span>Colorización inteligente de imágenes en blanco y negro</span>
                    </li>
                    <li class="feature-item">
                        <span class="emoji">📏</span>
                        <span>Redimensionamiento preciso manteniendo la calidad</span>
                    </li>
                    <li class="feature-item">
                        <span class="emoji">✨</span>
                        <span>Mejora automática de calidad y nitidez</span>
                    </li>
                    <li class="feature-item">
                        <span class="emoji">🎯</span>
                        <span>Extracción de paleta de colores dominantes</span>
                    </li>
                </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://picmod.vercel.app" class="button">
                    Explorar PicMod Ahora
                </a>
            </div>
        `;

        const mailOptions = {
            from: 'PicMod <picmod2025@gmail.com>',
            to: userEmail,
            subject: '✨ Gracias por contactar con PicMod',
            html: emailTemplate(content)
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de confirmación:', error);
        return false;
    }
};

module.exports = {
    sendAdminEmail,
    sendUserConfirmation
}; 