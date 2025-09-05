import os
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPA_PROJECT_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")