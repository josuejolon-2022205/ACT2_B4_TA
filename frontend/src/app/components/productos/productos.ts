import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../service/producto-service';
import { Producto } from '../../models/productos';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  productos: Producto[] = [];
  cargando = false;
  guardando = false;
  errorMensaje = '';
  mensajeExito = '';

  // Formulario Reactivo con Controles y Validaciones
  productoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [null, [Validators.required, Validators.min(0.01)]],
    cantidad: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
    }
  }

  cargarProductos(): void {
    this.cargando = true;
    this.errorMensaje = '';

    this.productoService
      .getAllProductos()
      .pipe(timeout(5000))
      .subscribe({
        next: (response) => {
          const datos = Array.isArray(response) ? response : response?.productos ?? [];

          this.productos = datos.map((producto) => ({
            id: producto.id,
            nombre: producto.nombre ?? 'Sin nombre',
            precio: Number(producto.precio ?? 0),
            cantidad: Number(producto.cantidad ?? 0),
          }));

          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.productos = [];
          this.cargando = false;

          if (err.name === 'TimeoutError') {
            this.errorMensaje =
              'El servidor backend (http://localhost:3000) tardó demasiado en responder (Timeout).';
          } else if (err.status === 0) {
            this.errorMensaje =
              'No se pudo conectar con el servidor backend. Verifica que el servidor esté corriendo en http://localhost:3000.';
          } else if (err.error?.mensaje) {
            this.errorMensaje = err.error.mensaje + (err.error.error ? `: ${err.error.error}` : '');
          } else if (err.error?.error) {
            this.errorMensaje = `Error del servidor: ${err.error.error}`;
          } else {
            this.errorMensaje = `Error al cargar la tabla de productos (${err.statusText || 'Error desconocido'}).`;
          }
        },
      });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get campoNombre() {
    return this.productoForm.get('nombre');
  }

  get campoPrecio() {
    return this.productoForm.get('precio');
  }

  get campoCantidad() {
    return this.productoForm.get('cantidad');
  }

  // Métodos de validación dinámica y generación de mensajes de error
  getErroresNombre(): string[] {
    const errores: string[] = [];
    const control = this.campoNombre;
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        errores.push('El nombre del producto es obligatorio.');
      }
      if (control.errors?.['minlength']) {
        errores.push(
          `El nombre debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`,
        );
      }
    }
    return errores;
  }

  getErroresPrecio(): string[] {
    const errores: string[] = [];
    const control = this.campoPrecio;
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        errores.push('El precio es obligatorio.');
      }
      if (control.errors?.['min']) {
        errores.push('El precio debe ser un número mayor a 0.');
      }
    }
    return errores;
  }

  getErroresCantidad(): string[] {
    const errores: string[] = [];
    const control = this.campoCantidad;
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        errores.push('La cantidad es obligatoria.');
      }
      if (control.errors?.['min']) {
        errores.push('La cantidad debe ser al menos 1 unidad.');
      }
      if (control.errors?.['pattern']) {
        errores.push('La cantidad debe ser un número entero válido.');
      }
    }
    return errores;
  }

  // Envío del formulario al backend mediante el servicio
  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeExito = '';
    this.errorMensaje = '';

    const nuevoProducto: Producto = {
      nombre: this.productoForm.value.nombre.trim(),
      precio: Number(this.productoForm.value.precio),
      cantidad: Number(this.productoForm.value.cantidad),
    };

    this.productoService.createProducto(nuevoProducto).subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeExito = '¡Producto registrado y enviado exitosamente!';
        this.productoForm.reset();
        this.cargarProductos();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al registrar producto:', err);
        if (err.status === 0) {
          this.errorMensaje =
            'No se pudo conectar con el servidor backend para registrar el producto.';
        } else {
          this.errorMensaje =
            err.error?.mensaje || err.error?.error || 'Error al guardar el producto.';
        }
      },
    });
  }

  get totalStock(): number {
    return this.productos.reduce((sum, producto) => sum + (producto.cantidad ?? 0), 0);
  }

  get valorInventario(): number {
    return this.productos.reduce(
      (sum, producto) => sum + (producto.precio ?? 0) * (producto.cantidad ?? 0),
      0,
    );
  }
}
