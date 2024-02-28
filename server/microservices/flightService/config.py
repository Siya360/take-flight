# server/microservices/flightService/config.py
import os
from dotenv import load_dotenv
from pyrate_limiter import Duration, Rate

# Load environment variables
env_name = os.getenv('FLASK_ENV', 'development')  
dotenv_path = 'server/.env.development' 
load_dotenv(dotenv_path)    

# Skyscanner Retry Configuration 
SKYSCANNER_MAX_RETRIES = int(os.getenv('SKYSCANNER_MAX_RETRIES', 3)) # Default to 3
SKYSCANNER_BASE_WAIT_SECONDS = int(os.getenv('SKYSCANNER_BASE_WAIT_SECONDS', 10))
SKYSCANNER_MAX_JITTER_SECONDS = int(os.getenv('SKYSCANNER_MAX_JITTER_SECONDS', 5))
SKYSCANNER_RATE_LIMIT_PERIOD = 60 # Seconds

# Rate Limits with pyrate-limiter
SKYSCANNER_RATE_LIMITS = {
    'create_search': [Rate(100, Duration.MINUTE)],  # 100 requests per minute
    'poll_search': [Rate(500, Duration.MINUTE)],   # 500 requests per minute
}