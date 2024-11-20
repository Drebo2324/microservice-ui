import apiClient from "./apiService";

// Product model
export const productModel = {
    id: null,
    name: '',
    description: '',
    price: 0,
};

class ProductService {
    // Fetch all products
    async getAllProducts() {
        try {
            const response = await apiClient.get('/product');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Create a new product
    async createProduct(product) {
        try {
            const response = await apiClient.post('/product', product);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Delete a product by ID
    async deleteProduct(id) {
        try {
            await apiClient.delete(`/product/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

export default new ProductService();
