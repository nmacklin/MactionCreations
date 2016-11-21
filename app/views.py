import json
import os.path
import tempfile

from flask import Flask, render_template, request, send_file

from app.couples_match import create_xls, temp_dirs, temp_cleanup


app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',
                           title='Home')


@app.route('/encryption')
def encryption():
    return render_template('encryption.html')


@app.route('/encryptionLogPost', methods=['GET', 'POST'])
def encryption_log_post():
    log_data = request.get_json()
    log_complete = False
    log_count = 1

    while not log_complete:
        try:
            f = open(
                r'C:\Users\Nick\Dropbox\Coding\PycharmProjects\FlaskApp\tmp\log_' + str(log_count) + r'.json',
                'x')
        except FileExistsError:
            log_count += 1
            continue
        else:
            json.dump(log_data, f)
            f.close()
            log_complete = True
    return "Log received"


@app.route('/couplesmatch')
def couples_match():
    return render_template('couplesmatch.html', title='Tool for the Couples Match')


@app.route('/couplesmatchsubmit', methods=['GET', 'POST'])
def couples_match_submit():
    if request.method == 'POST':
        if request.headers['Content-Type'] == 'application/json':
            rank_list_data = request.get_json()

            match_xls = create_xls(rank_list_data)

            temp_dir = tempfile.mkdtemp()
            print('Creating directory ' + temp_dir)
            match_xls.save(os.path.join(temp_dir, 'RankList.xlsx'))
            temp_dirs.append(temp_dir)

            return send_file(os.path.join(temp_dir, r'RankList.xlsx'),
                             mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                             attachment_filename='RankList.xlsx',
                             as_attachment=True)

        elif request.headers['Content-Type'] == 'text/plain':
            confirmation = request.data
            print(confirmation)
            if confirmation == b'Data received':
                temp_cleanup()
            return '200'
