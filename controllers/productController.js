const productModel = require("../models/productModel");
const fs = require("fs");
const slugify = require("slugify");
const { findByIdAndUpdate } = require("../models/userModel");
const createProductContoller = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(10)
      .sort({ creataAt: -1 });
    res.status(200).send({
      success: true,
      length: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product Fetched",
      product,
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting Single product",
    });
  }
};

const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {

    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product photo",
    });
  }
};

const deleteProductControlller = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    return res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product photo",
    });
  }
};

const updateProductContoller = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating  product",
    });
  }
};

const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

module.exports = {
  createProductContoller,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductControlller,
  updateProductContoller,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
};
