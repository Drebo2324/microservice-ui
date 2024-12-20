import React, { useState } from 'react';
import productService from './productService';

function AddProduct() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
  });

  const [productCreated, setProductCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form (simple check for empty fields)
    if (!formData.id || !formData.name || !formData.description || !formData.price) {
      alert('All fields are required!');
      return;
    }

    try {
      await productService.createProduct(formData)
      console.log('Product created:', formData);
      setProductCreated(true);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    

    // Reset form
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
    });
  };

  return (
    <div>
      <h2>Add Product</h2>

      {productCreated && <p>Product Created Successfully!</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

