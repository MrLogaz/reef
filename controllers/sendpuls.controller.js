import sendpulse from "sendpulse-api"
import logger from '../core/logger/app-logger'
/*
 * https://login.sendpulse.com/settings/#api
 */

const controller = {};
var API_USER_ID = process.env.SENDPULS_ID;
var API_SECRET = process.env.SENDPULS_SECRET;
var TOKEN_STORAGE = "/tmp/";

controller.sendSolo = (req, res) => {
    const mailTo = req.body.email
    const from = req.body.from || "Ваш друг"
    const username = req.body.username || "Lucky"
    const giftLink = req.body.link

    let email = {
      "html" : "<h1>" + from + " отправил вам подарок</h1>Открой подарок <a href='" + giftLink + "'>по ссылке</a>",
      "text" : "Example text",
      "subject" : from + " отправил вам подарок",
      "from" : {
        "name" : "Reef Push",
        "email" : process.env.EMAIL_SMTP_NOREPLY
      },
      "to" : [
        {
          "name" : username,
          "email" : mailTo
        },
      ]
    }
    const answerGetter = data => {
      console.log(data);
      logger.info('SendPuls - ' + data.message);
        res.json({
          data: data
        })
    }
    sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
      if (token && token.is_error) {
        // error handling
      }

      console.log('your token: ' + token)

      sendpulse.smtpSendMail(answerGetter, email)
    });
}

export default controller
