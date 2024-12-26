import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-canteendashboard',
  templateUrl: './canteendashboard.component.html',
  styleUrls: ['./canteendashboard.component.scss']
})
export class CanteendashboardComponent implements OnInit {
  orders: any[] = [];
  selectedCategoryOrders: any[] = [];
  totalOrders: number = 0;
  pageSize: number = 10;
  orderCounts = { breakfast: 0, lunch: 0, snacks: 0 };
  showDetails = false;
  selectedCategory = '';
  displayedColumns: string[] = ['customerName', 'itemName', 'quantity', 'timestamp','status'];
  availableStatuses: string[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  previewUrl: string | ArrayBuffer | null = null;
  loading: boolean = true; 
  showAddItemForm: boolean = false;
  newItem: any = { category: '', description: '', image: null };
  constructor(private firestore: AngularFirestore,private snackBar: MatSnackBar) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
@ViewChild(MatSort, { static: false }) sort: MatSort;
dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    
    const pendingOrders = this.firestore.collection('orders', ref => ref.where('status', '==', 'Pending')).valueChanges({ idField: 'id' });
    
    const inProgressOrders = this.firestore.collection('orders', ref => ref.where('status', '==', 'In Progress')).valueChanges({ idField: 'id' });
  
    pendingOrders.subscribe((pendingOrdersData: any[]) => {
      inProgressOrders.subscribe((inProgressOrdersData: any[]) => {
        const allOrders = [...pendingOrdersData, ...inProgressOrdersData];
       
        this.orders = allOrders.map(order => ({
          ...order,
          orderItems: Array.isArray(order.orderItems) ? order.orderItems : [], 
          user: order.user || {}, 
        }));
        
        this.loading = false;
        this.categorizeOrders();
        console.log(this.orders);
      });
    });
  }
  

  categorizeOrders() {
    this.orderCounts = { breakfast: 0, lunch: 0, snacks: 0 };

    this.orders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          if (item.category === 'Breakfast') {
            this.orderCounts.breakfast++;
          } else if (item.category === 'Lunch') {
            this.orderCounts.lunch++;
          } else if (item.category === 'Snacks') {
            this.orderCounts.snacks++;
          }
        });
      }
    });
  }

  showOrderDetails(category: string) {
    this.selectedCategoryOrders = this.orders.filter(order =>
      order.orderItems && order.orderItems.some((item: any) => item.category === category)
    );
    this.selectedCategory = category;
    this.dataSource = new MatTableDataSource(this.selectedCategoryOrders);
    this.totalOrders = this.selectedCategoryOrders.length;
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.totalOrders)
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCategory = '';
    this.selectedCategoryOrders = [];
  }
  updateStatus(order: any) {
    if (!order.id) {
      console.error('Order ID is undefined. Cannot update status.');
      return;
    }
  
    this.firestore.collection('orders').doc(order.id).update({ status: order.status })
      .then(() => {
        console.log(`Order status updated to ${order.status}`);
        this.snackBar.open(`Order status updated to ${order.status}`, 'Close', {
          duration: 3000, 
          panelClass: ['success-snackbar'],  
        });
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        this.snackBar.open('Error updating order status. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],  
        });
      });
  }
  openAddItemDialog() {
    this.showAddItemForm = true;
  }
  closeAddItemForm() {
    this.showAddItemForm = false;
    this.newItem = {
      category: '',
      description: '',
      image: null,
    };
  
    // Clear the image preview
    this.previewUrl = null;
  
  }
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/jfif']; // Allowed image types
  
      // Validate the file type
      if (!allowedTypes.includes(file.type)) {
        console.error('Unsupported file type!');
        return; // Exit if the file type is not supported
      }
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const readerTarget = e.target as FileReader;
  
        // Create an image object to load the base64 data
        const img = new Image();
        img.onload = () => {
          // Create a canvas for resizing the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Canvas context not available');
            return;
          }
  
          const maxWidth = 800; // Maximum width for resized image
          const maxHeight = 800; // Maximum height for resized image
          let width = img.width;
          let height = img.height;
  
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          // Resize the image on the canvas
          canvas.width = width;
          canvas.height = height;
          ctx.imageSmoothingEnabled = true; // Enable smoothing
          ctx.imageSmoothingQuality = 'high'; // High-quality smoothing
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert the resized image to a base64 string
          const resizedBase64 = canvas.toDataURL(file.type, 1.0); // High-quality base64 output
  
          // Update the preview URL and store the base64 data
          this.previewUrl = resizedBase64;
          this.newItem.image = resizedBase64;
        };
  
        // Load the image source from FileReader result
        img.src = readerTarget.result as string;
      };
  
      reader.readAsDataURL(file); // Read file as a data URL
    } else {
      console.warn('No file selected or input is empty');
    }
  }
  
  
  
  // Submit new item to Firebase
  submitItemForm() {
    // Add item to Firebase
    this.firestore.collection('items').add({
      category: this.newItem.category || null,
      description: this.newItem.description || null,
      image: this.newItem.image || null,  
    })
    .then(() => {
      // console.log('Item added successfully');
      this.snackBar.open(`Item added successfully`, 'Close', {
        duration: 3000,  
        panelClass: ['success-snackbar'],  
      });

     
      this.closeAddItemForm();
    })
    .catch((error) => {
      console.error('Error adding item: ', error);
      this.snackBar.open('Error while adding item. Please try again later.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],  
      });
     
    });
  }
 

}
