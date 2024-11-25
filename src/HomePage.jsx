import { useState, useEffect } from 'react';
import ProductService from './productService';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const fetchedProducts = await ProductService.getAllProducts();
                console.log('fetched products: ', fetchedProducts)
                setProducts(fetchedProducts.productListDto || []);
            } catch (error) {
                console.error('Failed to load products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;  // Show loading text while fetching
    }

    return (
        <div>
            <h1>Product List</h1>
            <div>
                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <strong>{product.name}</strong>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};



    

export default HomePage;
