"""
Utility functions for date and time operations.
"""
from datetime import datetime, timedelta

def get_current_utc_time():
    """
    Get the current UTC time.
    
    Returns:
        datetime: Current UTC datetime
    """
    return datetime.utcnow()

def format_date(date_obj, format_str="%Y-%m-%d"):
    """
    Format a date object to string.
    
    Args:
        date_obj (datetime): Date object to format
        format_str (str, optional): Format string. Defaults to "%Y-%m-%d".
    
    Returns:
        str: Formatted date string
    """
    return date_obj.strftime(format_str)

def add_days(date_obj, days):
    """
    Add days to a date object.
    
    Args:
        date_obj (datetime): Date object
        days (int): Number of days to add
    
    Returns:
        datetime: New date with days added
    """
    return date_obj + timedelta(days=days)

def calculate_flight_duration(departure_time, arrival_time):
    """
    Calculate the duration of a flight.
    
    Args:
        departure_time (datetime): Departure time
        arrival_time (datetime): Arrival time
    
    Returns:
        timedelta: Flight duration
    """
    return arrival_time - departure_time