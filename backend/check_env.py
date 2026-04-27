import os
from decouple import config
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
print(f"BASE_DIR: {BASE_DIR}")
print(f"CLOUDINARY_CLOUD_NAME: {config('CLOUDINARY_CLOUD_NAME', default='NOT FOUND')}")
print(f"CLOUDINARY_API_KEY: {config('CLOUDINARY_API_KEY', default='NOT FOUND')}")
print(f"CLOUDINARY_API_SECRET: {config('CLOUDINARY_API_SECRET', default='NOT FOUND')}")
