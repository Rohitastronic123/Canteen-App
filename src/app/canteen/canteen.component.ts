import { Component, HostListener, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/auth.service";
import { CanteenService } from "src/canteen.service";

// CanteenComponent (Updated)
@Component({
  selector: 'app-canteen',
  templateUrl: './canteen.component.html',
  styleUrls: ['./canteen.component.scss']
})
export class CanteenComponent implements OnInit {
  items: any[] = [];
  categories: string[] = ['Breakfast', 'Lunch', 'Snacks'];
  selectedCategory: string = 'Breakfast';
  isMobile: boolean;
  order: any[] = [];
  orderMessage: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 600;
  }

  constructor(private canteenService: CanteenService, private authService: AuthService,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 600;
    this.canteenService.getItems().subscribe((data) => {
      this.items = data.map(item => ({ ...item, quantity: 1 })); // Initialize quantity to 0
    });
  }

  getFilteredItems(): any[] {
    return this.items.filter(item => item.category === this.selectedCategory);
  }

  increaseQuantity(item: any): void {
    item.quantity = (item.quantity || 0) + 1;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 0) {
      item.quantity -= 1;
    }
  }

  addToOrder(item: any): void {
    if (item.quantity && item.quantity > 0) {
      const existingItem = this.order.find(orderItem => orderItem.category === item.category);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.order.push({ ...item });
      }
      this.orderMessage = `${item.category} added with quantity ${item.quantity}`;
      item.quantity = 1; // Reset item quantity after adding to order
      setTimeout(() => this.orderMessage = '', 3000); // Clear message after 3 seconds
    } else {
      alert('Please increase the quantity before adding to the order.');
    }
  }

  placeOrder(): void {
    if (this.order.length > 0) {
      const order = {
        userId: localStorage.getItem('username'),
        items: this.order,
        orderDate: new Date(),
        status: 'Pending'
      };

      this.canteenService.placeOrder(order).then(() => {
        // alert('Order placed successfully!');
        this.snackBar.open(`Order placed successfully! `, 'Close', {
          duration: 3000, 
          panelClass: ['success-snackbar'],  
        });
        this.order = []; // Clear the order after placing it
      }).catch(error => {
        this.snackBar.open('Error while place order. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],  
        });
        console.error("Error placing order: ", error);
      });
    } else {
      alert('Your order is empty. Please add items to place an order.');
    }
  }

  logout() {
    localStorage.removeItem('username');
    this.authService.router.navigate(['/login']);
  }
}