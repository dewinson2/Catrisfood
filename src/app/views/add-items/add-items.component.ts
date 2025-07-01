import { Component, signal, OnInit, inject } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-items.component.html',
  styleUrl: './add-items.component.css'
})
export class AddItemsComponent implements OnInit {
  // Inyección de dependencias correcta
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  // Signals para el estado reactivo
  menuData = signal<MenuCategory[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Estado de edición
  editable: number | null = null;
  editedItem = signal<{ id: number; field: string; value: string } | null>(null);

  // Formularios
  itemForm: FormGroup;
  addCategoryForm: FormGroup;
  addItemForm: FormGroup;

  // Estado de la UI
  selectedCategoryId: string = '';
  showAddCategoryForm: boolean = false;
  showAddItemForm: boolean = false;
  showDeleteCategoryForm: boolean = false;
  showDeleteItemForm: boolean = false;

  constructor() {
    console.log('🚀 AddItemsComponent inicializado');
    
    // Inicializar formularios
    this.itemForm = this.fb.group({});
    
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.addItemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['/placeholder.svg?height=200&width=300'],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      reviews: [0, [Validators.min(0)]],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('🔄 Inicializando componente...');
    this.loadMenuData();
    
    // Suscribirse a cambios en los datos
    this.adminService.getMenuData$().subscribe({
      next: (data) => {
        console.log('📊 Datos actualizados en el componente:', data);
        this.menuData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar datos:', error);
        this.error.set('Error al cargar los datos del menú');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga los datos del menú
   */
  private loadMenuData() {
    console.log('📥 Cargando datos del menú...');
    this.loading.set(true);
    this.error.set(null);
    
    // Los datos se cargarán automáticamente a través de la suscripción
    const currentData = this.adminService.getMenuData();
    if (currentData.length > 0) {
      this.menuData.set(currentData);
      this.loading.set(false);
    }
  }

  /**
   * Ver detalles de un item
   */
  viewItem(itemId: number) {
    console.log('👁️ Ver item:', itemId);
    
    // Buscar el item en todas las categorías
    const allItems = this.menuData().flatMap(cat => cat.items);
    const item = allItems.find(item => item.id === itemId);
    
    if (item) {
      console.log('📋 Detalles del item:', item);
      // Aquí puedes abrir un modal o navegar a una página de detalles
    } else {
      console.error('❌ Item no encontrado');
    }
  }

  /**
   * Activar modo de edición para un item
   */
  editItem(itemId: number) {
    console.log('✏️ Editando item:', itemId);
    this.editable = itemId;
  }

  /**
   * Cancelar edición
   */
  cancelEdit() {
    console.log('❌ Cancelando edición');
    this.editable = null;
    this.editedItem.set(null);
  }

  /**
   * Guardar cambios de edición
   */
  saveEdit() {
    const edited = this.editedItem();
    if (edited && this.editable) {
      console.log('💾 Guardando cambios:', edited);
      // Los cambios ya se guardaron en onItemEdit
      this.editable = null;
      this.editedItem.set(null);
    }
  }

  /**
   * Manejar edición de campo (versión simplificada)
   */
  onFieldEdit(categoryId: string, itemId: number, field: string, event: FocusEvent) {
    const newValue = (event.target as HTMLElement).innerText.trim();
    
    this.editedItem.set({
      id: itemId,
      field: field,
      value: newValue
    });
    
    console.log('📝 Campo editado:', this.editedItem());
  }

  /**
   * Limpiar números (mantener solo dígitos y punto decimal)
   */
  sanitizeNumber(value: string): number {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Manejar edición de item con validación y guardado automático
   */
  onItemEdit(categoryId: string, itemId: number, field: keyof MenuItem, event: FocusEvent) {
    console.log(`📝 Editando ${field} del item ${itemId}`);
    
    const rawValue = (event.target as HTMLElement).innerText.trim();
    
    // Validar y parsear el valor según el tipo de campo
    let parsedValue: string | number;
    
    if (field === 'price' || field === 'rating' || field === 'reviews') {
      parsedValue = this.sanitizeNumber(rawValue);
      
      // Validaciones específicas
      if (field === 'rating' && parsedValue > 5) {
        parsedValue = 5;
        console.warn('⚠️ Rating limitado a 5');
      }
      if (field === 'price' && parsedValue < 0) {
        parsedValue = 0;
        console.warn('⚠️ Precio no puede ser negativo');
      }
    } else {
      parsedValue = rawValue;
      
      // Validar campos de texto
      if (!parsedValue.trim()) {
        console.error('❌ El campo no puede estar vacío');
        this.loadMenuData(); // Recargar para revertir cambios
        return;
      }
    }

    // Actualizar estado local inmediatamente para mejor UX
    const updated = this.menuData().map(category => {
      if (category.id !== categoryId) return category;

      const updatedItems = category.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, [field]: parsedValue };
      });

      return { ...category, items: updatedItems };
    });

    this.menuData.set(updated);

    // Guardar en la API
    console.log(`💾 Guardando ${field} = ${parsedValue} para item ${itemId}`);
    this.adminService.updateMenuItem(categoryId, itemId, field, parsedValue);
  }

  /**
   * Duplicar un item
   */
  duplicateItem(itemId: number) {
    console.log('📋 Duplicando item:', itemId);
    
    // Buscar el item original
    let originalItem: MenuItem | undefined;
    let categoryId: string | undefined;
    
    for (const category of this.menuData()) {
      const item = category.items.find(item => item.id === itemId);
      if (item) {
        originalItem = item;
        categoryId = category.id;
        break;
      }
    }
    
    if (originalItem && categoryId) {
      // Crear nuevo item con ID único
      const newItem: MenuItem = {
        ...originalItem,
        id: Date.now(), // ID temporal único
        title: `${originalItem.title} (Copia)`
      };
      
      console.log('➕ Agregando item duplicado:', newItem);
      this.adminService.addMenuItem(categoryId, newItem);
    } else {
      console.error('❌ No se pudo encontrar el item para duplicar');
    }
  }

  /**
   * Eliminar un item
   */
  deleteItem(itemId: number) {
    console.log('🗑️ Eliminando item:', itemId);
    
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      this.adminService.deleteMenuItem(itemId);
    }
  }

  /**
   * Agregar nueva categoría
   */
  addCategory() {
    if (this.addCategoryForm.valid) {
      const categoryName = this.addCategoryForm.get('name')?.value;
      
      const newCategory: MenuCategory = {
        id: Date.now().toString(), // ID temporal
        name: categoryName,
        items: []
      };
      
      console.log('➕ Agregando nueva categoría:', newCategory);
      this.adminService.addMenuCategory(newCategory);
      
      // Resetear formulario y ocultar
      this.addCategoryForm.reset();
      this.showAddCategoryForm = false;
    } else {
      console.error('❌ Formulario de categoría inválido');
    }
  }

  /**
   * Agregar nuevo item
   */
  addItem() {
    if (this.addItemForm.valid) {
      const formValue = this.addItemForm.value;
      
      const newItem: MenuItem = {
        id: Date.now(), // ID temporal
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        image: formValue.image || '/placeholder.svg?height=200&width=300',
        rating: formValue.rating || 0,
        reviews: formValue.reviews || 0
      };
      
      console.log('➕ Agregando nuevo item:', newItem);
      this.adminService.addMenuItem(formValue.categoryId, newItem);
      
      // Resetear formulario y ocultar
      this.addItemForm.reset();
      this.showAddItemForm = false;
    } else {
      console.error('❌ Formulario de item inválido');
      this.markFormGroupTouched(this.addItemForm);
    }
  }

  /**
   * Eliminar categoría
   */
  deleteCategory(categoryId: string) {
    console.log('🗑️ Eliminando categoría:', categoryId);
    
    const category = this.menuData().find(cat => cat.id === categoryId);
    if (!category) {
      console.error('❌ Categoría no encontrada');
      return;
    }
    
    const confirmMessage = category.items.length > 0 
      ? `¿Estás seguro de eliminar la categoría "${category.name}"? Esto también eliminará ${category.items.length} items.`
      : `¿Estás seguro de eliminar la categoría "${category.name}"?`;
    
    if (confirm(confirmMessage)) {
      this.adminService.deleteMenuCategory(categoryId);
    }
  }

  /**
   * Refrescar datos manualmente
   */
  refreshData() {
    console.log('🔄 Refrescando datos...');
    this.adminService.refreshData();
  }

  /**
   * Marcar todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtener mensaje de error para un campo del formulario
   */
  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} es muy corto`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a 0`;
      if (field.errors['max']) return `${fieldName} debe ser menor a 5`;
    }
    return '';
  }

  /**
   * Manejar envío del formulario principal (si es necesario)
   */
  onSubmit() {
    console.log('📤 Formulario enviado:', this.itemForm.value);
    // Implementar lógica según necesidades
  }

  /**
   * Alternar visibilidad de formularios
   */
  toggleAddCategoryForm() {
    this.showAddCategoryForm = !this.showAddCategoryForm;
    if (!this.showAddCategoryForm) {
      this.addCategoryForm.reset();
    }
  }

  toggleAddItemForm() {
    this.showAddItemForm = !this.showAddItemForm;
    if (!this.showAddItemForm) {
      this.addItemForm.reset();
    }
  }
}