import os
import datetime

FLASK_ENV = "development"
ENV = "development"
PORT = "3000"
DEBUG = True
SECRET_KEY = 'target-management-crypto-key'
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:Tu001637%@localhost/target_management?charset=utf8'
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_ECHO = True
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=10)
JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=15)
JWT_TOKEN_LOCATION = ['cookies']
JWT_COOKIE_SAMESITE = 'Strict'
JWT_COOKIE_SECURE = False
JWT_COOKIE_CSRF_PROTECT = True 
JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN-ACCESS"
JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN-REFRESH"
SERVER_NAME = "localhost:5000"
