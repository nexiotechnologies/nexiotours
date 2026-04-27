import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tourvista.settings.base')
django.setup()

from tourvista.apps.blog.models import BlogPost
from tourvista.apps.users.models import User
from django.utils.text import slugify

def seed_blog():
    admin_user = User.objects.filter(is_staff=True).first()
    if not admin_user:
        print("No admin user found. Please create one with 'python manage.py createsuperuser'")
        return

    sample_posts = [
        {
            "title": "Hidden Paradise: The Secret Waterfalls of Bali",
            "category": "Travel Guide",
            "excerpt": "Escape the crowds and discover the untouched beauty of Bali's hidden cascades in the heart of the jungle.",
            "cover_image": "https://images.unsplash.com/photo-1512100356956-c1227c396059?auto=format&fit=crop&w=1200&q=80",
            "content": """Bali is famous for its beaches, but the real magic lies deep within its lush jungles. ...""",
            "is_featured": True,
            "status": "published"
        },
        {
            "title": "A Foodie's Guide to Mumbai's Night Markets",
            "category": "Food & Culture",
            "excerpt": "From spicy Vada Pav to sweet Jalebis, we explore the vibrant flavors of Mumbai after the sun goes down.",
            "cover_image": "https://images.unsplash.com/photo-1518013391915-e443195da9a0?auto=format&fit=crop&w=1200&q=80",
            "content": """Mumbai never sleeps, and neither do its street food stalls. ...""",
            "is_featured": False,
            "status": "published"
        },
        {
            "title": "Mastering the Art of Carry-On Travel",
            "category": "Tips & Tricks",
            "excerpt": "Pack like a pro with our ultimate guide to living out of a single bag for any length of trip.",
            "cover_image": "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1200&q=80",
            "content": """Travel is about freedom, and nothing says freedom like skipping the baggage claim. ...""",
            "is_featured": False,
            "status": "published"
        },
        {
            "title": "Sky-High Luxury: The Best Rooftop Bars in Dubai",
            "category": "Luxury",
            "excerpt": "Sip cocktails under the stars while overlooking the world's most stunning skyline.",
            "cover_image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
            "content": """Dubai's skyline is a testament to human ambition, and there's no better place to witness it than from above. ...""",
            "is_featured": False,
            "status": "published"
        }
    ]

    for data in sample_posts:
        obj = BlogPost.objects.filter(title=data['title']).first()
        if obj:
            obj.cover_image = data['cover_image']
            obj.save()
            print(f"Updated: {data['title']}")
        else:
            BlogPost.objects.create(
                author=admin_user,
                slug=slugify(data['title']),
                **data
            )
            print(f"Created: {data['title']}")

if __name__ == "__main__":
    seed_blog()
