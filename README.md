# Uma Grocery - Full Stack Application

A complete grocery shop application built with React, Django, and MySQL.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI + Tailwind CSS
- **Backend**: Django 4.2 + Django REST Framework
- **Database**: MySQL 8.0
- **State Management**: React Hooks
- **HTTP Client**: Axios

## Features

- 🛒 Product browsing by categories (Vegetables, Dairy, Chocolates, Masala Powder)
- 🔍 Search functionality
- 🛍️ Shopping cart with add/remove/update quantity
- 👤 User authentication (Login/Signup)
- 📦 Order placement and tracking
- 🚚 Free home delivery on orders above ₹500
- 💳 Indian pricing (₹) throughout the application

## Project Structure

```
code/
├── src/                    # React frontend
│   ├── app/
│   │   ├── App.tsx        # Main application component
│   │   └── services/
│   │       └── api.ts     # API service layer
│   └── styles/            # CSS files
├── backend/               # Django backend
│   ├── uma_grocery/       # Django project
│   │   ├── settings.py    # Project settings
│   │   └── urls.py        # URL routing
│   ├── api/               # Django app
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views
│   │   ├── serializers.py # DRF serializers
│   │   └── urls.py        # API routes
│   ├── manage.py          # Django management
│   ├── requirements.txt   # Python dependencies
│   └── populate_db.py     # Database seeding script
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.10+
- MySQL 8.0+

### 1. MySQL Database Setup

Create a MySQL database:

```sql
CREATE DATABASE uma_grocery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'uma_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON uma_grocery_db.* TO 'uma_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Populate database with sample products
python populate_db.py

# Start Django development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

### 3. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
pnpm install

# The Vite dev server should already be running
# If not, it will be started automatically by the Make environment
```

The frontend will be available through the Make preview.

### 4. Access the Application

1. **Frontend**: Access through the Make preview panel
2. **Backend API**: http://localhost:8000/api/
3. **Admin Panel**: http://localhost:8000/admin/

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user info

### Products
- `GET /api/products/` - List all products
- `GET /api/products/?category=Vegetables` - Filter by category
- `GET /api/products/?search=broccoli` - Search products
- `GET /api/products/{id}/` - Get product details

### Categories
- `GET /api/categories/` - List all categories

### Cart
- `GET /api/cart/` - Get user's cart items
- `POST /api/cart/` - Add item to cart
  ```json
  {
    "product": 1,
    "quantity": 2
  }
  ```
- `PATCH /api/cart/{id}/update_quantity/` - Update item quantity
  ```json
  {
    "quantity": 3
  }
  ```
- `DELETE /api/cart/{id}/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear entire cart

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
  ```json
  {
    "delivery_address": "123 Main St",
    "phone": "9876543210"
  }
  ```
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/update_status/` - Update order status (admin)

## Database Models

### User
- Extended Django User model with phone and address fields

### Category
- name, description, created_at

### Product
- name, price, category (FK), image_url, unit, description, in_stock

### Cart
- user (FK), product (FK), quantity

### Order
- user (FK), status, delivery_address, phone, total_amount, delivery_charge

### OrderItem
- order (FK), product (FK), quantity, price

## Environment Variables

Backend `.env` file:

```env
DB_NAME=uma_grocery_db
DB_USER=uma_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your-django-secret-key
DEBUG=True
```

## Development

### Running the Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

### Running the Frontend

The frontend is automatically served by the Make environment.

### Adding New Products

Use the Django admin panel at `http://localhost:8000/admin/` or run the populate script:

```bash
cd backend
python populate_db.py
```

## Troubleshooting

### CORS Issues
- Ensure Django CORS settings in `settings.py` include your frontend URL
- Default: `http://localhost:5173` and `http://localhost:3000`

### Database Connection Failed
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

### Login/Signup Not Working
- Check Django backend is running on port 8000
- Verify CORS configuration
- Check browser console for errors

### Products Not Loading
- Ensure backend is running
- Check if products exist: `python manage.py shell` → `from api.models import Product; Product.objects.all()`
- Run populate script if needed

## License

MIT
