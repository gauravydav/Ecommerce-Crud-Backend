const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


mongoose.connect('mongodb+srv://gauravyadav:Gaurav123@cluster0.dx6o0qe.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listeners for successful and unsuccessful connections
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB. Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Close the connection when the Node.js process is terminated
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to Node.js process termination');
    process.exit(0);
  });
});

// Create a Product schema
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

// Create a Product model
const Product = mongoose.model('Product', productSchema);

// Create
app.post('/products', async (req, res) => {
  const productData = req.body;

  try {
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Read
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Update
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
