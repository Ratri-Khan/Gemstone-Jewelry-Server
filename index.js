const express = require('express')
const app = express()
var cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.pluunuw.mongodb.net/?retryWrites=true&w=majority`;

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
        //Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const jewelryCollection = client.db("jewelryDB").collection("jewelry");
    const jewelryCategories = client.db('jewelryDB').collection('jewelryCategories');

        app.post('/jewelry', async (req, res) => {
            const newJewelry = req.body;
            console.log(newJewelry);
            const result = await jewelryCollection.insertOne(newJewelry);
            res.send(result);
        });
        app.get('/jewelry', async (req, res) => {
            const cursor = jewelryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //*************************************
        app.post('/categories', async (req, res) => {
            const category = req.body;
            console.log(category);
            const result = await jewelryCategories.insertOne(category);
            res.send(result);
        });
        app.get('/categories', async (req, res) => {
                console.log(req.query.subCategory);
                let query = {};
                if (req.query?.subCategory) {
                    query = { subCategory: req.query.subCategory }
                }
                const result = await jewelryCollection.find(query).toArray();
                res.send(result);
              })
    



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})