import sys
print(sys.path)  # Check environment paths

from pybreaker import CircuitBreaker 

cb = CircuitBreaker()  
print('Import successful!')
