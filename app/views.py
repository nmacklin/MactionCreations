from flask import render_template
from app import app


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',
                           title='Home')


@app.route('/encryption')
def encryption():
    return render_template('encryption.html')


@app.route('/go')
def go():
    return render_template('go.html')
