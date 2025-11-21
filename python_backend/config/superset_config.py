import os

SECRET_KEY = os.getenv('SUPERSET_SECRET_KEY', 'your-secret-key-here-change-in-production')

SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://localhost/retail_analytics')

if SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)

ROW_LIMIT = 5000

SUPERSET_WEBSERVER_PORT = 8088

WTF_CSRF_ENABLED = True

PUBLIC_ROLE_LIKE = 'Gamma'

FEATURE_FLAGS = {
    'ENABLE_TEMPLATE_PROCESSING': True,
    'DASHBOARD_NATIVE_FILTERS': True,
    'DASHBOARD_CROSS_FILTERS': True,
    'DASHBOARD_RBAC': True,
}

ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*']
}

CACHE_CONFIG = {
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': 300
}

DATA_CACHE_CONFIG = CACHE_CONFIG

LANGUAGES = {
    'en': {'flag': 'us', 'name': 'English'},
    'ar': {'flag': 'sa', 'name': 'Arabic'},
}
