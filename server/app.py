import os
import pymysql
from http import HTTPStatus
from flask_cors import CORS
from flask import Flask, redirect, request, jsonify, url_for, abort
from db import Database
from config import DevelopmentConfig as devconf
import datetime


host = os.environ.get('FLASK_SERVER_HOST', devconf.HOST)
port = os.environ.get('FLASK_SERVER_PORT', devconf.PORT)
version = str(devconf.VERSION).lower()
url_prefix = str(devconf.URL_PREFIX).lower()



def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(devconf)
    return app


def get_response_msg(data, status_code):
    message = {
        'status': status_code,
        'data': data if data else False
    }
    response_msg = jsonify(message)
    response_msg.status_code = status_code
    return response_msg


app = create_app()
wsgi_app = app.wsgi_app
db = Database(devconf)

## ==============================================[ Routes - Start ]

## /login
@app.route("/login", methods=['POST'])
def login():
    try:
        print(request)
        usr = request.json['usr']
        pwd = request.json['pwd']
        print('User: ', usr, pwd)
        query = f"SELECT * FROM AnalyseDoc.users WHERE username='{usr}' AND pwd='{pwd}'"
        records = db.run_query(query=query)
        if not records:
            error = KeyError("User not Found")
            db.close_connection()
            return get_response_msg(data=str(error), status_code=HTTPStatus.NOT_FOUND)

        updateLastconnection(usr, pwd)
        response = get_response_msg(records, HTTPStatus.OK)
        db.close_connection()
        return response
    except pymysql.MySQLError as sqle:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, description=str(sqle))
    except Exception as e:
        abort(HTTPStatus.BAD_REQUEST, description=str(e))

def updateLastconnection(usr, pwd):
    now = str(datetime.datetime.now())
    print(now)
    query = f"UPDATE AnalyseDoc.users SET lastconnection='{now}' WHERE username='{usr}' AND pwd='{pwd}'"
    db.run_query(query=query)
#####################################
## /signup
@app.route("/signup", methods=['POST'])
def signup():
    try:
        if exist(request.json['usr'], request.json['email']):
            error = KeyError("User already exist")
            db.close_connection()
            return get_response_msg(data=str(error), status_code=HTTPStatus.NOT_FOUND)
        
        usr = request.json['usr']
        pwd = request.json['pwd']
        email = request.json['email']
        name = request.json['name']
        
        query = f"INSERT INTO AnalyseDoc.users (name, email, username, pwd, lastconnection)  VALUES  ('{name}','{email}','{usr}','{pwd}','{str(datetime.datetime.now())}')"
        records = db.run_query(query=query)
        response = get_response_msg(records, HTTPStatus.OK)
        db.close_connection()
        return response
    except pymysql.MySQLError as sqle:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, description=str(sqle))
    except Exception as e:
        abort(HTTPStatus.BAD_REQUEST, description=str(e))

def exist(usr, email):
    query = f"SELECT * FROM AnalyseDoc.users WHERE username='{usr}' OR email='{email}'"
    records = db.run_query(query=query)
    if not records:
        return False
    return True

#####################################
## /getdeligences
@app.route("/getdeligences", methods=['GET'])
def deligences():
    try:
        query = f"SELECT * FROM AnalyseDoc.deligences"
        records = db.run_query(query=query)
        response = get_response_msg(records, HTTPStatus.OK)
        db.close_connection()
        return response
    except pymysql.MySQLError as sqle:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, description=str(sqle))
    except Exception as e:
        print(e)
        abort(HTTPStatus.BAD_REQUEST, description=str(e))

#####################################
@app.route("/questions", methods=['GET'])
def questions():
    try:
        query = "SELECT * FROM AnalyseDoc.questions"
        records = db.run_query(query=query)
        response = get_response_msg(records, HTTPStatus.OK)
        db.close_connection()
        print(response)
        return response
    except pymysql.MySQLError as sqle:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, description=str(sqle))
    except Exception as e:
        print(e)
        abort(HTTPStatus.BAD_REQUEST, description=str(e))


## /
@app.route("/", methods=['GET'])
def home():
    return jsonify("Welcome to the home page.")

## =================================================[ Routes - End ]

## ================================[ Error Handler Defined - Start ]
## HTTP 404 error handler
@app.errorhandler(HTTPStatus.NOT_FOUND)
def page_not_found(e):    
    return get_response_msg(data=str(e), status_code=HTTPStatus.NOT_FOUND)


## HTTP 400 error handler
@app.errorhandler(HTTPStatus.BAD_REQUEST)
def bad_request(e):
    return get_response_msg(str(e), HTTPStatus.BAD_REQUEST)


## HTTP 500 error handler
@app.errorhandler(HTTPStatus.INTERNAL_SERVER_ERROR)
def internal_server_error(e):
    return get_response_msg(str(e), HTTPStatus.INTERNAL_SERVER_ERROR)
## ==================================[ Error Handler Defined - End ]

if __name__ == '__main__':
    ## Launch the application 
    app.run(host=host, port=port)