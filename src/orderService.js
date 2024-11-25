import apiClient from "./apiService";


class OrderService {
    async placeOrder() {
        try {
            const response = await apiClient.post('/order');
            return response.data;

        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }
}

export default new OrderService();