*Proyecto Final - Carrito de Compras con Express, MongoDB y JSON*

Este proyecto es una aplicación web de carrito de compras que permite:

Registro e inicio de sesión de usuarios

Visualización, filtrado y gestión de productos

Agregado de productos al carrito

Generación de ventas para usuarios autenticados

Cuenta con dos formas de persistencia de datos:

MongoDB: Para guardar en tiempo real todos los registros

Archivos JSON: Para revisar el funcionamiento sin necesidad de correr una base de datos

``Stack Tecnológico``
Backend: Node.js + Express

Base de Datos: MongoDB  y Archivos JSON simulados

Frontend: HTML, CSS (Tailwind CDN), JavaScript Vanilla

Autenticación: JWT + Bcrypt

``Estructura de Carpetas del Proyecto``
/data
Contiene los archivos .json que simulan bases de datos:

productos.json: listado de productos.

users.json: usuarios registrados.

ventas.json: ventas realizadas.
Se utilizan para pruebas sin conexión directa a una base de datos.

/db
Contiene los archivos relacionados con la conexión a MongoDB y los esquemas definidos con Mongoose.

/node_modules
Carpeta generada automáticamente al instalar dependencias con npm install.

/public
Carpeta para archivos públicos del frontend:

/auth/js: lógica de login.

/img: imágenes utilizadas.

/js/pages: controladores de cada página del frontend.

/routes
Define las rutas de la API REST con Express:

productos.routes.js

usuarios.routes.js

ventas.routes.js

/scripts
Scripts personalizados para tareas específicas como migración de datos:

migrarTodo.js: script para migrar los JSON a MongoDB.

/utils
Funciones auxiliares para tareas comunes:

sessionstorage.controller.js: manejo de sesiones en el frontend.

syncFile.js: sincronización entre MongoDB y archivos JSON (usado para mantener consistencia).

index.js
Archivo principal del servidor Express. Define las rutas, middleware, conexión a base de datos, etc.

.env
Variables de entorno como la URL de conexión a MongoDB.

package.json y package-lock.json
Archivos que definen y bloquean las dependencias del proyecto.

``Funcionamiento General``

1. Usuarios
Registro con campos básicos y contraseña encriptada

Login con generación de token JWT

Token se guarda en sessionStorage para autenticar acciones como compras

2. Productos
Visualización desde archivo productos.json

Filtrado por categoría en filtrar.html

Alta, modificación y baja desde backend (con sincronización a JSON)

3. Carrito
Asociado al usuario logueado mediante localStorage

Agregado desde las vistas Home y Filtrado

Visualización en carrito.html con cálculo de total y subtotales

4. Ventas
Requiere sesión activa (token válido)

Crea la venta en MongoDB y sincroniza con ventas.json

Limpia el carrito del usuario tras la compra

``Manejo de Errores e Integridad de Datos``
Todos los endpoints utilizan try/catch

Se devuelven códigos HTTP apropiados (200, 400, 401, 404, 500)

Se bloquea la eliminación de productos asociados a ventas

Se evita el acceso a funciones de carrito sin sesión activa
``Uso de JSON y MongoDB``
MongoDB se usa como base de datos principal en producción y para todas las operaciones CRUD.

Archivos JSON se sincronizan automáticamente cada vez que se crea, actualiza o elimina un producto o venta, permitiendo revisar fácilmente el contenido sin necesidad de tener MongoDB corriendo.

``Roadmap del Desarrollo``
Configuración de servidor Express y rutas base

Implementación de autenticación con JWT

Desarrollo de CRUD de productos y ventas con MongoDB

Sincronización con archivos JSON para revisión offline

Creación de controladores frontend para consumir API



