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
            keycloakService.getUserEmail()
        );

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
            <li className='bg-gray-100 rounded-lg shadow-md p-4'>
                <div>
                    <h3 className='text-xl font-bold mb-2'>{product.name}</h3>
                    <p className='text-gray-700 mb-2'>{product.description}</p>
                    <p className='text-gray-500 font-bold mb-2'>Price: ${product.price}</p>
                    <div className='flex items-center mr-2'>
                        <label className='text-gray-700 mr-2'>
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
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-offset-2 focus:ring-blue-700'
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
            <h1 className="text-3xl font-bold">Product List</h1>
            {orderStatus && <p className='text-2xl font-bold text-center'>{orderStatus}</p>}
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
