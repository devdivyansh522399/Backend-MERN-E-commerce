const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoutes = require('./routes/categoryRoutes');

const productRoutes = require('./routes/productRoutes')
//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();
app.use(cors());
//middelwares
app.use(express.json());
app.use(morgan("dev"));

//user routes
app.use("/api/v1/auth", authRoutes);

//category routes
app.use('/api/v1/category', categoryRoutes);

//product routes
app.use("/api/v1/product", productRoutes)

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
});
