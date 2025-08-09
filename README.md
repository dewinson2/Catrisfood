# Catrisfood - Restaurante Mexicano

Una aplicación web moderna para un restaurante mexicano, construida con Angular 19 y Tailwind CSS.

## Características Principales

### 🍽️ Gestión de Menú
- **Carga de Imágenes**: Ahora puedes subir imágenes directamente desde tu dispositivo
- **Vista Previa**: Visualiza las imágenes antes de guardarlas
- **Formato Base64**: Las imágenes se almacenan como base64 para mejor compatibilidad
- **Validación**: Soporte para formatos JPG, PNG, GIF, WebP (máximo 5MB)
- **Sincronización**: Los platillos de la landing page se sincronizan automáticamente con el menú principal
- **Platillos Destacados**: Muestra automáticamente los 3 mejores platillos en la página principal

### 📱 Interfaz Responsiva
- Diseño adaptativo para dispositivos móviles y desktop
- Navegación intuitiva con componentes modulares
- Animaciones suaves y transiciones elegantes

### 🎨 Diseño Moderno
- Paleta de colores inspirada en la cultura mexicana
- Tipografía personalizada con fuentes elegantes
- Efectos visuales y gradientes atractivos

## Funcionalidades de Imágenes

### Cómo Cargar Imágenes

1. **En el formulario de agregar items**:
   - Haz clic en el área de carga de imagen
   - Selecciona un archivo de imagen de tu dispositivo
   - La imagen se mostrará en vista previa
   - Puedes eliminar y seleccionar otra imagen si lo deseas

2. **En la gestión de items existentes**:
   - Haz clic en el botón de cámara (📷) junto a la imagen
   - Selecciona una nueva imagen
   - La imagen se actualizará automáticamente

## Sincronización de Platillos Destacados

### Cómo Funciona

La aplicación automáticamente sincroniza los platillos de la landing page con el menú principal:

1. **Selección Inteligente**: Los 3 platillos más destacados se seleccionan automáticamente basándose en:
   - **Rating más alto** (60% del peso)
   - **Más reseñas** (30% del peso)
   - **Calidad de imagen** (10% del peso)

2. **Criterios de Calidad**: Solo se muestran platillos que tengan:
   - Imagen válida
   - Descripción completa
   - Título y precio definidos

3. **Actualización Automática**: Cuando agregas o modificas platillos en el menú, los destacados se actualizan automáticamente

4. **Fallback Inteligente**: Si no hay platillos que cumplan los criterios, se muestra un mensaje elegante invitando a ver el menú completo

### Formatos Soportados
- **JPG/JPEG**: Para fotografías
- **PNG**: Para imágenes con transparencia
- **GIF**: Para animaciones simples
- **WebP**: Para mejor compresión

### Límites
- **Tamaño máximo**: 5MB por imagen
- **Resolución**: Recomendado 800x600 o superior
- **Aspecto**: Se adapta automáticamente manteniendo proporciones

## Instalación y Uso

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd Catrisfood

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Comandos Disponibles
```bash
# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar pruebas
npm test

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   ├── views/              # Vistas principales
│   │   ├── menu/           # Vista del menú
│   │   ├── admin/          # Panel de administración
│   │   ├── add-items/      # Gestión de items
│   │   └── save-items/     # Agregar nuevos items
│   └── interfaces/         # Interfaces TypeScript
├── public/                 # Archivos estáticos
└── styles.css             # Estilos globales
```

## Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Tailwind CSS**: Framework de estilos
- **RxJS**: Manejo de observables
- **Angular Signals**: Estado reactivo

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**¡Disfruta tu experiencia en Catrisfood! 🌮🇲🇽**
