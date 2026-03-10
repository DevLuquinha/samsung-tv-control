import os
import json
import ssl
import logging
from flask import Flask, jsonify
from websocket import create_connection, WebSocketTimeoutException
from dotenv import load_dotenv

# 1. Config logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)

class SamsungTVService:
    """Service to connect websocket with samsung tv."""
    
    def __init__(self):
        self.tv_ip = os.getenv("TV_IP")
        self.tv_token = os.getenv("TV_TOKEN")
        self.tv_name = os.getenv("TV_NAME")

        if not all([self.tv_ip, self.tv_token, self.tv_name]):
            logger.error("TV configuration is incomplete. Please check your .env file.")

    def send_command(self, key: str) -> tuple[bool, str]:
        """Send a command to TV and returns a tuple (success, errorMessage)."""
        url = f"wss://{self.tv_ip}:8002/api/v2/channels/samsung.remote.control?name={self.tv_name}&token={self.tv_token}"
        
        payload = {
            "method": "ms.remote.control",
            "params": {
                "Cmd": "Click",
                "DataOfCmd": key.upper(),
                "Option": "false",
                "TypeOfRemote": "SendRemoteKey"
            }
        }

        try:
            # Ignore SSL certificate errors since TV uses self-signed certs
            ws = create_connection(url, sslopt={"cert_reqs": ssl.CERT_NONE}, timeout=3)
            ws.send(json.dumps(payload))
            ws.close()
            
            logger.info(f"Command {key.upper()} send successfully.")
            return True, ""
            
        except WebSocketTimeoutException:
            logger.warning(f"Timeout when trying to connect to the TV ({self.tv_ip}). Is the TV on?")
            return False, "Timeout: The TV did not respond in time."
        except Exception as e:
            logger.error(f"Unexpected error when sending command: {e}")
            return False, str(e)

# 2. Create the TV service instance
tv_service = SamsungTVService()

@app.route('/send/<key>', methods=['GET'])
def send_key(key: str):
    """Endpoint (Controller) to receive the HTTP request and forward it to the TV."""
    success, error_msg = tv_service.send_command(key)
    
    if success:
        return jsonify({"status": "success", "key": key.upper()}), 200
    else:
        return jsonify({"status": "error", "message": error_msg}), 500

if __name__ == '__main__':
    logger.info("Starting TV Control API on port 5000...")
    app.run(host='0.0.0.0', port=5000)