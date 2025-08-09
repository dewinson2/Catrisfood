import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService, MenuCategory, MenuItem } from '../admin.service';

@Component({
  selector: 'app-save-items',
  imports: [FormsModule, CommonModule],
  templateUrl: './save-items.component.html',
  styleUrl: './save-items.component.css'
})
export class SaveItemsComponent implements OnInit {
  private adminService = inject(AdminService);
  
  // Signals para manejar el estado
  menuData = signal<MenuCategory[]>([]);
  selectedCategory = signal<string>('');
  isAddingCategory = signal<boolean>(false);
  isAddingItem = signal<boolean>(false);
  message = signal<string>('');
  messageType = signal<'success' | 'error' | ''>('');
  
  // Formulario para nueva categoría
  newCategory = {
    name: ''
  };
  
  // Formulario para nuevo item
  newItem = {
    title: '',
    description: '',
    price: 0,
    image: '',
    rating: 5,
    reviews: 0
  };

  // Variables para manejo de imágenes
  selectedImageFile: File | null = null;
  imagePreview = signal<string>('');

  ngOnInit(): void {
    // Cargar datos del menú
    this.adminService.menuData$.subscribe((data) => {
      this.menuData.set(data);
    });
  }

  // Método para manejar la selección de archivo de imagen
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.showMessage('Por favor selecciona un archivo de imagen válido', 'error');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('La imagen debe ser menor a 5MB', 'error');
        return;
      }

      this.selectedImageFile = file;
      this.convertImageToBase64(file);
    }
  }

  // Método para convertir imagen a base64
  private convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.imagePreview.set(result);
      this.newItem.image = result; // Guardar como base64
    };
    reader.readAsDataURL(file);
  }

  // Método para limpiar la imagen seleccionada
  clearSelectedImage(): void {
    this.selectedImageFile = null;
    this.imagePreview.set('');
    this.newItem.image = '';
  }

  // Métodos para categorías
  showAddCategoryForm(): void {
    this.isAddingCategory.set(true);
    this.isAddingItem.set(false);
    this.newCategory.name = '';
  }

  cancelAddCategory(): void {
    this.isAddingCategory.set(false);
    this.newCategory.name = '';
  }

  addCategory(): void {
    if (this.newCategory.name.trim()) {
      this.adminService.addMenuCategory(this.newCategory.name.trim()).subscribe((category) => {
        if (category) {
          this.isAddingCategory.set(false);
          this.newCategory.name = '';
          this.showMessage('Categoría añadida exitosamente', 'success');
        } else {
          this.showMessage('Error al añadir la categoría', 'error');
        }
      });
    }
  }

  // Métodos para items
  showAddItemForm(): void {
    this.isAddingItem.set(true);
    this.isAddingCategory.set(false);
    this.resetItemForm();
  }

  cancelAddItem(): void {
    this.isAddingItem.set(false);
    this.resetItemForm();
  }

  addItem(): void {
    if (this.selectedCategory() && this.newItem.title.trim() && this.newItem.description.trim()) {
      const itemToAdd = {
        title: this.newItem.title.trim(),
        description: this.newItem.description.trim(),
        price: this.newItem.price,
        image: this.newItem.image.trim() || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==',
        rating: this.newItem.rating,
        reviews: this.newItem.reviews
      };

      this.adminService.addMenuItem(this.selectedCategory(), itemToAdd).subscribe((item) => {
        if (item) {
          this.isAddingItem.set(false);
          this.resetItemForm();
          this.showMessage('Item añadido exitosamente', 'success');
        } else {
          this.showMessage('Error al añadir el item', 'error');
        }
      });
    }
  }

  private resetItemForm(): void {
    this.newItem = {
      title: '',
      description: '',
      price: 0,
      image: '',
      rating: 5,
      reviews: 0
    };
    this.selectedImageFile = null;
    this.imagePreview.set('');
  }

  // Métodos de utilidad
  getCategories(): MenuCategory[] {
    return this.menuData();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message.set(text);
    this.messageType.set(type);
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      this.message.set('');
      this.messageType.set('');
    }, 3000);
  }
}
