import nodemailer from 'nodemailer'
import logger from '../core/logger/app-logger'

const controller = {}

const transporterData = {
  host: process.env.EMAIL_SMTP_SERVER,
  port: process.env.EMAIL_SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SMTP_NOREPLY, // generated ethereal user
    pass: process.env.EMAIL_SMTP_PASS // generated ethereal password
  },
  secureConnection: false,
  tls: {
    rejectUnauthorized: false
  }
}
const transporter = nodemailer.createTransport(transporterData)

controller.sendSolo = (req, res) => {

    console.log(transporterData)
    console.log('-----------')
    console.log(req.body)
    console.log('//////////////')
    // transporter.verify(function(error, success) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Server is ready to take our messages");
    //   }
    // });
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
        from: '"Reef" <' + process.env.EMAIL_SMTP_NOREPLY + '>', // sender address
        to: "mrlogaz@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello", // plain text body
        html: "<b>Hello</b>" // html body
      });
      console.log("Message sent: %s", info.messageId);
      res.json({
        info: info
      })
    }

    main().catch(error => {
      res.json({
        error: error
      })
    });

    
}

export default controller
