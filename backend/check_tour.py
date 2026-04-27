import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tourvista.settings.base')
django.setup()

from tourvista.apps.destinations.models import TourPackage

tour = TourPackage.objects.get(id=1)
print(f"Tour Name: {tour.name}")
print(f"Main Image Type: {type(tour.main_image)}")
print(f"Main Image Value: {tour.main_image}")
if tour.main_image:
    print(f"Main Image URL: {tour.main_image.url if hasattr(tour.main_image, 'url') else 'No URL'}")
    print(f"Main Image Public ID: {tour.main_image.public_id if hasattr(tour.main_image, 'public_id') else 'No Public ID'}")
