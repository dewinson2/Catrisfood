import { Component,inject,OnInit,signal } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormGroup,ReactiveFormsModule } from '@angular/forms';
interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
  
interface MenuItem {
  
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-add-items',
  imports: [ReactiveFormsModule],
  templateUrl: './add-items.component.html',
  styleUrl: './add-items.component.css'
})
export class AddItemsComponent implements OnInit {
   adminService = inject(AdminService);
    menuData = signal<MenuCategory[]>([]);
    itemForm = new FormGroup({});
    editable: number | null = null;
    editedItem = signal<{ id: number; field: string; value: string } | null>(null);
viewItem(itemId: number) {
    console.log('Ver item:', itemId);

    // Tu lógica aquí

  }
  //guardar

  editItem(itemId: number) {
   this.editable = itemId;

    }
    onFieldEdit(categoryId: string, itemId: number, field: string, event: FocusEvent) {
  const newValue = (event.target as HTMLElement).innerText.trim();

  // Guardamos los datos en el signal
  this.editedItem.set({
    id: itemId,
    field: field,
    value: newValue
  });

  console.log('Editado:', this.editedItem());

  // Aquí podrías llamar el servicio si quieres guardar de una vez:
  // this.adminService.updateItemField(itemId, field, newValue);
}

sanitizeNumber(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, ''); // Elimina todo lo que no sea número o punto decimal
  return parseFloat(cleaned) || 0;
}

onItemEdit(categoryId: string, itemId: number, field: keyof MenuItem, event: FocusEvent) {
  const rawValue = (event.target as HTMLElement).innerText.trim();

  const parsedValue: string | number =
    field === 'price' || field === 'rating' || field === 'reviews'
      ? this.sanitizeNumber(rawValue)
      : rawValue;

  // Llamada a la API y actualización reactiva
  this.adminService.updateMenuItem(categoryId, itemId, { [field]: parsedValue }).subscribe((updatedItem) => {
    if (updatedItem) {
      // Actualiza el estado local si es necesario (ya lo hace el servicio)
      this.editable = null;
    }
  });
}




  

  // Variables para manejo de imágenes
  selectedImageFile: File | null = null;
  imagePreview = signal<string>('');
  editingImageItemId: number | null = null;

  // Método para manejar la selección de archivo de imagen
  onImageSelected(event: Event, itemId?: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        console.error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('La imagen debe ser menor a 5MB');
        return;
      }

      this.selectedImageFile = file;
      this.convertImageToBase64(file, itemId);
    }
  }

  // Método para convertir imagen a base64
  private convertImageToBase64(file: File, itemId?: number): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.imagePreview.set(result);
      
      if (itemId) {
        // Si estamos editando un item existente, actualizar la imagen
        this.updateItemImage(itemId, result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Método para actualizar la imagen de un item
  private updateItemImage(itemId: number, imageBase64: string): void {
    let foundCategory: MenuCategory | undefined;
    this.menuData().forEach(category => {
      const item = category.items.find(i => i.id === itemId);
      if (item) {
        foundCategory = category;
      }
    });
    
    if (foundCategory) {
      this.adminService.updateMenuItem(foundCategory.id, itemId, { image: imageBase64 }).subscribe((updatedItem) => {
        if (updatedItem) {
          this.editingImageItemId = null;
          this.selectedImageFile = null;
          this.imagePreview.set('');
        }
      });
    }
  }

  // Método para iniciar la edición de imagen
  editItemImage(itemId: number): void {
    this.editingImageItemId = itemId;
  }

  // Método para cancelar la edición de imagen
  cancelImageEdit(): void {
    this.editingImageItemId = null;
    this.selectedImageFile = null;
    this.imagePreview.set('');
  }

  duplicateItem(itemId: number) {
    // Encuentra el item y la categoría
    let foundCategory: MenuCategory | undefined;
    let foundItem: MenuItem | undefined;
    this.menuData().forEach(category => {
      const item = category.items.find(i => i.id === itemId);
      if (item) {
        foundCategory = category;
        foundItem = item;
      }
    });
    if (foundCategory && foundItem) {
      // Crea una copia del item sin el id
      const { id, ...itemData } = foundItem;
      this.adminService.addMenuItem(foundCategory.id, itemData).subscribe();
    }
  }

  deleteItem(categoryId: string, itemId: number) {
    this.adminService.deleteMenuItem(categoryId, itemId).subscribe();
  }

  ngOnInit() {
    this.adminService.menuData$.subscribe(data => {
      this.menuData.set(data);
    });
  }
  onSubmit() {
    // Aquí va la lógica para manejar el envío del formulario
    console.log('Formulario enviado:', this.itemForm.value);
  }
  addCategoryForm: FormGroup = new FormGroup({});
  addItemForm: FormGroup = new FormGroup({});
  selectedCategoryId: string = '';
  showAddCategoryForm: boolean = false;
  showAddItemForm: boolean = false;
  showDeleteCategoryForm: boolean = false;
  showDeleteItemForm: boolean = false;

 

}
