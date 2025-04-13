// pages/api/enviar.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email, celular, tipo_servico, mensagem } = req.body;

  if (!nome || !email || !mensagem || !tipo_servico) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.seuhost.com', // Ex: smtp.hostinger.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Site Impulso Digital" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Novo orçamento: ${tipo_servico}`,
      text: `
        Nome: ${nome}
        E-mail: ${email}
        Celular: ${celular}
        Tipo de serviço: ${tipo_servico}
        Mensagem: ${mensagem}
      `
    });

    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail.' });
  }
}
