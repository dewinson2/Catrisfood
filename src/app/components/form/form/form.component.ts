import { Component, inject, OnInit, signal, computed, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APIService, MenuItemAPI, CategoryAPI, CreateMenuDTO, UpdateMenuDTO } from '../../../api.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-form',
  imports: [ ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(APIService);
  private authService = inject(AuthService);

  // Signals
  readonly menuItems = signal<MenuItemAPI[]>([]);
  readonly categories = signal<CategoryAPI[]>([]);
  readonly loading = signal(false);
  readonly message = signal<{ text: string; type: 'success' | 'error' } | null>(null);
  readonly editingItem = signal<MenuItemAPI | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly uploadingImage = signal(false);
  readonly activeTab = signal<'menu' | 'category'>('menu');
  readonly showDeleteConfirm = signal<number | null>(null);

  // Forms
  menuForm!: FormGroup;
  categoryForm!: FormGroup;

  // Computed
  readonly isEditing = computed(() => this.editingItem() !== null);

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  private initForms(): void {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      category: ['', Validators.required],
      img_url: ['']
    });

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.api.getMenu().subscribe({
      next: (res) => {
        this.menuItems.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading menu:', err);
        this.showMessage('Error al cargar el menú', 'error');
        this.loading.set(false);
      }
    });

    this.api.getCategories().subscribe({
      next: (res) => this.categories.set(res.data || []),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  // ── Image Upload ──

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('La imagen no debe superar 5MB', 'error');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    this.uploadingImage.set(true);
    this.api.uploadImage(file).subscribe({
      next: (res) => {
        this.menuForm.patchValue({ img_url: res.data.url });
        this.uploadingImage.set(false);
        this.showMessage('Imagen subida exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        this.uploadingImage.set(false);
        this.showMessage('Error al subir la imagen', 'error');
      }
    });
  }

  // ── Menu CRUD ──

  submitMenu(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.menuForm.value;

    if (this.isEditing()) {
      const data: UpdateMenuDTO = {};
      if (formValue.name) data.name = formValue.name;
      if (formValue.price) data.price = Number(formValue.price);
      if (formValue.description) data.description = formValue.description;
      if (formValue.category) data.category = formValue.category;
      if (formValue.img_url) data.img_url = formValue.img_url;

      this.api.updateMenuItem(this.editingItem()!.id_menu, data).subscribe({
        next: () => {
          this.showMessage('Producto actualizado exitosamente', 'success');
          this.resetMenuForm();
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating:', err);
          this.showMessage('Error al actualizar el producto', 'error');
          this.loading.set(false);
        }
      });
    } else {
      const data: CreateMenuDTO = {
        name: formValue.name,
        price: Number(formValue.price),
        category: formValue.category,
        description: formValue.description || undefined,
        img_url: formValue.img_url || undefined
      };

      this.api.createMenuItem(data).subscribe({
        next: () => {
          this.showMessage('Producto creado exitosamente', 'success');
          this.resetMenuForm();
          this.loadData();
        },
        error: (err) => {
          console.error('Error creating:', err);
          this.showMessage('Error al crear el producto', 'error');
          this.loading.set(false);
        }
      });
    }
  }

  editItem(item: MenuItemAPI): void {
    this.editingItem.set(item);
    this.menuForm.patchValue({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      img_url: item.img_url
    });
    if (item.img_url) {
      this.imagePreview.set(item.img_url);
    }
    this.activeTab.set('menu');
    // Scroll to form
    document.getElementById('menu-form-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  confirmDelete(id: number): void {
    this.showDeleteConfirm.set(id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  deleteItem(id: number): void {
    this.loading.set(true);
    this.api.deleteMenuItem(id).subscribe({
      next: () => {
        this.showMessage('Producto eliminado exitosamente', 'success');
        this.showDeleteConfirm.set(null);
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting:', err);
        this.showMessage('Error al eliminar el producto', 'error');
        this.loading.set(false);
      }
    });
  }

  resetMenuForm(): void {
    this.menuForm.reset();
    this.editingItem.set(null);
    this.imagePreview.set(null);
    this.loading.set(false);
  }

  // ── Category ──

  submitCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    // La API no tiene POST /api/categories — se crean al agregar un producto con nueva categoría
    // Creamos un producto placeholder o simplemente informamos
    const categoryName = this.categoryForm.value.name;

    // Verificar si ya existe
    const exists = this.categories().some(
      c => c.category.toLowerCase() === categoryName.toLowerCase()
    );

    if (exists) {
      this.showMessage('Esa categoría ya existe', 'error');
      return;
    }

    // Para crear una categoría, se necesita al menos un producto con esa categoría
    this.showMessage(
      `Para crear la categoría "${categoryName}", agrégala como categoría de un nuevo producto en el formulario de menú.`,
      'success'
    );
    this.menuForm.patchValue({ category: categoryName });
    this.activeTab.set('menu');
    this.categoryForm.reset();
  }

  deleteCategory(categoryName: string): void {
    // Obtener los items de esa categoría y eliminarlos
    const itemsInCategory = this.menuItems().filter(item => item.category === categoryName);
    if (itemsInCategory.length > 0) {
      this.showMessage(
        `La categoría "${categoryName}" tiene ${itemsInCategory.length} producto(s). Elimina los productos primero.`,
        'error'
      );
      return;
    }
    this.showMessage(`La categoría "${categoryName}" ya no contiene productos y será removida automáticamente.`, 'success');
    this.loadData();
  }

  // ── Helpers ──

  setTab(tab: 'menu' | 'category'): void {
    this.activeTab.set(tab);
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message.set({ text, type });
    setTimeout(() => this.message.set(null), 5000);
  }

  getFieldError(form: FormGroup, field: string): string | null {
    const control = form.get(field);
    if (!control?.touched || !control.errors) return null;
    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}`;
    return null;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
