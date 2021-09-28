""" login car API """
from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required
from db import db
from ..models.car import Car, CarSchema

# webpackからもjsが参照できるようにflask側で調整
# 静的ファイルの場所とURLパスを変更
car_bp = Blueprint(
    "car_bp", __name__, template_folder="templates", 
    static_url_path="/dist", static_folder= "../templates/dist"
)

@car_bp.route("/car", methods=["GET"])
@car_bp.route("/car/", methods=["GET"])
@car_bp.route("/car/<path:path>", methods=["GET"])
@login_required
def index(path=None):
    """ 
        index
        /car/...でリクエストを受け取った場合
        ホスティングサービスが無いのでReactを導入した
        index.htmlを返却する
    """
    return render_template("index.html")

@car_bp.route("/api/car", methods=["GET"])
@login_required
def car():
    """
        検索処理 
    """
    params = request.values.to_dict()
    if params["navi"] == 'false' or params["navi"] == '':
        params["navi"] = "0"
    else:
        params["navi"] = "1"
    if params["kawa"] == 'false' or params["kawa"] == '':
        params["kawa"] = "0"
    else:
        params["kawa"] = "1"
    if params["sr"] == 'false' or params["sr"] == '':
        params["sr"] = "0"
    else:
        params["sr"] = "1"

    car = Car.get_car_list(params)
    
    # 検索結果がない場合
    if len(car) == 0:
        return jsonify({}), 404
    
    # JSONに変換
    car_schema = CarSchema()
    return jsonify({'car': car_schema.dump(car, many=True)}), 200

@car_bp.route("/api/car/<int:id>", methods=["GET"])
@login_required
def get_car(id):
    """
        車両情報取得
    """
    car = db.session.query(Car).get(id)
    
    # 存在しない場合
    if not car:
        return jsonify({}), 404
    
    # JSONに変換
    car_schema = CarSchema()
    return jsonify({'car': car_schema.dump(car)}), 200

@car_bp.route("/api/car/<int:id>/confirm", methods=["post"])
@login_required
def do_confirm(id):
    """
        車両情報
    """
    params = request.get_json()
    print(params);
    
    # modeにより分岐
    if params["mode"] == "edit":
        # 更新時
        car = db.session.query(Car).get(id)
        # 値を設定
        car.set_update_attribute(params)
        # 検証
        if not car.valid():
            # だめなら400で終了
            return jsonify(car.errors), 400
    
    return jsonify({}), 200

@car_bp.route("/api/car/<int:id>/update", methods=["patch"])
@login_required
def do_update(id):
    """
        車両情報検証
    """
    params = request.get_json()
    car = db.session.query(Car).get(id)
    car.login_id = params["car"]["login_id"]
    car.password = params["car"]["password"]
    car.user_name = params["car"]["user_name"]
    db.session.commit()
    return jsonify({}), 200

@car_bp.route("/api/car/createConfirm", methods=["post"])
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
