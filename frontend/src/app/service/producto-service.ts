  import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Producto, ProductoResponse } from '../models/productos';

  @Injectable({
    providedIn: 'root',
  })
  export class ProductoService {
    private readonly http = inject(HttpClient);
        private readonly apiUrl = 'http://localhost:3000/productos';

    getAllProductos(): Observable<Producto[] | ProductoResponse> {
      return this.http.get<Producto[] | ProductoResponse>(this.apiUrl);
    }

    createProducto(producto: Producto): Observable<Producto> {
      return this.http.post<Producto>(this.apiUrl, producto);
    }
    
}


