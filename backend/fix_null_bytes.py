import os
import sys

def find_and_fix_null_bytes(directory):
    """
    Find and fix null bytes in Python files in the given directory
    """
    fixed_files = 0
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    if b'\x00' in content:
                        print(f"Found null bytes in {file_path}")
                        content = content.replace(b'\x00', b'')
                        
                        with open(file_path, 'wb') as f:
                            f.write(content)
                        
                        print(f"Fixed {file_path}")
                        fixed_files += 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return fixed_files

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_null_bytes.py <directory>")
        sys.exit(1)
    
    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        sys.exit(1)
    
    fixed = find_and_fix_null_bytes(directory)
    print(f"Fixed {fixed} files")