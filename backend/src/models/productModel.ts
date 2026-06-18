import pool from "../config/db";

export const getAllProducts = async () => {
  const result = await pool.query(`
    SELECT p.id, p.name, p.description, p.category,
           pr.price, pr.currency,
           i.stock_quantity
    FROM products p
    LEFT JOIN pricing pr ON pr.product_id = p.id
    LEFT JOIN inventory i ON i.product_id = p.id
    ORDER BY p.created_at DESC
  `);
  return result.rows;
};

export const getProductById = async (id: number) => {
  const result = await pool.query(`
    SELECT p.id, p.name, p.description, p.category,
           pr.price, pr.currency,
           i.stock_quantity
    FROM products p
    LEFT JOIN pricing pr ON pr.product_id = p.id
    LEFT JOIN inventory i ON i.product_id = p.id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0] || null;
};

export const createProduct = async (
  name: string,
  description: string,
  category: string,
  price: number,
  currency: string,
  stock_quantity: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      `INSERT INTO products (name, description, category)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, category]
    );
    const product = productResult.rows[0];

    await client.query(
      `INSERT INTO pricing (product_id, price, currency)
       VALUES ($1, $2, $3)`,
      [product.id, price, currency]
    );

    await client.query(
      `INSERT INTO inventory (product_id, stock_quantity)
       VALUES ($1, $2)`,
      [product.id, stock_quantity]
    );

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updateProduct = async (
  id: number,
  name: string,
  description: string,
  category: string,
  price: number,
  stock_quantity: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE products SET name=$1, description=$2, category=$3 WHERE id=$4`,
      [name, description, category, id]
    );

    await client.query(
      `UPDATE pricing SET price=$1 WHERE product_id=$2`,
      [price, id]
    );

    await client.query(
      `UPDATE inventory SET stock_quantity=$1 WHERE product_id=$2`,
      [stock_quantity, id]
    );

    await client.query("COMMIT");
    return await getProductById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteProduct = async (id: number) => {
  await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
};