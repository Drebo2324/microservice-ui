import apiClient from "./apiService";


class OrderService {
    async placeOrder(orderDto) {
        try {
            const response = await apiClient.post('/order', orderDto);
            return response.data;

        } catch (error) {
            if (error.response) {
                console.error(`Server responded with ${error.response.status}:`, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error placing order:', error.message);
            }
            throw error;
        }
    }
}

export default new OrderService();