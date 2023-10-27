# import pandas as pd
# import os
# import json
# import sys
# import logging
# import pyxlsb  # For pyxlsb library
# from pyexcel_xlsx import get_data  # For pyexcel-xlsx library

# if len(sys.argv) != 2:
#     logging.error("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# input_file = sys.argv[1]
# logging.info(f"Received input file: {input_file}")

# # Configure the logger
# logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# # Function to parse and process a CSV or XLSX file
# def parse_to_json(input_file):
#     data = []

#     # Determine the file format based on the file extension
#     file_extension = os.path.splitext(input_file)[1].lower()

#     try:
#         if file_extension == '.csv':
#             df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
#         elif file_extension == '.xlsx':
#             # Try using openpyxl for XLSX files
#             df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
#         else:
#             logging.error(f"Unsupported file format: {file_extension}")
#             sys.exit(1)

#         for index, row in df.iterrows():
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 # Print each JSON object as a separate line
#                 print(json.dumps(filtered_result, ensure_ascii=False))
#     except Exception as e:
#         logging.warning(f"Error using the first library: {str(e)}")

#         try:
#             # Attempt parsing with pyxlsb for XLSX files
#             with open(input_file, 'rb') as wb:
#                 with pyxlsb.open_workbook(wb) as wb:
#                     with wb.get_sheet(1) as sheet:
#                         for row in sheet.rows():
#                             filtered_result = {str(cell.column_name): cell.v for cell in row}
#                             if any(filtered_result.values()):
#                                 # Print each JSON object as a separate line
#                                 print(json.dumps(filtered_result, ensure_ascii=False))
#         except Exception as e:
#             logging.warning(f"Error using pyxlsb: {str(e)}")

#         try:
#             # Attempt parsing with pyexcel-xlsx for XLSX files
#             xls_data = get_data(input_file)
#             for sheet_name, sheet in xls_data.items():
#                 for row in sheet:
#                     filtered_result = {str(index): cell for index, cell in enumerate(row)}
#                     if any(filtered_result.values()):
#                         # Print each JSON object as a separate line
#                         print(json.dumps(filtered_result, ensure_ascii=False))
#         except Exception as e:
#             logging.warning(f"Error using pyexcel-xlsx: {str(e)}")

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     parse_to_json(input_file)
# import pandas as pd
# import os
# import sys
# import pyxlsb
# from pyexcel_xlsx import get_data
# from pymongo import MongoClient
# from hashlib import sha256
# from datetime import datetime

# # Check if the correct number of command-line arguments is provided
# if len(sys.argv) != 2:
#     print("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# # Get the input file from the command-line arguments
# input_file = sys.argv[1]

# # Function to generate a unique identifier for a file
# def generate_unique_identifier(file_path):
#     # Combine file name, file size, and timestamp
#     file_name = os.path.basename(file_path)
#     file_size = os.path.getsize(file_path)
#     timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
#     # Create a unique hash based on the combination
#     identifier = sha256(f"{file_name}{file_size}{timestamp}".encode()).hexdigest()
    
#     return identifier

# # Function to parse and process a CSV or XLSX file
# def parse_to_json_and_store(input_file):
#     data = []

#     # Generate a unique identifier for this file
#     unique_identifier = generate_unique_identifier(input_file)

#     # Determine the file format based on the file extension
#     file_extension = os.path.splitext(input_file)[1].lower()

#     try:
#         if file_extension == '.csv':
#             # Use pandas to read CSV file
#             df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
#         elif file_extension == '.xlsx':
#             # Try using openpyxl for XLSX files
#             df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
#         else:
#             print(f"Unsupported file format: {file_extension}")
#             sys.exit(1)

#         for index, row in df.iterrows():
#             # Create a dictionary for each row, excluding null values
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 # Add the unique identifier to the data
#                 filtered_result['unique_identifier'] = unique_identifier
#                 data.append(filtered_result)
#     except Exception as e:
#         print(f"Error using the first library: {str(e)}")

#     try:
#         # Attempt parsing with pyxlsb for XLSX files
#         with open(input_file, 'rb') as wb:
#             with pyxlsb.open_workbook(wb) as wb:
#                 with wb.get_sheet(1) as sheet:
#                     for row in sheet.rows():
#                         # Create a dictionary for each row using column names
#                         filtered_result = {str(cell.column_name): cell.v for cell in row}
#                         if any(filtered_result.values()):
#                             # Add the unique identifier to the data
#                             filtered_result['unique_identifier'] = unique_identifier
#                             data.append(filtered_result)
#     except Exception as e:
#         print(f"Error using pyxlsb: {str(e)}")

#     try:
#         # Attempt parsing with pyexcel-xlsx for XLSX files
#         xls_data = get_data(input_file)
#         for sheet_name, sheet in xls_data.items():
#             for row in sheet:
#                 # Create a dictionary for each row using index
#                 filtered_result = {str(index): cell for index, cell in enumerate(row)}
#                 if any(filtered_result.values()):
#                     # Add the unique identifier to the data
#                     filtered_result['unique_identifier'] = unique_identifier
#                     data.append(filtered_result)
#     except Exception as e:
#         print(f"Error using pyexcel-xlsx: {str(e)}")

#     # Store data in the database
#     client = MongoClient("mongodb://localhost:27017")
#     db = client["grid"]
#     collection = db["gridData"]
#     collection.insert_many(data)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     parse_to_json_and_store(input_file)





# import pandas as pd
# import os
# import sys
# from pymongo import MongoClient
# from hashlib import sha256
# from datetime import datetime
# import json

# # Check if the correct number of command-line arguments is provided
# if len(sys.argv) != 2:
#     print("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# # Get the input file from the command-line arguments
# input_file = sys.argv[1]

# # Function to generate a unique identifier for a file
# def generate_unique_identifier(file_path):
#     # Combine file name, file size, and timestamp
#     file_name = os.path.basename(file_path)
#     file_size = os.path.getsize(file_path)
#     timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
#     # Create a unique hash based on the combination
#     identifier = sha256(f"{file_name}{file_size}{timestamp}".encode()).hexdigest()
    
#     return identifier
# def generate_fileName(file_path):
#     # Combine file name, file size, and timestamp
#     file_name = os.path.basename(file_path)
#     return file_name

# # Function to parse and process a CSV or XLSX file
# def parse_to_json_and_store(input_file):
#     data = []

#     # Generate a unique identifier for this file
#     unique_identifier = generate_unique_identifier(input_file)

# # filename

#     file_name = generate_fileName(input_file)
#     # Initialize the key counter
#     key_counter = 1

#     # Determine the file format based on the file extension
#     file_extension = os.path.splitext(input_file)[1].lower()

#     try:
#         if file_extension == '.csv':
#             # Use pandas to read CSV file
#             df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
#         elif file_extension == '.xlsx':
#             # Try using openpyxl for XLSX files
#             df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
#         else:
#             print(f"Unsupported file format: {file_extension}")
#             sys.exit(1)

#         for index, row in df.iterrows():
#             # Create a dictionary for each row, excluding null values
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 # Add the unique identifier and the incremental key to the data
#                 filtered_result['unique_identifier'] = unique_identifier
#                 filtered_result['key'] = key_counter
#                 filtered_result['file_name']=file_name
#                 data.append(filtered_result)
#                 key_counter += 1
#     except Exception as e:
#         print(f"Error using the first library: {str(e)}")


#     # Store data in the database
#     client = MongoClient("mongodb://localhost:27017")
#     db = client["grid"]
#     collection = db["gridData"]
#     collection.insert_many(data)
    
#     # Return the unique identifier as a JSON object
#     unique_identifier_json = json.dumps({"unique_identifier": unique_identifier})
#     print(unique_identifier_json)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     parse_to_json_and_store(input_file)




import pandas as pd
import os
import sys
from pymongo import MongoClient
from hashlib import sha256
from datetime import datetime
import json

# Check if the correct number of command-line arguments is provided
if len(sys.argv) != 2:
    print("Usage: processCsv.py <input_file>")
    sys.exit(1)

# Get the input file from the command-line arguments
input_file = sys.argv[1]

# Function to generate a unique identifier for a file
def generate_unique_identifier(file_path):
    # Combine file name, file size, and timestamp
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Create a unique hash based on the combination
    identifier = sha256(f"{file_name}{file_size}{timestamp}".encode()).hexdigest()
    
    return identifier

def generate_fileName(file_path):
    # Combine file name, file size, and timestamp
    file_name = os.path.basename(file_path)
    return file_name

# Function to parse and process a CSV or XLSX file
def parse_to_json_and_store(input_file):
    data = []

    # Generate a unique identifier for this file
    unique_identifier = generate_unique_identifier(input_file)

    # filename
    file_name = generate_fileName(input_file)

    # Initialize the key counter
    key_counter = 1

    # Determine the file format based on the file extension
    file_extension = os.path.splitext(input_file)[1].lower()

    try:
        if file_extension == '.csv':
            # Use pandas to read CSV file
            df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
        elif file_extension == '.xlsx':
            # Convert Excel to CSV using pandas
            csv_filename = f"temp_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
            df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
            df.to_csv(csv_filename, index=False, encoding='utf-8')
            input_file = csv_filename  # Update input file to use the generated CSV
            file_extension = '.csv'  # Update the file extension
        else:
            print(f"Unsupported file format: {file_extension}")
            sys.exit(1)

        for index, row in df.iterrows():
            # Create a dictionary for each row, excluding null values
            filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
            if len(filtered_result) > 0:
                # Add the unique identifier and the incremental key to the data
                filtered_result['unique_identifier'] = unique_identifier
                filtered_result['key'] = key_counter
                filtered_result['file_name'] = file_name
                data.append(filtered_result)
                key_counter += 1
    except Exception as e:
        print(f"Error: {str(e)}")

    # Store data in the database
    client = MongoClient("mongodb://localhost:27017")
    db = client["grid"]
    collection = db["gridData"]
    collection.insert_many(data)
    
    # Return the unique identifier as a JSON object
    unique_identifier_json = json.dumps({"unique_identifier": unique_identifier})
    print(unique_identifier_json)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: processCsv.py <input_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    parse_to_json_and_store(input_file)
