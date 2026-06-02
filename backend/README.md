# Uma Grocery - Django Backend

Django REST API backend for Uma Grocery Shop with MySQL database.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE uma_grocery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:
```
DB_NAME=uma_grocery_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Load Initial Data (Optional)

```bash
python manage.py shell
```

Then run the following commands to populate the database:

```python
from api.models import Category, Product

# Create categories
vegetables = Category.objects.create(name='Vegetables', description='Fresh vegetables')
dairy = Category.objects.create(name='Dairy', description='Dairy products')
chocolates = Category.objects.create(name='Chocolates', description='Chocolates and sweets')
masala = Category.objects.create(name='Masala Powder', description='Indian spices and masala powders')

# Create sample products (you can add more)
Product.objects.create(
    name='Fresh Broccoli',
    price=80,
    category=vegetables,
    image_url='https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
    unit='per kg',
    description='Fresh and organic broccoli'
)
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user

### Products
- `GET /api/products/` - List all products
- `GET /api/products/?category=Vegetables` - Filter by category
- `GET /api/products/?search=broccoli` - Search products
- `GET /api/products/{id}/` - Get product details

### Categories
- `GET /api/categories/` - List all categories

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/` - Add item to cart
- `PATCH /api/cart/{id}/update_quantity/` - Update quantity
- `DELETE /api/cart/{id}/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear cart

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/update_status/` - Update order status

## Admin Panel

Access the admin panel at `http://localhost:8000/admin/`

Use the superuser credentials created in step 5.
