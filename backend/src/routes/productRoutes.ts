import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct
} from "../controllers/productController";

const router = Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.post("/", protect, addProduct);
router.put("/:id", protect, editProduct);
router.delete("/:id", protect, removeProduct);

export default router;