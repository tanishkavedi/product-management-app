import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../models/productModel";

export const getProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const getProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const addProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, category, price, currency, stock_quantity } = req.body;
    const product = await createProduct(
      name, description, category, price, currency || "INR", stock_quantity
    );
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const editProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, category, price, stock_quantity } = req.body;
    const product = await updateProduct(
      Number(req.params.id), name, description, category, price, stock_quantity
    );
    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const removeProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await deleteProduct(Number(req.params.id));
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};