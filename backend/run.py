from app import create_app
from waitress import serve
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = create_app()

if __name__ == '__main__':
    logging.info("Starting Waitress server on http://0.0.0.0:5001")
    serve(app, host='0.0.0.0', port=5001)