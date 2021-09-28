""" login car API """
from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required
from db import db
from ..models.car import Car, CarSchema

# webpackからもjsが参照できるようにflask側で調整
# 静的ファイルの場所とURLパスを変更
carCreate_bp = Blueprint(
    "carCreate_bp", __name__, template_folder="templates", 
    static_url_path="/dist", static_folder= "../templates/dist"
)

@carCreate_bp.route("/carCreate", methods=["GET"])
@carCreate_bp.route("/carCreate/", methods=["GET"])
@carCreate_bp.route("/carCreate/<path:path>", methods=["GET"])
@login_required
def index(path=None):
    """ 
        index
        /carCreate/...でリクエストを受け取った場合
        ホスティングサービスが無いのでReactを導入した
        index.htmlを返却する
    """
    return render_template("index.html")

@carCreate_bp.route("/api/carCreate", methods=["GET"])
@login_required
def cars():
    """
        検索処理 
    """
    params = request.values
    cars = Car.get_car_list(params)
    
    # 検索結果がない場合
    if len(cars) == 0:
        return jsonify({}), 404
    
    # JSONに変換
    car_schema = CarSchema()
    return jsonify({'cars': car_schema.dump(cars, many=True)}), 200

@carCreate_bp.route("/api/carCreate/createConfirm", methods=["post"])
@login_required
def do_createConfirm():
    params = request.get_json()

    # DB定義を取得（処理はmodelsの方に書いている）
    carCreate = Car()

    # 取得したパラメータをセットする
    carCreate.set_update_attribute(params)

    # バリデートチェックを実行
    if not carCreate.validCreate():
        # だめなら400で終了
        return jsonify(carCreate.errors), 400

    return jsonify({}), 200

@carCreate_bp.route("/api/carCreate/create", methods=["post"])
@login_required
def do_create():
    params = request.get_json()
    # DB定義を取得（処理はmodelsの方に書いている）
    carCreate = Car()

    # 取得したパラメータをセットする
    carCreate.set_update_attribute(params)

    # バリデートチェックを実行
    if not carCreate.validCreate():
            # だめなら400で終了
            return jsonify(carCreate.errors), 400

    # 値は設定されているのでコミットする
    db.session.add(carCreate)
    db.session.commit()
    
    return jsonify({}), 200
