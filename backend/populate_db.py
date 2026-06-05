import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uma_grocery.settings')
django.setup()

from api.models import Category, Product


from django.core.management import call_command
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
fixture_path = BASE_DIR / 'catalog_data.json'


def populate_database():
    if os.path.exists(fixture_path):
        print(f"Loading local database fixture from {fixture_path}...")
        call_command('loaddata', str(fixture_path))
        print("Database populated from catalog_data.json successfully!")
        print(f"Categories: {Category.objects.count()}")
        print(f"Products: {Product.objects.count()}")
        return

    print("Creating categories...")

    vegetables, _ = Category.objects.get_or_create(name='Vegetables', defaults={'description': 'Fresh vegetables'})
    dairy, _ = Category.objects.get_or_create(name='Dairy', defaults={'description': 'Dairy products'})
    chocolates, _ = Category.objects.get_or_create(name='Chocolates', defaults={'description': 'Chocolates and sweets'})
    masala, _ = Category.objects.get_or_create(name='Masala Powder', defaults={'description': 'Indian spices and masala powders'})
    oral_care, _ = Category.objects.get_or_create(name='Oral Care', defaults={'description': 'Toothbrushes, toothpastes and oral health'})
    personal_care, _ = Category.objects.get_or_create(name='Personal Care', defaults={'description': 'Soaps, shampoos and bath essentials'})

    print("Creating products...")

    # Vegetables
    vegetables_data = [
        {'name': 'Fresh Broccoli', 'price': 80, 'image_url': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', 'unit': 'per kg'},
        {'name': 'Organic Carrots', 'price': 60, 'image_url': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'unit': 'per kg'},
        {'name': 'Cherry Tomatoes', 'price': 120, 'image_url': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', 'unit': 'per pack'},
        {'name': 'Fresh Spinach', 'price': 40, 'image_url': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 'unit': 'per bunch'},
        {'name': 'Bell Peppers', 'price': 90, 'image_url': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 'unit': 'per kg'},
        {'name': 'Green Beans', 'price': 70, 'image_url': 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400', 'unit': 'per kg'},
        {'name': 'Cauliflower', 'price': 50, 'image_url': 'https://images.unsplash.com/photo-1568584711271-61813087c2e4?w=400', 'unit': 'per piece'},
        {'name': 'Potatoes', 'price': 35, 'image_url': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 'unit': 'per kg'},
        {'name': 'Onions', 'price': 40, 'image_url': 'https://images.unsplash.com/photo-1508313880080-c4bef43d8e66?w=400', 'unit': 'per kg'},
        {'name': 'Green Peas', 'price': 85, 'image_url': 'https://images.unsplash.com/photo-1611170185960-4f35e1f5e4c6?w=400', 'unit': 'per kg'},
    ]

    for item in vegetables_data:
        Product.objects.get_or_create(name=item['name'], category=vegetables, defaults=item)

    # Dairy
    dairy_data = [
        {'name': 'Whole Milk', 'price': 65, 'image_url': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 'unit': 'per liter'},
        {'name': 'Greek Yogurt', 'price': 180, 'image_url': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'unit': 'per pack'},
        {'name': 'Cheddar Cheese', 'price': 450, 'image_url': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400', 'unit': 'per kg'},
        {'name': 'Fresh Paneer', 'price': 320, 'image_url': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 'unit': 'per kg'},
        {'name': 'Butter', 'price': 520, 'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'unit': 'per kg'},
        {'name': 'Fresh Cream', 'price': 280, 'image_url': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', 'unit': 'per liter'},
        {'name': 'Mozzarella Cheese', 'price': 480, 'image_url': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', 'unit': 'per kg'},
        {'name': 'Buttermilk', 'price': 45, 'image_url': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', 'unit': 'per liter'},
        {'name': 'Ghee', 'price': 650, 'image_url': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', 'unit': 'per kg'},
        {'name': 'Condensed Milk', 'price': 150, 'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'unit': 'per can'},
    ]

    for item in dairy_data:
        Product.objects.get_or_create(name=item['name'], category=dairy, defaults=item)

    # Chocolates
    chocolates_data = [
        {'name': 'Dairy Milk Silk', 'price': 180, 'image_url': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', 'unit': 'per bar'},
        {'name': 'KitKat', 'price': 60, 'image_url': 'https://images.unsplash.com/photo-1606312619070-d48b4cbc79bf?w=400', 'unit': 'per pack'},
        {'name': 'Ferrero Rocher', 'price': 450, 'image_url': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 'unit': 'per box'},
        {'name': 'Dark Chocolate', 'price': 220, 'image_url': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', 'unit': 'per bar'},
        {'name': 'Snickers', 'price': 50, 'image_url': 'https://images.unsplash.com/photo-1604049793744-21c197da68d8?w=400', 'unit': 'per bar'},
        {'name': 'Milk Chocolate Truffles', 'price': 380, 'image_url': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', 'unit': 'per box'},
        {'name': 'Toblerone', 'price': 350, 'image_url': 'https://images.unsplash.com/photo-1481391243133-f96216dcb5785?w=400', 'unit': 'per bar'},
        {'name': 'Munch', 'price': 40, 'image_url': 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=400', 'unit': 'per bar'},
        {'name': 'White Chocolate', 'price': 200, 'image_url': 'https://images.unsplash.com/photo-1622484211443-38b1f7f92f24?w=400', 'unit': 'per bar'},
        {'name': 'Bounty', 'price': 55, 'image_url': 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=400', 'unit': 'per bar'},
    ]

    for item in chocolates_data:
        Product.objects.get_or_create(name=item['name'], category=chocolates, defaults=item)

    # Masala Powder
    masala_data = [
        {'name': 'Garam Masala', 'price': 120, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a0b78378ac63?w=400', 'unit': 'per 100g'},
        {'name': 'Turmeric Powder', 'price': 80, 'image_url': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', 'unit': 'per 100g'},
        {'name': 'Red Chilli Powder', 'price': 90, 'image_url': 'https://images.unsplash.com/photo-1599909734744-8ab8d0936ec8?w=400', 'unit': 'per 100g'},
        {'name': 'Coriander Powder', 'price': 70, 'image_url': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400', 'unit': 'per 100g'},
        {'name': 'Cumin Powder', 'price': 95, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a0b78378ac63?w=400', 'unit': 'per 100g'},
        {'name': 'Black Pepper Powder', 'price': 280, 'image_url': 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400', 'unit': 'per 100g'},
        {'name': 'Biryani Masala', 'price': 150, 'image_url': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 'unit': 'per 100g'},
        {'name': 'Chat Masala', 'price': 85, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a0b78378ac63?w=400', 'unit': 'per 100g'},
        {'name': 'Sambar Powder', 'price': 110, 'image_url': 'https://images.unsplash.com/photo-1599909734744-8ab8d0936ec8?w=400', 'unit': 'per 100g'},
        {'name': 'Tandoori Masala', 'price': 130, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a0b78378ac63?w=400', 'unit': 'per 100g'},
    ]

    for item in masala_data:
        Product.objects.get_or_create(name=item['name'], category=masala, defaults=item)

    # Oral Care
    oral_care_data = [
        {'name': 'Premium Bamboo Toothbrush', 'price': 45, 'image_url': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 'unit': 'per piece'},
        {'name': 'Colgate MaxFresh Gel', 'price': 95, 'image_url': 'https://images.unsplash.com/photo-1559599101-f09722fb4925?w=400', 'unit': 'per 150g'},
        {'name': 'Sensodyne Sensitive Repair', 'price': 120, 'image_url': 'https://images.unsplash.com/photo-1559599101-f09722fb4925?w=400', 'unit': 'per 100g'},
        {'name': 'Oral-B CrossAction Brush', 'price': 35, 'image_url': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 'unit': 'per piece'},
        {'name': 'CloseUp Red Hot Gel', 'price': 85, 'image_url': 'https://images.unsplash.com/photo-1559599101-f09722fb4925?w=400', 'unit': 'per 150g'},
    ]

    for item in oral_care_data:
        Product.objects.get_or_create(name=item['name'], category=oral_care, defaults=item)

    # Personal Care
    personal_care_data = [
        {'name': 'Dove Beauty Bath Soap', 'price': 60, 'image_url': 'https://images.unsplash.com/photo-1607006342456-ba274cd236b0?w=400', 'unit': 'per piece'},
        {'name': 'Sunsilk Black Shine Shampoo', 'price': 180, 'image_url': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400', 'unit': 'per 340ml'},
        {'name': 'Dettol Original Protection Soap', 'price': 40, 'image_url': 'https://images.unsplash.com/photo-1607006342456-ba274cd236b0?w=400', 'unit': 'per piece'},
        {'name': 'L\'Oreal Total Repair Shampoo', 'price': 240, 'image_url': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400', 'unit': 'per 200ml'},
        {'name': 'Pears Pure & Gentle Soap', 'price': 55, 'image_url': 'https://images.unsplash.com/photo-1607006342456-ba274cd236b0?w=400', 'unit': 'per piece'},
        {'name': 'Head & Shoulders Cool Menthol', 'price': 190, 'image_url': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400', 'unit': 'per 180ml'},
    ]

    for item in personal_care_data:
        Product.objects.get_or_create(name=item['name'], category=personal_care, defaults=item)

    print(f"Database populated successfully!")
    print(f"Categories: {Category.objects.count()}")
    print(f"Products: {Product.objects.count()}")


if __name__ == '__main__':
    populate_database()
