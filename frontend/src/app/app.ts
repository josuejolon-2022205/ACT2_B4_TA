import { Component } from '@angular/core';
import { ProductosComponent } from './components/productos/productos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductosComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
