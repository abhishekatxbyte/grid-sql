# import pandas as pd
# import os
# import json
# import sys
# import logging
# if len(sys.argv) != 2:
#     logging.error("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# input_file = sys.argv[1]
# logging.info(f"Received input file: {input_file}")

# # Configure the logger
# logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# # Function to parse and process a CSV file
# def parse_csv_to_json(input_file):
#     data = []
#     with open(input_file, 'r', encoding='utf-8') as file:
#         # You can customize the options as needed
#         df = pd.read_csv(file, header=0, encoding='utf-8', dtype=None)
#         for index, row in df.iterrows():
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 data.append(filtered_result)
#     return data

# # Function to parse and process an Excel file
# def parse_excel_to_json(input_file):
#     data = []
#     df = pd.read_excel(input_file, header=0, dtype=None)
#     for index, row in df.iterrows():
#         filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#         if len(filtered_result) > 0:
#             data.append(filtered_result)
#     return data

# def process_file(input_file):
#     if os.path.exists(input_file):
#         if input_file.lower().endswith('.csv'):
#             data = parse_csv_to_json(input_file)
#             logging.info(f"Processed {input_file} as CSV")
#             print(json.dumps(data, indent=2, ensure_ascii=False))
#         elif input_file.lower().endswith('.xlsx'):
#             data = parse_excel_to_json(input_file)
#             logging.info(f"Processed {input_file} as Excel")
#             print(json.dumps(data, indent=2, ensure_ascii=False))
#         else:
#             logging.error(f"Unsupported file format: {input_file}")
#             sys.exit(1)
#     else:
#         logging.error(f"File not found: {input_file}")
#         sys.exit(1)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     process_file(input_file)

#  /this is the perfactly woking code for python



# import pandas as pd
# import os
# import json
# import sys
# import logging

# if len(sys.argv) != 2:
#     logging.error("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# input_file = sys.argv[1]
# logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logging.info(f"Received input file: {input_file}")

# # Function to parse and process a CSV file
# def parse_csv_to_json(input_file):
#     data = []
#     with open(input_file, 'r', encoding='utf-8') as file:
#         df = pd.read_csv(file, header=0, encoding='utf-8', dtype=None)
#         for index, row in df.iterrows():
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 data.append(filtered_result)
#     return data

# # Function to parse and process an Excel file
# def parse_excel_to_json(input_file):
#     data = []
#     try:
#         df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
#         for index, row in df.iterrows():
#             filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#             if len(filtered_result) > 0:
#                 data.append(filtered_result)
#         return data
#     except Exception as e:
#         logging.error(f"Error processing {input_file} as Excel: {str(e)}")
#         return None

# def process_file(input_file):
#     if os.path.exists(input_file):
#         if input_file.lower().endswith('.csv'):
#             data = parse_csv_to_json(input_file)
#             if data is not None:
#                 logging.info(f"Processed {input_file} as CSV")
#                 print(json.dumps(data, indent=2, ensure_ascii=False))
#         elif input_file.lower().endswith('.xlsx'):
#             data = parse_excel_to_json(input_file)
#             if data is not None:
#                 logging.info(f"Processed {input_file} as Excel")
#                 print(json.dumps(data, indent=2, ensure_ascii=False))
#         else:
#             logging.error(f"Unsupported file format: {input_file}")
#             sys.exit(1)
#     else:
#         logging.error(f"File not found: {input_file}")
#         sys.exit(1)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     process_file(input_file)

# /version4 working perfectly

# import pandas as pd
# import os
# import json
# import sys
# import logging

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

#     if file_extension == '.csv':
#         df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
#     elif file_extension == '.xlsx':
#         df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
#     else:
#         logging.error(f"Unsupported file format: {file_extension}")
#         sys.exit(1)

#     for index, row in df.iterrows():
#         filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#         if len(filtered_result) > 0:
#             # Print each JSON object as a separate line
#             print(json.dumps(filtered_result, ensure_ascii=False))

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     parse_to_json(input_file)

# running fine in csv not in large xlsx
# import pandas as pd
# import os
# import json
# import sys
# import logging
# from multiprocessing import Pool

# if len(sys.argv) != 2:
#     logging.error("Usage: processCsv.py <input_file>")
#     sys.exit(1)

# input_file = sys.argv[1]
# # logging.info(f"Received input file: "input_file")

# # Configure the logger
# logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# # Function to parse and process a CSV or XLSX file
# def parse_to_json(file_path):
#     data = []

#     # Determine the file format based on the file extension
#     file_extension = os.path.splitext(file_path)[1].lower()

#     if file_extension == '.csv':
#         df = pd.read_csv(file_path, header=0, encoding='utf-8', dtype=None)
#     elif file_extension == '.xlsx':
#         df = pd.read_excel(file_path, header=0, engine="openpyxl", dtype=None)
#     else:
#         logging.error(f"Unsupported file format: {file_extension}")
#         sys.exit(1)

#     for index, row in df.iterrows():
#         filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#         if len(filtered_result) > 0:
#             data.append(filtered_result)

#     return data

# def process_file(input_file):
#     # Check if the file exists
#     if not os.path.exists(input_file):
#         logging.error(f"File not found: {input_file}")
#         sys.exit(1)

#     # Define the number of CPU cores to use (adjust as needed)
#     num_cores = os.cpu_count()

#     # Create a pool of worker processes
#     with Pool(num_cores) as pool:
#         # Process the input file in parallel
#         results = pool.map(parse_to_json, [input_file])

#     # Merge the results from all processes
#     merged_results = [result for sublist in results for result in sublist]

#     # Print the merged JSON results
#     for item in merged_results:
#         print(json.dumps(item, ensure_ascii=False))

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     process_file(input_file)
# version6
# import pandas as pd
# import openpyxl
# import os
# import json
# import sys
# import logging

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
#         # Handle any exception that occurs during parsing with the first library
#         logging.warning(f"Error using the first library: {str(e)}")

#         try:
#             # Attempt parsing with a different library (xlrd in this case)
#             df = pd.read_excel(input_file, header=0, engine="xlrd", dtype=None)

#             for index, row in df.iterrows():
#                 filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
#                 if len(filtered_result) > 0:
#                     # Print each JSON object as a separate line
#                     print(json.dumps(filtered_result, ensure_ascii=False))
#         except Exception as e:
#             # Handle any exception that occurs during parsing with the second library
#             logging.error(f"Error using the second library: {str(e)}")

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         logging.error("Usage: processCsv.py <input_file>")
#         sys.exit(1)

#     input_file = sys.argv[1]
#     parse_to_json(input_file)
import pandas as pd
import os
import json
import sys
import logging
import pyxlsb  # For pyxlsb library
from pyexcel_xlsx import get_data  # For pyexcel-xlsx library

if len(sys.argv) != 2:
    logging.error("Usage: processCsv.py <input_file>")
    sys.exit(1)

input_file = sys.argv[1]
logging.info(f"Received input file: {input_file}")

# Configure the logger
logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Function to parse and process a CSV or XLSX file
def parse_to_json(input_file):
    data = []

    # Determine the file format based on the file extension
    file_extension = os.path.splitext(input_file)[1].lower()

    try:
        if file_extension == '.csv':
            df = pd.read_csv(input_file, header=0, encoding='utf-8', dtype=None)
        elif file_extension == '.xlsx':
            # Try using openpyxl for XLSX files
            df = pd.read_excel(input_file, header=0, engine="openpyxl", dtype=None)
        else:
            logging.error(f"Unsupported file format: {file_extension}")
            sys.exit(1)

        for index, row in df.iterrows():
            filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
            if len(filtered_result) > 0:
                # Print each JSON object as a separate line
                print(json.dumps(filtered_result, ensure_ascii=False))
    except Exception as e:
        logging.warning(f"Error using the first library: {str(e)}")

        try:
            # Attempt parsing with pyxlsb for XLSX files
            with open(input_file, 'rb') as wb:
                with pyxlsb.open_workbook(wb) as wb:
                    with wb.get_sheet(1) as sheet:
                        for row in sheet.rows():
                            filtered_result = {str(cell.column_name): cell.v for cell in row}
                            if any(filtered_result.values()):
                                # Print each JSON object as a separate line
                                print(json.dumps(filtered_result, ensure_ascii=False))
        except Exception as e:
            logging.warning(f"Error using pyxlsb: {str(e)}")

        try:
            # Attempt parsing with pyexcel-xlsx for XLSX files
            xls_data = get_data(input_file)
            for sheet_name, sheet in xls_data.items():
                for row in sheet:
                    filtered_result = {str(index): cell for index, cell in enumerate(row)}
                    if any(filtered_result.values()):
                        # Print each JSON object as a separate line
                        print(json.dumps(filtered_result, ensure_ascii=False))
        except Exception as e:
            logging.warning(f"Error using pyexcel-xlsx: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logging.error("Usage: processCsv.py <input_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    parse_to_json(input_file)
