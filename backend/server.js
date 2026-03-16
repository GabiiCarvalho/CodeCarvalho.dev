const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../frontend')));


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'codecarvalho83@gmail.com',
        pass: process.env.EMAIL_PASS 
    }
});

// Rota para enviar email
app.post('/api/send-email', async (req, res) => {
    try {
        const { nome, email, whatsapp, mensagem } = req.body;

        // Validação básica
        if (!nome || !email || !whatsapp || !mensagem) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos os campos são obrigatórios' 
            });
        }

        // Configuração do email
        const mailOptions = {
            from: `"CodeCarvalho Site" <${process.env.EMAIL_USER || 'codecarvalho83@gmail.com'}>`,
            to: 'codecarvalho83@gmail.com',
            subject: `Novo contato de ${nome} - CodeCarvalho`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background: #f4f4f4; 
                            margin: 0; 
                            padding: 20px; 
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            background: white; 
                            border-radius: 15px; 
                            overflow: hidden; 
                            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
                        }
                        .header { 
                            background: linear-gradient(135deg, #a855f7, #7e22ce); 
                            color: white; 
                            padding: 30px; 
                            text-align: center; 
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 28px; 
                            font-family: 'Courier New', monospace; 
                        }
                        .header p { 
                            margin: 10px 0 0; 
                            opacity: 0.9; 
                        }
                        .content { 
                            padding: 30px; 
                        }
                        .field { 
                            margin-bottom: 25px; 
                        }
                        .label { 
                            font-weight: bold; 
                            color: #a855f7; 
                            font-size: 14px; 
                            text-transform: uppercase; 
                            letter-spacing: 1px; 
                            margin-bottom: 5px; 
                        }
                        .value { 
                            background: #f8f9fa; 
                            padding: 15px; 
                            border-radius: 8px; 
                            border-left: 4px solid #a855f7; 
                            font-size: 16px; 
                            color: #333; 
                        }
                        .footer { 
                            background: #1a1a1a; 
                            color: white; 
                            padding: 20px; 
                            text-align: center; 
                            font-size: 14px; 
                        }
                        .footer span { 
                            color: #a855f7; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📬 CodeCarvalho</h1>
                            <p>Nova mensagem do site</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">👤 Nome</div>
                                <div class="value">${nome}</div>
                            </div>
                            <div class="field">
                                <div class="label">📧 Email</div>
                                <div class="value">${email}</div>
                            </div>
                            <div class="field">
                                <div class="label">📱 WhatsApp</div>
                                <div class="value">${whatsapp}</div>
                            </div>
                            <div class="field">
                                <div class="label">💬 Mensagem</div>
                                <div class="value">${mensagem.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Mensagem enviada via <span>CodeCarvalho</span> - ${new Date().toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Nome: ${nome}
                Email: ${email}
                WhatsApp: ${whatsapp}
                Mensagem: ${mensagem}
                
                Enviado em: ${new Date().toLocaleString('pt-BR')}
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Email enviado com sucesso!' 
        });

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao enviar email. Tente novamente mais tarde.' 
        });
    }
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📧 Enviando emails para codecarvalho83@gmail.com`);
});