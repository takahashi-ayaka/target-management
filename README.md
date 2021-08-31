# target-management

目標管理用のリポジトリ

## 要約

PythonとReactJSを用いたウェブアプリを構築

## 画面構成

* ログイン
　・ログイン画面
* メニュー
　・メニュー画面
* ユーザー
　・ユーザ一覧画面
　・ユーザ検索画面
　・ユーザ新規登録画面
　・ユーザ更新画面
　・ユーザ確認画面(登録/更新)
* 車両
　・車両一覧画面
　・車両検索画面
　・車両新規登録画面
　・車両更新画面
　・車両確認画面(登録/更新)

## 用意するもの

* wsl(ubuntu)
* vscode
* Node.js
* yarn or npm
* python(pyenv pipenv想定)
* mysql

## 実行前の準備

* wsl(ubuntu)にGit,Node.js,npmをインストール  
* pipenvをインストール
* 上記に必要なパッケージは[apt install]でインストール
* vscodeにはJS・Reactに必要な拡張機能をインストールしておく

## 実行方法

Gitでclone作成後に該当ディレクトリで以下を実行

```shell
pipenv install
```

別のコンソールで以下(vscodeでターミナルの切替でもOK)

```shell
npm install
```

バックエンド側(Python 3.9想定)  
必要なパッケージがダウンロード・インストールされます。  
詳しくは```Pipfile```を参照してください。  

フロントエンド側(JS)については  
まずはこれでコンパイル・実行に必要な```node_module```がカレントディレクトリに  
ダウンロードされてきます。  
詳しくは```package.json```を参照してください。  

少し問題は残ってますが、フロントエンドとバックエンドを結合させた環境となっております。  
起動方法については以下  

```shell
pipenv run start  ← バックエンドが起動します(localhost:3000)
npm run start ← フロントエンドが起動します(localhost:5000)
```

この時点でブラウザが立ち上がってくると思いますので、動かしながらソースの修正等をおこなってください。  
(http://localhost:5000)で立ち上がってきます。  
JS側を修正するとブラウザに反映されますが、コンパイルされたファイルは作成されません。(メモリ上展開)  
なのでバックエンド側(localhost:3000)でアクセスすると404になります。  
バックエンド側で起動したい場合は...  

```shell
npm run dev
```

いちどJSをコンパイルしてlocalhost:3000でアクセスしてください。  
この状態でもソース変更に伴い再コンパイルは発生しますが、ブラウザキャッシュされてしまうため  
変更の際はキャッシュクリアしてください。  

どの様にフロントエンドとバックエンドを連携しているかについては  
```webpack.config.js, package.json```を参照したり、Flask側/app配下のソースを参照する

## 現在のディレクトリ・ファイル構成

```shell
.
├── Pipfile
├── Pipfile.lock
├── README.md
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── items.py
│   │   ├── login.py
│   │   ├── menu.py
│   │   ├── users.py
│   ├── frontend
│   │   ├── App.js
│   │   ├── common
│   │   │   ├── error.js
│   │   ├── components
│   │   │   ├── form
│   │   │   │   └── TextControl.js
│   │   │   ├── Item.tsx
│   │   │   └── ItemList.js
│   │   │   └── LogoutButton.js
│   │   └── pages
│   │       ├── items
│   │       │   └── index.js
│   │       ├── login
│   │       │   ├── LoginFrom.js
│   │       │   └── index.js
│   │       │── menu
│   │       │   └── index.js
│   │       └── users
│   │           ├── index.js
│   │           ├── UserCreate.js
│   │           ├── UserForm.js
│   │           ├── UserRegisterButtonControl.js
│   │           └── UsersList.js
│   ├── models
│   │   ├── __init__.py
│   │   ├── item.py
│   │   ├── login.py
│   │   └── user.py
│   ├── static
│   ├── templates
│   │   ├── dist
│   │   │   └── bundle.js
│   │   └── index.html
├── db
│   ├── items.sql
│   └── users.sql
├── db.py
├── package.json
├── server.py
├── settings.py
├── tsconfig.json
├── webpack.config.js
└── yarn.lock
```

## 解説など


## その他

JS(React)について。。。  
今回は、なんとなくゼロからの構築みたいになっているが公式にいろいろな  
ツールチェインがあると書いてあるので、試してみるのもありですね。  
<https://ja.reactjs.org/docs/create-a-new-react-app.html#create-react-app>

ESLint(静的解析ツール)を導入しました。  
ESLint ルール 一覧 (日本語)  
<https://garafu.blogspot.com/2017/02/eslint-rules-jp.html>
