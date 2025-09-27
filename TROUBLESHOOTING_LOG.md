# Troubleshooting Log

This log documents my journey through challenging technical issues I encountered while developing the Airline Management System. It captures the problems I faced, how I diagnosed them, and the solutions I implemented.

## Session 2: September 26, 2025

### Issue: Null Byte Characters in Python Files

#### Error Message
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x00 in position 1234: invalid continuation byte
```

#### My Experience
As someone new to FastAPI, this error was particularly challenging. I spent nearly 4 hours trying to understand what was happening with these strange null byte errors. The server kept crashing on startup with cryptic encoding errors that didn't make immediate sense to me.

#### Root Cause
After much investigation, I discovered that some of the Python files contained null byte characters (0x00) that were corrupting the files. These invisible characters were preventing the Python interpreter from properly reading the files. I later learned these null bytes can be introduced during file transfers or by certain text editors.

#### Solution I Implemented
With some guidance from documentation and online resources, I wrote my first Python utility script to:

1. Detect files containing null bytes
2. Remove the null bytes while preserving file content
3. Rewrite the files with proper UTF-8 encoding

Here's the script I created:

```python
def detect_null_bytes(file_path):
    with open(file_path, 'rb') as file:
        content = file.read()
    
    # Check for null bytes
    has_null_bytes = b'\x00' in content
    return has_null_bytes, content.count(b'\x00')

def remove_null_bytes(file_path):
    with open(file_path, 'rb') as file:
        content = file.read()
    
    # Remove null bytes
    content_fixed = content.replace(b'\x00', b'')
    
    with open(file_path, 'wb') as file:
        file.write(content_fixed)
    
    return len(content) - len(content_fixed)

# Script to check all Python files in a directory
import os

def fix_all_files(directory):
    fixed_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                has_nulls, count = detect_null_bytes(filepath)
                if has_nulls:
                    bytes_removed = remove_null_bytes(filepath)
                    fixed_files.append((filepath, bytes_removed))
                    print(f"Fixed {filepath}: removed {bytes_removed} null bytes")
    
    return fixed_files

# Run the script
fixed = fix_all_files("./app")
print(f"Fixed {len(fixed)} files")
```

#### Verification
After applying my fix:
1. The server started successfully without encoding errors
2. All API endpoints were functional
3. I could interact with the database properly

#### Personal Reflection
While this issue was frustrating, I'm proud of how I persevered through it. As someone new to this , debugging binary file encoding issues was definitely outside my comfort zone. This experience taught me valuable lessons about how files are encoded and how to use Python for file manipulation tasks.

The satisfaction of seeing the server finally start up correctly after hours of debugging was incredible. It reinforced my belief that with persistence, I can overcome technical challenges even when working with unfamiliar technologies.