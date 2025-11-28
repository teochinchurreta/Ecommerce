# Ecommerce

🟦 Backend – API REST con Node.js + Express + MongoDB + JWT
Proyecto ABMC · Entidad Principal: Productos · Entidad de Soporte: Compras

Este backend implementa una API REST basada en Express.js que gestiona autenticación de usuarios y CRUD completo (ABMC) para Productos y Compras, incluyendo paginación real, JWT, validación, logger, y estructura profesional escalable.

🚀 1. Tecnologías Utilizadas

Node.js

Express.js

MongoDB + Mongoose

JWT (jsonwebtoken)

bcryptjs

dotenv

morgan + winston (logger)

cors

📁 2. Estructura del Proyecto
backend/
│── src/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Purchase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── purchaseController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── purchaseRoutes.js
│   ├── utils/
│   │   └── logger.js
│   ├── server.js
│── .env
│── package.json

🔧 3. Instalación
1️⃣ Clonar el repositorio
git clone https://github.com/tu-repo/backend.git
cd backend

2️⃣ Instalar dependencias
npm install

3️⃣ Crear archivo .env

Crea un archivo .env en la raíz del backend:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/abmc_app
JWT_SECRET=esteEsUnSecretoMuySeguro123
LOG_LEVEL=info

4️⃣ Iniciar el servidor
npm run dev


El backend correrá en:

http://localhost:5000

🔐 4. Autenticación

Este backend utiliza JWT con Bearer Token.

🔹 Registro
POST /api/auth/register


Body:

{
  "username": "juan",
  "email": "juan@gmail.com",
  "password": "123456"
}

🔹 Login
POST /api/auth/login


Respuesta:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}

🔹 Uso del token (ejemplo desde frontend)
Authorization: Bearer <token>

📦 5. CRUDs del Sistema
🟩 Productos – Entidad Principal
➤ Listar con paginación
GET /api/products?page=1&limit=10

➤ Obtener uno
GET /api/products/:id

➤ Crear
POST /api/products

{
  "name": "Mouse Gamer",
  "description": "RGB, 7200 DPI",
  "price": 15000,
  "user": "ID_USER"
}

➤ Modificar
PUT /api/products/:id

➤ Eliminar
DELETE /api/products/:id

🟦 Compras – Entidad de Soporte (relación con Productos)
➤ Crear una compra
POST /api/purchases


Ejemplo:

{
  "product": "PRODUCT_ID",
  "quantity": 3,
  "address": "Calle 123",
  "buyerName": "Juan Pérez"
}

➤ Listar con paginación
GET /api/purchases?page=1&limit=10

🧪 6. Pruebas con Postman
1️⃣ Importar colección

Puedes crear una colección con estas rutas:

POST → /api/auth/register  
POST → /api/auth/login  
GET  → /api/products  
POST → /api/products  
PUT  → /api/products/:id  
DELETE → /api/products/:id  
GET → /api/purchases  
POST → /api/purchases  

2️⃣ Guardar el token de login

En Tests del login:

pm.environment.set("token", pm.response.json().token);

3️⃣ Usar token automáticamente

En Authorization del resto de rutas:
→ Type: Bearer Token
→ Token: {{token}}

📝 7. Logger

Este backend guarda errores en un archivo logs/errors.log.

Ejemplo usando Winston:

logger.error("Error al crear el producto: " + error.message);

🛡️ 8. Middleware Incluidos
✔ authMiddleware

Protege rutas restringidas usando JWT.

✔ errorMiddleware

Devuelve respuestas HTTP claras con estructura uniforme.

🔄 9. Relación Entre Entidades
Un Producto puede estar asociado a muchas Compras.

Ejemplo Purchase Schema:

product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }

🔗 10. Conexión con el Frontend (Vite)

En el frontend colocar en .env:

VITE_API_BASE=http://localhost:5000/api


Y se usa así:

const api = import.meta.env.VITE_API_BASE;

🎯 11. Scripts Disponibles
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
}

🟣 12. Estado Actual del Backend

✔ Autenticación completa
✔ CRUD con paginación
✔ Uso de JWT
✔ Validaciones
✔ Logger
✔ Relación entre entidades
✔ Compatible 100% con el frontend (React + Vite)

🟢 13. Contribuir

Realizar un fork del repositorio

Crear una rama:

git checkout -b feature/nueva-funcionalidad


Hacer commit:

git commit -m "Agrega nueva funcionalidad"


Abrir un Pull Request
