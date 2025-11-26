# Food Delivery Backend - Django REST Framework

A complete backend system for a food delivery application built with Django REST Framework and MySQL.

## Features

✅ User authentication (JWT)
✅ Role-based access control (Customer, Restaurant Owner, Delivery Agent, Admin)
✅ Restaurant management
✅ Menu items with categories
✅ Shopping cart functionality
✅ Order processing and tracking
✅ Delivery agent assignment
✅ Admin panel for management
✅ RESTful API design

## Tech Stack

- **Backend Framework:** Django 5+ & Django REST Framework
- **Database:** MySQL 8.0
- **Authentication:** JWT (djangorestframework-simplejwt)
- **API Documentation:** Auto-generated with DRF

## Quick Start

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide.

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create MySQL database
mysql -u root -p
CREATE DATABASE fooddelivery;
exit;

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create superuser
python manage.py createsuperuser

# 6. Run server
python manage.py runserver
```

## API Documentation

Complete API documentation is available in [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

Base URL: `http://localhost:8000/api/`

## User Roles

1. **Customer** - Browse restaurants, add to cart, place orders
2. **Restaurant Owner** - Manage restaurants and menu items
3. **Delivery Agent** - Accept and deliver orders
4. **Admin** - Full system access

## License

MIT
