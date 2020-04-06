import nodemailer from 'nodemailer'
import logger from '../core/logger/app-logger'

const controller = {}

const transporterData = {
  host: process.env.EMAIL_SMTP_SERVER,
  port: parseInt(process.env.EMAIL_SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_NOREPLY,
    pass: process.env.EMAIL_SMTP_PASS
  },
  logger: true,
  debug: true
}
const transporter = nodemailer.createTransport(transporterData)

controller.sendSolo = (req, res) => {

    console.log(transporterData)
    async function main() {
      
      const mailTo = req.body.email
      const username = req.body.username
      const giftLink = req.body.link

      const mailOptions = {
        from: process.env.EMAIL_SMTP_NOREPLY,
        to: mailTo,
        subject: `Подарок для ${username}`,
        text: `Получите подарок по ссылке ${giftLink}`
      }
      let info = await transporter.sendMail({
        from: '"Reef" <' + process.env.EMAIL_SMTP_NOREPLY + '>',
        to: 'mrlogaz@gmail.com',
        subject: "Hello ✔",
        text: "Hello",
        html: "<b>Hello</b>"
      });
      console.log("Message sent: %s", info.messageId);
      res.json({
        info: info
      })
    }

    main().catch(error => {
      logger.error(error)
      res.json({
        error: error
      })
    });

    
}

export default controller
