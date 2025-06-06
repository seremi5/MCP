export default function handler(req, res) {
  const prompt = req.body?.prompt || "No prompt received";
  console.log('Received prompt:', prompt);

  res.status(200).json({ status: 'received', prompt });
}
