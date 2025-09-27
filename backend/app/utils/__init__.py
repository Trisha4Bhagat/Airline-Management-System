"""
Utility module for helper functions.
"""
from .date_utils import get_current_utc_time, format_date, add_days, calculate_flight_duration
from .string_utils import slugify, truncate_string, extract_initials

__all__ = [
    'get_current_utc_time', 
    'format_date', 
    'add_days',
    'calculate_flight_duration',
    'slugify',
    'truncate_string',
    'extract_initials'
]