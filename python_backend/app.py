import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, send_from_directory
from flask_cors import CORS
from python_backend.config.database import init_db
from python_backend.routes.api_routes import api_bp

def create_app():
    build_path = os.path.join(os.path.dirname(__file__), '..', 'dist', 'public')
    build_path = os.path.abspath(build_path)
    app = Flask(__name__, static_folder=build_path, static_url_path=None)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    init_db(app)
    
    app.register_blueprint(api_bp)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        static_folder = app.static_folder
        if static_folder and path and os.path.exists(os.path.join(static_folder, path)):
            return send_from_directory(static_folder, path)
        if static_folder:
            return send_from_directory(static_folder, 'index.html')
        return {'error': 'Static folder not configured'}, 500
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'version': '1.0.0'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
