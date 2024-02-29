# server/microservices/flightService/config.py
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
SKYSCANNER_RATE_LIMIT_PERIOD = 60 # Seconds

# Rate Limiting Configuration
FLASK_RATELIMIT_ENABLED = True  # Flag to enable/disable rate limiting
# Adjust these based on your standard Skyscanner limits and potential upgrades
RATE_LIMIT = os.getenv('RATE_LIMIT', '100/60')  # Example rate limit
RATE_LIMIT_CREATE_SEARCH = '100/60'   
RATE_LIMIT_POLL_SEARCH = '500/60'
RATE_LIMIT_OTHER_ENDPOINTS = '500/60'  # For Culture, Geo, etc.

# Consider storing the rate limits below in a Redis store
# for globally shared limits in a distributed environment
RATE_LIMIT_STORAGE = 'memory'  # In-memory storage (simple for this example)