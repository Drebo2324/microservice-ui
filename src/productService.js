import apiClient from "./apiService";


class ProductService {
    // Fetch all products
    async getAllProducts() {
        try {
            const response = await apiClient.get('/product');
            console.log('response data: ' + response.data)
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
            await apiClient.delete('/product', id);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

export default new ProductService();
