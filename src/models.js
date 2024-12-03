export class OrderDto {
    constructor(orderNumber, sku, price, quantity, userDetails) {
        this.orderNumber;
        this.sku = sku;
        this.price = price;
        this.quantity = quantity;
        this.userDetails = userDetails;
    }
}

export class UserDetails {
    constructor(email) {
        this.email = email;
    }
}