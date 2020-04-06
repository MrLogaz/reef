import sgMail from '@sendgrid/mail'
import logger from '../core/logger/app-logger'
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const controller = {}

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
const encodeChar = string => {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  })
}

controller.sendSolo = (req, res) => {
    const mailTo = req.body.email
    const from = encodeChar(req.body.from || 'Ваш друг')
    const username = encodeChar(req.body.username || 'Счастливчик')
    const value = encodeChar(req.body.value)
    const giftLink = req.body.link
    // console.log(from, username, value)
    // console.log(giftLink)

    const msg = {
      to: mailTo,
      from: 'REEF Push <no-reply@reef.mn>',
      templateId: 'd-c5cec07eb1034a76b7def9a1975aeb3c',
      dynamic_template_data: {
        subject: from + " отправил вам подарок",
        username: username,
        from: from,
        value: value,
        link: giftLink,
      }
    }

    sgMail.send(msg).then(() => {
      res.json({
        status: 'OK'
      })
    }).catch(error => {
      logger.error(error);
      res.status(500);
      res.json({
        status: 500,
        message: 'Ошибка Sendgrid'
      });
    });
}

export default controller
