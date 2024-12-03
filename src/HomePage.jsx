import { useState, useEffect } from 'react';
import ProductService from './productService';
import orderService from './orderService';
import keycloakService from './keycloakService';
import { OrderDto, UserDetails } from './models';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState('');

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

    const orderProduct = async (product, quantity) => {

        if(!keycloakService.isAuthenticated()) {
            setOrderStatus('Log in to place an order!!!');
            return;
        }

        if (!quantity || quantity <= 0) {
            setOrderStatus('Please enter a valid quantity');
            return;
        }
        
        const userDetails = new UserDetails (
            keycloakService.keycloak.profile,
        )

        const orderDto = new OrderDto(
            Math.random(),
            product.id,
            parseInt(product.price),
            quantity,
            userDetails,
        );

        console.log('orderDto object: ', orderDto);

        try {
            const response = await orderService.placeOrder(orderDto);
            setOrderStatus(`Order placed successfully for ${product.name}`);
            console.log('Order response: ', response);
        } catch (error) {
            setOrderStatus(`Failed to place order: ${error.message}`)
            console.log('Order error: ', error)
        }
    };

    const ProductCard = ({product}) => {

        const [quantity, setQuantity] = useState(1);

        return (
            <li>
                <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <div>
                        <label>
                            Quantity: 
                            <input 
                                type='number' 
                                min='1' 
                                value={quantity} 
                                onChange={(e) => 
                                    setQuantity(e.target.value)} 
                            />
                        </label>
                    </div>
                </ div>
                <button
                    onClick={() => 
                    orderProduct(product, quantity)}>
                        Order
                </button>
            </li>
        )
    };

    if (loading) {
        return <div>Loading products...</div>;  // Show loading text while fetching
    }

    return (
        <div>
            <h1>Product List</h1>
            {orderStatus && <p>{orderStatus}</p>}
            <div>
                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <ul>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


export default HomePage;
