import { Routes } from '@angular/router';
import { ProductosComponent } from './components/productos/productos';

export const routes: Routes = [
  { path: '', component: ProductosComponent },
  { path: '**', redirectTo: '' },
];
