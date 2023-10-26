import pandas as pd
import os
import json
import sys
import logging
if len(sys.argv) != 2:
    logging.error("Usage: processCsv.py <input_file>")
    sys.exit(1)

input_file = sys.argv[1]
logging.info(f"Received input file: {input_file}")

# Configure the logger
logging.basicConfig(filename='csv_processing.log', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Function to parse and process a CSV file
def parse_csv_to_json(input_file):
    data = []
    with open(input_file, 'r', encoding='utf-8') as file:
        # You can customize the options as needed
        df = pd.read_csv(file, header=0, encoding='utf-8', dtype=None)
        for index, row in df.iterrows():
            filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
            if len(filtered_result) > 0:
                data.append(filtered_result)
    return data

# Function to parse and process an Excel file
def parse_excel_to_json(input_file):
    data = []
    df = pd.read_excel(input_file, header=0, dtype=None)
    for index, row in df.iterrows():
        filtered_result = {key: row[key] for key in row.index if not pd.isnull(row[key])}
        if len(filtered_result) > 0:
            data.append(filtered_result)
    return data

def process_file(input_file):
    if os.path.exists(input_file):
        if input_file.lower().endswith('.csv'):
            data = parse_csv_to_json(input_file)
            logging.info(f"Processed {input_file} as CSV")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        elif input_file.lower().endswith('.xlsx'):
            data = parse_excel_to_json(input_file)
            logging.info(f"Processed {input_file} as Excel")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            logging.error(f"Unsupported file format: {input_file}")
            sys.exit(1)
    else:
        logging.error(f"File not found: {input_file}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logging.error("Usage: processCsv.py <input_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    process_file(input_file)
