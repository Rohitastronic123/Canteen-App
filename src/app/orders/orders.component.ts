import { Component, OnInit } from '@angular/core';
import { CanteenService } from 'src/canteen.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  userId: string = localStorage.getItem('username') || '';

  constructor(private canteenService: CanteenService, private firestore: AngularFirestore, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // ngOnInit(): void {
  //   this.fetchOrders();
  // }

  // fetchOrders(): void {
  //   this.canteenService.getOrders(this.userId).subscribe((data) => {
  //     this.orders = data.map(order => {
  //       // Convert the Firestore Timestamp to a Date object
  //       order.orderDate = order.orderDate instanceof Timestamp ? order.orderDate.toDate() : order.orderDate;
  //       return order;
  //     });
  //   });
  // }
}
