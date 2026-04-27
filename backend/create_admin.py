from django.contrib.auth import get_user_model
User = get_user_model()
try:
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@tourvista.com', 'admin123')
        print('Superuser created successfully')
    else:
        u = User.objects.get(username='admin')
        u.set_password('admin123')
        u.is_staff = True
        u.is_superuser = True
        u.save()
        print('Superuser updated successfully')
except Exception as e:
    print('ERROR:', e)
