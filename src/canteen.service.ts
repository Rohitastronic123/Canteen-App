import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanteenService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private firestore: AngularFirestore) {}

  // Add an item to the cart
  addToCart(item: any): void {
    const currentCart = this.cartSubject.getValue();
    const existingItem = currentCart.find(cartItem => cartItem.category === item.category);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 }); 
    }
    this.cartSubject.next(currentCart);
  }

  // Remove an item from the cart
  removeFromCart(item: any): void {
    const currentCart = this.cartSubject.getValue();
    const updatedCart = currentCart.filter(cartItem => cartItem.id !== item.id);
    this.cartSubject.next(updatedCart);
  }

  // Decrease quantity or remove item if quantity is 1
  decreaseQuantity(item: any): void {
    const currentCart = this.cartSubject.getValue();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      this.removeFromCart(item); // Remove item if quantity reaches 0
    }
    this.cartSubject.next(currentCart);
  }

  // Get cart items
  getCartItems(): any[] {
    return this.cartSubject.getValue();
  }

  // Clear the cart
  clearCart(): void {
    this.cartSubject.next([]);
  }

  // Fetch items from Firebase
  getItems(): Observable<any[]> {
    return this.firestore.collection('items').valueChanges();
  }

  getOrders(userId: string): Observable<any[]> {
    return this.firestore.collection('orders', ref => ref.where('userId', '==', userId)).valueChanges();
  }
  // Place an order
  placeOrder(order: any): Promise<any> {
    const orderItems = order.items.map(item => ({
      category: item.category || "Unknown", 
      quantity: item.quantity || 0 
    })) || []; 
  
    const user = {
      username: order.userId || "Anonymous", 
      employeeCode: "No data" 
    };
  
    const timestamp = new Date().toISOString(); 
  
    const orderData = {
      orderItems,
      status: 'Pending', 
      timestamp, 
      user
    };
  
    return this.firestore.collection('orders').add(orderData);
  }
  
}
