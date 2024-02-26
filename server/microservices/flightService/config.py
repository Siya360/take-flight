import os
from dotenv import load_dotenv

# Load environment variables
env_name = os.getenv('FLASK_ENV', 'development')  
dotenv_path = 'server/.env.development' 
load_dotenv(dotenv_path)    

# Skyscanner Retry Configuration 
SKYSCANNER_MAX_RETRIES = int(os.getenv('SKYSCANNER_MAX_RETRIES', 3)) # Default to 3
SKYSCANNER_BASE_WAIT_SECONDS = int(os.getenv('SKYSCANNER_BASE_WAIT_SECONDS', 10))
SKYSCANNER_MAX_JITTER_SECONDS = int(os.getenv('SKYSCANNER_MAX_JITTER_SECONDS', 5))
