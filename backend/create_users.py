import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

users = [
    {'username': 'admin', 'password': 'Abc@#123', 'role': 'admin'},
    {'username': 'client', 'password': 'Abc@#123', 'role': 'client'},
    {'username': 'hr', 'password': 'Abc@#123', 'role': 'hr'},
    {'username': 'teamlead', 'password': 'Abc@#123', 'role': 'teamlead'},
    {'username': 'employee', 'password': 'Abc@#123', 'role': 'employee'},
    {'username': 'manager', 'password': 'Abc@#123', 'role': 'manager'},
]

for user_data in users:
    if not User.objects.filter(username=user_data['username']).exists():
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password'],
            role=user_data['role']
        )
        print(f"Created user: {user.username} with role {user.role}")
    else:
        print(f"User {user_data['username']} already exists")
