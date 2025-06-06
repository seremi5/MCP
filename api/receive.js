
export default function handler(req, res) {
  console.log('Received:', req.body);
  res.status(200).json({ status: 'received', body: req.body });
}
