import json
import os
import re
import time
import threading


def handle_individual_post(request, req_type):
    # Gets list of all currently stored individual lists
    dir_path = os.path.dirname(os.path.abspath(__file__))
    individual_lists = os.path.join(dir_path, 'user_content', 'individual_lists')
    all_lists = []
    for (dirpath, dirnames, filenames) in os.walk(individual_lists):
        all_lists.extend(filenames)
        break

    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return '400'

        username = data['username']
        couple_id = data['id']
        print('Couple ID: ' + couple_id)

        output = {}

        matching_files = [file for file in all_lists if re.match(couple_id, file[0:7])]
        print('Matching files: ')
        print(matching_files)
        number_matching_files = len(matching_files)

        # For rank list submission
        if req_type == 'submit':
            if number_matching_files > 2:
                output['success'] = False
                output['reason'] = 'Internal Error. Please resubmit lists with new Couple ID.'
                print('Too many matching files')
                return json.dumps(output)
            elif number_matching_files <= 2:
                filename = couple_id + '_' + username + '.json'
                file_path = os.path.join(individual_lists, filename)
                if os.path.isfile(file_path):
                    with open(file_path, 'r+') as f:
                        f.truncate()
                        json.dump(data, f)
                else:
                    with open(file_path, 'w') as f:
                        json.dump(data, f)
                output['success'] = True

        # For rank list retrieval
        elif req_type == 'retrieve':
            if number_matching_files != 2:
                output['success'] = False
                if number_matching_files > 2:
                    output['reason'] = 'Internal Error. Please resubmit lists with new Couple ID.'
                elif number_matching_files == 1:
                    output['reason'] = 'Only one list has been submitted with that Couple ID. Please ensure both ' \
                                       'members of couple have submitted their rank list.'
                elif number_matching_files == 0:
                    output['reason'] = 'No rank lists for submitted Couple ID were found. Please ensure you have ' \
                                       'correctly entered your Couple ID and both partners have submitted their list.'
                return json.dumps(output)

            if any(re.search(username, file, re.I) for file in matching_files):
                with open(os.path.join(individual_lists, matching_files[0])) as f:
                    output['a'] = json.load(f)
                with open(os.path.join(individual_lists, matching_files[1])) as f:
                    output['b'] = json.load(f)
                output['success'] = True
            else:
                output['success'] = False
                output['reason'] = 'Username not found to be associated with submitted Couple ID. Please ensure ' \
                                   'accuracy of both Couple ID and Username.'
        return json.dumps(output)


def ind_cleanup():
    print('Cleaning up individual lists.')
    dir_path = os.path.dirname(os.path.abspath(__file__))
    individual_lists = os.path.join(dir_path, 'user_content', 'individual_lists')
    all_lists = []
    for (dirpath, dirnames, filenames) in os.walk(individual_lists):
        all_lists.extend(filenames)
        break
    for file in all_lists:
        file_path = os.path.join(individual_lists, file)
        last_modified = os.stat(file_path).st_mtime
        if time.time() - last_modified > 1.21e+6:
            print('Deleting ' + file_path)
            os.remove(file_path)


threading.Timer(86400, ind_cleanup).start()
