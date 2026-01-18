const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//Express configuration
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = 3000

const app = express();
app.use(cors())

//this function is used to catch data from the body
app.use(express.json());

//MongoDB configuration



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv2lthx.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // await client.connect();

    //to create database
    const database = client.db('petService');
    //to create collection under the database
    const petServices = database.collection('services')
    //order collection
    const orderCollections = database.collection('orders')

    //to create collection(post or save service to database)
    app.post('/services', async (req, res) => {
      //receive
      const data = req.body;

      //for live time 
      const date = new Date();
      data.createdAt = date;

      console.log(data);
      //for sending data into database
      const result = await petServices.insertOne(data)
      //for showing result in frontend
      res.send(result)

    })


    //Get Services from DB
    app.get('/services', async (req, res) => {
      const { category } = req.query
      console.log(category);

      const query = {}
      if (category) {
        query.category = category.toLowerCase();
        // const query = {category: category}
      }
      const result = await petServices.find(query).toArray();
      res.send(result)
    })

    //to get one single data from frontend
    app.get('/services/:id', async (req, res) => {
      const id = req.params
      console.log(id)

      //query for matching id between frontend and database
      const query = { _id: new ObjectId(id) }
      //matching the id from the collection
      const result = await petServices.findOne(query)
      res.send(result)
    })


    //to show particular email holder services
    app.get('/my-services', async (req, res) => {
      const { email } = req.query
      console.log(email);
      const query = { email: email }
      const result = await petServices.find(query).toArray()
      res.send(result)
    })

    //for update one operation 
    app.put('/update/:id', async (req, res) => {
      const data = req.body
      const id = req.params
      const query = { _id: new ObjectId(id) }

      const updateServices = {
        $set: data
      }

      const result = await petServices.updateOne(query, updateServices)
      res.send(result)


    })

    //for delete one operation 
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params
      const query = { _id: new ObjectId(id) }
      const result = await petServices.deleteOne(query)
      res.send(result)

    })


    app.post('/orders', async (req, res) => {
      const data = req.body
      console.log(data)

      const result = await orderCollections.insertOne(data)
      //to get the acknowledgement in the frontend
      res.status(201).send(result)
    })


    //to get the order list
    app.get('/orders', async (req, res) => {
      
      const { email } = req.query
      console.log(email);
      
      let query = {}
      if (email) {
        query = { buyerEmail: email }
      }
      
      const result = await orderCollections.find(query).toArray()
      res.status(200).send(result)
    })










    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Hello Developers I am Junaid")
})

app.listen(port, () => {
  console.log(`server is running on ${port}`)
})