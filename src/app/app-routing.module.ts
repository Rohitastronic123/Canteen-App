import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CanteenComponent } from './canteen/canteen.component';
import { AuthGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { CanteendashboardComponent } from './canteendashboard/canteendashboard.component';

  const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent },
    { path: 'canteen', component: CanteenComponent, canActivate: [AuthGuard] }, // Protect the canteen route
    { path: 'orders', component: OrdersComponent },
    {path:'canteendashboard',component:CanteendashboardComponent}
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
