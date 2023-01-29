// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
  name: string | string[] | undefined
}

const token = process.env.NEXT_WHATSAPP_TOKEN;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // res.status(200).json({ name: 'John Doe' })
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/

   if (req.method === "GET") {
    const verify_token = process.env.NEXT_VERIFY_TOKEN;

    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.status(403);
      }
    }
   } else if (req.method == "POST") {
      let body = req.body;

      // Check the Incoming webhook message
      console.log(JSON.stringify(req.body, null, 2));

      // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
      if (req.body.object) {
        if (
          req.body.entry &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value.messages &&
          req.body.entry[0].changes[0].value.messages[0]
        ) {
          let phone_number_id =
            req.body.entry[0].changes[0].value.metadata.phone_number_id;
          let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
          let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
          axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v12.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: { body: "Ack: " + msg_body },
            },
            headers: { "Content-Type": "application/json" },
          });
        }
        res.send(200);
      } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.send(404);
      }
   }
   
}