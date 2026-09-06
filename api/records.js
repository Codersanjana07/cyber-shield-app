const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://walhabibi1007_db_user:LNOyYvEWuSn4DhGh@cluster0.i228vm0.mongodb.net/CyberHygieneDB?retryWrites=true&w=majority&appName=Cluster0";
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("CyberHygieneDB");
    const collection = db.collection("records");

    if (req.method === 'POST') {
      const record = req.body;
      record.submittedAt = new Date();
      const result = await collection.insertOne(record);
      return res.status(201).json({ success: true, insertedId: result.insertedId });
    } 
    
    if (req.method === 'GET') {
      const records = await collection.find({}).sort({ submittedAt: -1 }).toArray();
      return res.status(200).json(records);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
