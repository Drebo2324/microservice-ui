import { useState } from 'react';
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
    <div className='container mx-auto p-4 bg-gray-100'>
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      {productCreated && <p className="text-green-500 text-center">Product Created Successfully!</p>}

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-gray-700 mb-2 block">Product ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label className="text-gray-700 mb-2 block">Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-gray-700 mb-2 block">Product Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="text-gray-700 mb-2 block">Product Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;

