const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// midleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lboykcq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
      const taskcollection = client.db('taskManagement').collection('taskdata');
      app.get('/tasks', async (req, res) => {
          
          const results = await taskcollection.find().toArray()
          
          res.send(results)
      })
app.post('/tasks', async(req,res)=>{
    const tasks = req.body 

    const result = await taskcollection.insertOne(tasks)
    
      res.send(result)
    })

      app.delete('/task/:id', async (req, res) => {
          const id = req.params.id
          console.log(id);
          const qurey = { _id: new ObjectId(id) }
          const results = await taskcollection.deleteOne(qurey)
          console.log(results, "results");
          res.send(results)
      })
      app.put('/task/:id',async (req, res) => {
          const id = req.params.id
          const taskUpdate = req.body 
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updatedDoc ={
      $set:{
         title: taskUpdate.title,
        decription: taskUpdate.decription
      }
          }
          const result = await taskcollection.updateOne(filter, updatedDoc, options)
    res.send(result)
      })
      
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})