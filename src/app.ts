import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const options: SMTPTransport['options'] = {
  host: process.env.HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}

app.use(express.json())

app.get('/send-email', (req: Request, res: Response) => {
  return res.send({
    message: 'Hola mundo!'
  })
})

app.post('/send-email', (req: Request, res: Response) => {
  const { name, company, subject, email, message } = req.body

  const transporter = nodemailer.createTransport(options)

  const mailOptions = {
    from: name,
    to: 'lnahuelfernandezb@gmail.com',
    subject: subject,
    html: `
      <h1>Datos: </h1>
        <ul>
          <li>
          <bold>Nombre:</bold> ${name}
          </li>
          <li>
            <bold>Empresa:</bold> ${company}
          </li>
          <li>
            <bold>Email:</bold> ${email || 'No ha sido ingresado'}
          </li>
        </ul>
      <h2>Mensaje:</h2>
        ${message}
      `
  }

  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) {
      return res
        .status(500)
        .send(error.message)
    }
    console.log('Email enviado!')
    return res
      .status(200)
      .json(req.body)
  })

  transporter.close()
  return res.status(201)
})

app.listen(port, () => {
  console.log(`Server running at Port: ${port}`);
})
