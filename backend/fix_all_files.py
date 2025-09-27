import os
import sys

def fix_all_files(directory):
    """
    Recursively fixes all Python files by removing null bytes and BOM markers.
    """
    fixed_files = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    # Read the file as binary
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    # Check for BOM marker (0xEF,0xBB,0xBF for UTF-8)
                    if content.startswith(b'\xef\xbb\xbf'):
                        content = content[3:]
                        print(f"Removed BOM marker from {file_path}")
                    
                    # Check for other common encoding markers
                    if content.startswith(b'\xff\xfe') or content.startswith(b'\xfe\xff'):
                        content = content[2:]
                        print(f"Removed UTF-16 BOM marker from {file_path}")
                    
                    # Remove null bytes
                    if b'\x00' in content:
                        content = content.replace(b'\x00', b'')
                        print(f"Removed null bytes from {file_path}")
                    
                    # Write back to file
                    with open(file_path, 'wb') as f:
                        f.write(content)
                    
                    fixed_files.append(file_path)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return fixed_files

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_all_files.py <directory>")
        sys.exit(1)
    
    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        sys.exit(1)
    
    fixed = fix_all_files(directory)
    print(f"Processed {len(fixed)} files")