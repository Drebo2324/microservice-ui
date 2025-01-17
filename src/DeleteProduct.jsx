import { useState } from 'react';
import productService from './productService';

const DeleteProduct = ({updateProductList}) => {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
        await productService.deleteProduct(productId);
        console.log("Deleted product id:", productId);
        setMessage(`Product with ID:"${productId}" was deleted.`);
        setProductId('');
        updateProductList();
    } catch (error) {
        console.error('Error deleting product:', error);
        setMessage(
        error.response?.data?.message || 'Failed to delete the product.'
      );
    }
  };

  return (
    <div className='container mx-auto p-4 bg-gray-100'>
      <h2 className="text-2xl font-bold mb-4">Delete Product</h2>

      {message && <p className="text-red-500 text-center">{message}</p>}
      
      <form className="flex flex-col" onSubmit={handleDelete}>
        <div className='mb-4'>
          <label className="text-gray-700 mb-2 block">
            Product ID:
          </label>
            <input
              type="text"
              value={productId}
              onChange={handleChange}
              placeholder="Enter product ID"
            />
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        type="submit">
          Delete Product
        </button>
      </form>
    </div>
  );
};

export default DeleteProduct;
