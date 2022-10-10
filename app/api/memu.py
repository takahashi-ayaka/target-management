""" menu api """
from flask import Blueprint, render_template, session, jsonify, make_response, Flask, request
from flask_login import login_required
from ..models.user import User
from flask_jwt_extended import current_user, jwt_required, unset_access_cookies, unset_jwt_cookies, unset_refresh_cookies
from app import jwt

# webpackからもjsが参照できるようにflask側で調整
# 静的ファイルの場所とURLパスを変更
menu_bp = Blueprint(
    "menu_bp", __name__, template_folder="templates", 
    static_url_path="/dist", static_folder= "../templates/dist"
)

# メニュー画面表示(直リンク用)
# URLを直接ぶっ叩かれた場合ログインしていなければログイン画面に遷移
@menu_bp.route("/menu", methods=["GET"])
@jwt_required()
def index():
    """ 
        index
        ホスティングサービスが無いのでReactを導入した
        index.htmlを返却する
    """
    return render_template("index.html")

# メニューの認証・権限取得
@menu_bp.route("/api/menu_auth", methods=["GET"])
@jwt_required()
def auth_check():
    # # tokenよりIDを取得
    user = User.query.get(current_user.id)
    return jsonify({'admin': user.is_administrator()}), 200


# @jwt_requiredが付与されている関数の実行前に起動する。
# @jwt_requiredを付与した関数の中で、current_user変数でここでreturnする値を参照できる。
@jwt.user_lookup_loader
def lookup_user(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

## @jwt_requiredが401エラーで返却されるとき、
## expired_token_loader,invalid_token_loader,unauthorized_loaderいずれかの内容である
# JWT が期限切れのとき
@jwt.expired_token_loader
def jwt_expired_token_callback(expired_token):
    token_type = expired_token['type']

    if token_type == 'access':
        return make_response(jsonify({
        'status': 'ACCESS_TOKEN_EXPIRED',
        'message': 'token expired',
        }), 401)
    else:
        return make_response(jsonify({
        'status': 'TOKEN_EXPIRED',
        'message': 'token expired',
        }), 401)

# JWT が invalid だったとき
@jwt.invalid_token_loader
def jwt_invalid_callback(error_string):
    return make_response(jsonify({
        'status': 'INVALID_TOKEN',
        'message': 'invalid token',
        'error': error_string
    }), 403)

# JWT の認証エラー
@jwt.unauthorized_loader
def jwt_unauthorized_callback(error_string):
    return make_response(jsonify({
        'status': 'UNAUTHORIZED',
        'message': 'invalid token',
        'error': error_string
    }), 403)