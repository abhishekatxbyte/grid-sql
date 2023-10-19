from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_csv_xlsx_to_json():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.filename.endswith('.xlsx'):
                df = pd.read_excel(file, engine='openpyxl')
            else:
                return jsonify({'error': 'File format not supported'}), 400

            json_data = df.to_json(orient='records')

            return jsonify({'data': json_data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
