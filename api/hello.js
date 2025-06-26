export default function handler(req, res) {
  const secret = process.env.MY_SECRET;
  res.status(200).json({ message: 'Hello World', secret });
}
