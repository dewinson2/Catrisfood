import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import { AdminService } from '../admin.service';
import { signal } from '@angular/core';


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
  selector: 'app-save-items',
  imports: [FormsModule],
  templateUrl: './save-items.component.html',
  styleUrl: './save-items.component.css'
})
export class SaveItemsComponent {
  constructor(private adminService: AdminService) {
    this.menuData.set(this.adminService.getMenuData());
  }
menuData = signal<MenuCategory[]>([]);
  selectedCategoryId: string | null = null;
  selectedItemId: number | null = null;

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.selectedItemId = null; // Reset selected item when category changes
  }

  
 

  addItem(categoryId: string, item: MenuItem) {
    this.adminService.addMenuItem(categoryId, item);
    this.menuData.set(this.adminService.getMenuData());
  }
  formValues = {
  category: '',
  itemCategory: '',
  itemName: '',
  itemDescription: '',
  itemPrice: 0,
};

uploadedImageBase64: string = '';
handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
onSubmit() {
  if (!this.formValues.category || !this.uploadedImageBase64) {
    alert('Faltan datos');
    return;
  }

  const newItem: MenuItem = {
    id: Date.now(), // ID temporal
    title: this.formValues.itemName,
    description: this.formValues.itemDescription,
    price: this.formValues.itemPrice,
    image: this.uploadedImageBase64,
    rating: 0,
    reviews: 0,
  };

  this.addItem(this.formValues.category, newItem);

  // Limpiar el formulario
  this.formValues = {
    category: '',
    itemCategory: '',
    itemName: '',
    itemDescription: '',
    itemPrice: 0,
  };
  this.uploadedImageBase64 = '';
}


  
}
