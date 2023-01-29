// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string | string[] | undefined
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // res.status(200).json({ name: 'John Doe' })
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
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
}