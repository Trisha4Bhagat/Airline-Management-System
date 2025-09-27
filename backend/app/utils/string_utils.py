"""
Utility functions for string and text operations.
"""

def slugify(text):
    """
    Convert a string to a URL-friendly slug.
    
    Args:
        text (str): The text to convert
    
    Returns:
        str: URL-friendly slug
    """
    # Convert to lowercase
    slug = text.lower()
    
    # Replace spaces with hyphens
    slug = slug.replace(' ', '-')
    
    # Remove special characters
    slug = ''.join(c for c in slug if c.isalnum() or c == '-')
    
    # Remove duplicate hyphens
    while '--' in slug:
        slug = slug.replace('--', '-')
    
    # Remove leading and trailing hyphens
    slug = slug.strip('-')
    
    return slug

def truncate_string(text, max_length=100, suffix='...'):
    """
    Truncate a string to a specified length.
    
    Args:
        text (str): The text to truncate
        max_length (int, optional): Maximum length. Defaults to 100.
        suffix (str, optional): Suffix to add. Defaults to '...'.
    
    Returns:
        str: Truncated string
    """
    if len(text) <= max_length:
        return text
    return text[:max_length].strip() + suffix

def extract_initials(name):
    """
    Extract initials from a name.
    
    Args:
        name (str): The name to extract initials from
    
    Returns:
        str: Initials
    """
    parts = name.split()
    initials = ''.join(part[0].upper() for part in parts if part)
    return initials