""" login logout API """
from flask import Blueprint, render_template, request, session, jsonify, make_response, Flask
from flask_login import login_user, logout_user, login_required
from db import db
from ..models.user import User
from ..models.login import Login
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_jwt_cookies, unset_refresh_cookies, jwt_required
from app import jwt
from ..models.user import User, UserSchema
import logging

# webpackからもjsが参照できるようにflask側で調整
# 静的ファイルの場所とURLパスを変更
login_bp = Blueprint(
    "login_bp", __name__, template_folder="templates", 
    static_url_path="/dist", static_folder= "../templates/dist"
)

@login_bp.route("/", methods=["GET"])
def index():
    """
        index
        ホスティングサービスが無いのでReactを導入した
        index.htmlを返却する
    """
    return render_template("index.html")

@login_bp.route("/api/login", methods=["POST"])
def do_login():
    params = request.get_json()

    # なんちゃってモデルに設定
    login = Login(params)
    # とりあえず入力チェック
    if not login.valid():
        # だめなら400で終了
        return jsonify({'errors': login.errors}), 400

    # SQLAlchemy(User)
    user = db.session.query(User).filter(
        User.login_id == params['loginId'], 
        User.password == params['password'], 
    ).one_or_none()

    # ヒットしなかった場合は404
    if not user:
        return jsonify({'errors': {'invalid': 'ログインIDまたはパスワードが間違っています。'}}), 404
    
    # アクセストークンの生成
    access_token = create_access_token(identity=user)
    refresh_token = create_refresh_token(identity=user)
    response = make_response()
    # クッキーにアクセストークンを配置する。
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    response.set_cookie('access_token', access_token)
    response.set_cookie('csrf_access_token', refresh_token)
    return response, 200

# @jwt.user_identity_loaderはcreate_access_tokenが使用される度に呼び出される関数
# アクセストークンに追加するCustom claimsを定義する
@jwt.user_identity_loader
def identity_user(user):
    return user.id

# claimを追加する。
# create_access_token(..)実行時に起動する。
@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return {
        'department': 'CTO Office',
        'manager_role_attached': False
    }

@login_bp.route("/api/logout", methods=["GET"])
@jwt_required()
def logout():
    # ログアウト処理及びセッションクリア
    response = make_response()
    # cookieから取り除く。
    unset_access_cookies(response)
    unset_jwt_cookies(response)
    unset_refresh_cookies(response)
    response.set_cookie('access_token', '', expires=0)
    response.set_cookie('csrf_access_token', '', expires=0)
    return response, 200
