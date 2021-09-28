from sqlalchemy.sql.expression import false, true
from db import db, ma
from sqlalchemy.orm import relationship
from sqlalchemy import Column, BigInteger, String, Enum
from marshmallow import fields
from flask_login import UserMixin
import enum

class AuthType(str, enum.Enum):
    administrator = "administrator"
    member = "member"

class Car(UserMixin, db.Model):
    __tablename__ = 'car'
    __table_args__ = {'extend_existing': True}
    carId = Column(BigInteger, primary_key=True, nullable=False)
    maker = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    grade = Column(String(100), nullable=False)
    bodyColor = Column(String(100), nullable=False)
    price = Column(BigInteger, nullable=False)
    navi = Column(BigInteger)
    kawa = Column(BigInteger)
    sr = Column(BigInteger)

    # 管理者かどうか確認
    def is_administrator(self):
        return True if self.authority == AuthType.administrator else False
    
    # 更新時、画面からの値を設定
    def set_update_attribute(self, params):
        # エラーメッセージのインスタンス変数を作成
        self.errors = {'fatal': False}
        # ユーザ画面からくる値をインスタンスに設定
        for key in list(params["car"].keys()):
            setattr(self, key, params["car"][key])
    
    # 入力チェック
    def valid(self):
        validate = True
        # 一旦ストレートに書きます。
        if not self.maker:
            self.errors['maker'] = 'メーカーは必須入力です。'
            validate = False
        if not self.model:
            self.errors['model'] = '車種名は必須入力です。'
        if not self.grade:
            self.errors['grade'] = 'グレードは必須入力です。'
            validate = False
        if not self.bodyColor:
            self.errors['bodyColor'] = 'グレードは必須入力です。'
            validate = False
        if not self.price:
            self.errors['price'] = '価格は必須入力です。'
            validate = False
            
        return validate
    
    # 新規登録用
    def validCreate(self):
        validate = True
        if not self.maker:
            self.errors['maker'] = 'メーカーは必須入力です。'
            validate = False

        if not self.model:
            self.errors['model'] = '車種名は必須入力です。'
        if self.model and len(self.model) > 50:
            self.errors['model'] = '車種名は50文字以内で入力してください。'
            validate = False

        if not self.grade:
            self.errors['grade'] = 'グレードは必須入力です。'
            validate = False
        if self.grade and len(self.grade) > 50:
            self.errors['grade'] = 'グレードは50文字以内で入力してください。'
            validate = False

        if not self.bodyColor:
            self.errors['bodyColor'] = 'ボディカラーは必須入力です。'
            validate = False
        if self.bodyColor and len(self.bodyColor) > 50:
            self.errors['bodyColor'] = 'ボディカラーは50文字以内で入力してください。'
            validate = False

        if not self.price:
            self.errors['price'] = '価格は必須入力です。'
            validate = False
        if self.price and self.price.isdigit() == False:
            self.errors['price'] = '価格は数値で入力してください。'
            validate = False
        if self.price and self.price.isdigit() and len(self.price) > 9:
            self.errors['price'] = '価格は9桁以内で入力してください。'
            validate = False
            
        return validate

    @classmethod
    def get_car_list(self, params):
        car = db.session.query(self)
        if params['maker']:
            car = car.filter(
                self.maker == params['maker']
            )
        if params['model']:
            car = car.filter(
                self.model == params['model']
            )
        if params['grade']:
            car = car.filter(
                self.grade == params['grade']
            )
        if params['bodyColor']:
            car = car.filter(
                self.bodyColor == params['bodyColor']
            )
        if params['price_up']:
            car = car.filter(
                self.price <= int(params['price_up'])
            )
        if params['price_down']:
            car = car.filter(
                self.price >= int(params['price_down'])
            )
        if params['navi']:
            car = car.filter(
                self.navi == params['navi']
            )
        if params['kawa']:
            car = car.filter(
                self.kawa == params['kawa']
            )
        if params['sr']:
            car = car.filter(
                self.sr == params['sr']
            )
        
        # order by 
        car = car.order_by(self.carId)
        
        return car.all()    
    
class CarSchema(ma.SQLAlchemyAutoSchema):
    carId = fields.Integer()
    maker = fields.Str()
    model = fields.Str()
    grade = fields.Str()
    bodyColor = fields.Str()
    price = fields.Integer()
    navi = fields.Integer()
    kawa = fields.Integer()
    sr = fields.Integer()
    # class Meta:
    #     model = Car

# class CarItemsSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = Car
    
    # login_id = ma.auto_field()
    # user_name = ma.auto_field()
    # items = fields.Nested('ItemSchema', many=True)
    
