import { Component, OnInit } from '@angular/core';
import { CanteenService } from 'src/canteen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  groupedCart: { [category: string]: any[] } = {}; // To group items by category
  totalPrice: number = 0;

  constructor(private canteenService: CanteenService, private router: Router) {}

  ngOnInit(): void {
    this.canteenService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.groupItemsByCategory();
      this.calculateTotalPrice();
    });
  }

  // Group cart items by category
  groupItemsByCategory(): void {
    this.groupedCart = this.cart.reduce((group, item) => {
      const category = (item.category || 'Other').trim().toLowerCase();
      if (!group[category]) {
        group[category] = [];
      }
      group[category].push(item);
  
      // Debugging: Log each item and its category
      console.log(`Item: ${item.name}, Category: ${category}`);
      
      return group;
    }, {});
  
    // Log the final grouped result
    console.log('Grouped Cart:', this.groupedCart);
  }
  

  
  calculateTotalPrice(): void {
    this.totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(item: any): void {
    this.canteenService.removeFromCart(item);
  }

  increaseQuantity(item: any): void {
    this.canteenService.addToCart(item); // Reuse addToCart to increase quantity
  }

  decreaseQuantity(item: any): void {
    this.canteenService.decreaseQuantity(item); // Decrease quantity or remove item
  }

  placeOrder(): void {
    const order = {
      userId: localStorage.getItem('username'),
      items: this.cart,
      orderDate: new Date(),
      status: 'Pending'
    };

    this.canteenService.placeOrder(order).then(() => {
      alert('Order placed successfully!');
      this.canteenService.clearCart();
      this.router.navigate(['/canteen']);
    });
  }
}
