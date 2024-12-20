import React, { useState } from 'react';
import productService from './productService';

const DeleteProduct = () => {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
        console.log("Deleting product id:", productId);
        await productService.deleteProduct(productId);
        console.log("Product deleted")
        setMessage(`Product with ID "${productId}" was successfully deleted.`);
        setProductId('');
    } catch (error) {
        console.error('Error deleting product:', error);
        setMessage(
        error.response?.data?.message || 'Failed to delete the product. Please try again.'
      );
    }
  };

  return (
    <div>
      <h2>Delete Product</h2>

      {/* Form to input product ID */}
      <form onSubmit={handleDelete}>
        <label>
          Product ID:
          <input
            type="text"
            value={productId}
            onChange={handleChange}
            placeholder="Enter product ID"
          />
        </label>
        <button type="submit">Delete Product</button>
      </form>

      {/* Display message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteProduct;
