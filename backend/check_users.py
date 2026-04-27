import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tourvista.settings.base')
django.setup()

from tourvista.apps.users.models import User

print("--- User List with Display Name ---")
for user in User.objects.all():
    print(f"ID: {user.id}, Username: {user.username}, Display Name: '{user.display_name}', Email: {user.email}")
