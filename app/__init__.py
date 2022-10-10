from flask import Flask
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from db import db
from .models.user import User
from .models.car import Car
from flask_cors import CORS
import os

jwt = JWTManager()
def create_app(test_config=None):

    app = Flask(__name__, instance_relative_config=True)
    # read setting
    app.config.from_object("settings")
    
    if test_config is not None:
        app.config.from_mapping(test_config)

    # フロントエンドがCookieをAPIに送信できるようにする。
    CORS(app, resources={
     '/*': {'origins': os.getenv('FRONTEND_ORIGIN'), 'supports_credentials': True}})

    # initialize jwt Marshmallow
    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        """ import parts """
        from .api import login, memu, items, users, car, carCreate
        """ register Blueprints """
        ## ここに増やす
        app.register_blueprint(login.login_bp)
        app.register_blueprint(memu.menu_bp)
        app.register_blueprint(items.items_bp)
        app.register_blueprint(users.users_bp)
        app.register_blueprint(car.car_bp)
        app.register_blueprint(carCreate.carCreate_bp)
        
        # Flask Login
        login_manager = LoginManager()
        login_manager.init_app(app)
         ##ログインされていない場合はここに遷移
        login_manager.login_view = "login_bp.index"
        
    return app, login_manager

# Export app
app, login_manager = create_app()

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

# 認証ユーザの呼び出し
@login_manager.user_loader
def load_user(id):
    # login_requiredデコレータを設定したメソッドでコールされる
    # ここでユーザの権限云々もできるが、全体的な持ち回りになりそうなので
    # 個別のapiで実装するようにしたほうがベターでは。。。
    print('load_user')
    return User.query.get(int(id))
