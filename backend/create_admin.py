import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uma_grocery.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'admin'
email = 'admin@umagrocery.com'
password = 'adminpassword'

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser '{username}'...")
    User.objects.create_superuser(
        username=username, 
        email=email, 
        password=password, 
        is_staff=True, 
        is_superuser=True,
        first_name='Admin',
        last_name='User'
    )
    print("Superuser created successfully!")
else:
    # Update password if it already exists to ensure they can log in
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Superuser '{username}' password updated successfully.")
