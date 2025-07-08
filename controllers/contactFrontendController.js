import { sendContactMessage } from "../utils/emailTemplate.js";

export const frontendCOntact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "All fields are required." });

  try {
    await sendContactMessage({ name, email, message });
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};