const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductContoller,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductControlller,
  updateProductContoller,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController
} = require("../controllers/productController");
const formidable = require("express-formidable");
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductContoller
);

//get poduct

router.get("/get-product", getProductController);

router.get("/get-product/:slug", getSingleProductController);

router.get("/product-photo/:pid", productPhotoController);

router.delete('/delete-product/:pid', requireSignIn ,isAdmin, deleteProductControlller); 

router.get('/api/v1/product/product-list')

router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductContoller
  );

  router.post("/product-filters", productFiltersController);

  //product count
  router.get("/product-count", productCountController);
  
  //product per page
  router.get("/product-list/:page", productListController);

  router.get('/api/v1/product/search/:keyword', searchProductController);
module.exports = router;
