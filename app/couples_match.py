import openpyxl
import time
import shutil
from openpyxl.styles import Font, Alignment, NamedStyle, Side, Border

# List to store temporary directories and scheduler to clear list at next midnight after function call
temp_dirs = []
last_clear_time = 0.0


def create_workbook():
    workbook = openpyxl.Workbook()
    ws = workbook.active
    ws.title = 'Rank List'

    b1 = ws['B1']
    d1 = ws['D1']

    b1.value = 'Applicant A Rank List'
    b1.alignment = Alignment(horizontal='center')
    b1.font = Font(size=12)
    ws.merge_cells('B1:C1')

    d1.value = 'Applicant B Rank List'
    d1.alignment = Alignment(horizontal='center')
    d1.font = Font(size=12)
    ws.merge_cells('D1:E1')

    for row in ws['D2':'D400']:
        for cell in row:
            cell.border += Border(left=Side(style='thin'))

    b2 = ws['B2']
    c2 = ws['C2']
    d2 = ws['D2']
    e2 = ws['E2']
    g2 = ws['G2']
    headings = [b2, c2, d2, e2, g2]
    column_heading = NamedStyle(name="column_heading")
    column_heading.font = Font(bold=True)
    bottom_border = Side(style='medium', color='000000')
    top_border = Side(style='thin')
    column_heading.border = Border(top=top_border, bottom=bottom_border)
    b2.value = 'Rank'
    d2.value = 'Rank'
    c2.value = 'Program'
    e2.value = 'Program'
    g2.value = 'Average Rank'
    for heading in headings:
        heading.style = column_heading
        heading.alignment = Alignment(horizontal='center')

    ws.column_dimensions['B'].width = 5
    ws.column_dimensions['C'].width = 30
    ws.column_dimensions['D'].width = 5
    ws.column_dimensions['E'].width = 30
    ws.column_dimensions['G'].width = 15

    return workbook


def populate_workbook(parsed_json, workbook):
    ws = workbook.active

    rank_count = 0
    for rank in parsed_json:
        rank_count += 1
        target_row = str(rank_count + 2)

        program_a = rank['programA']
        program_b = rank['programB']
        average = rank['averageRank']

        ws['B' + target_row].value = rank_count
        ws['D' + target_row].value = rank_count
        ws['C' + target_row].value = program_a
        ws['E' + target_row].value = program_b
        ws['G' + target_row].value = average

        ws['B' + target_row].alignment = Alignment(horizontal='center')
        ws['C' + target_row].alignment = Alignment(horizontal='center')
        ws['D' + target_row].alignment = Alignment(horizontal='center')
        ws['E' + target_row].alignment = Alignment(horizontal='center')
        ws['G' + target_row].alignment = Alignment(horizontal='center')

    return workbook


def create_xls(input_data):
    workbook = create_workbook()
    workbook = populate_workbook(input_data, workbook)
    return workbook


def temp_cleanup():
    # Deletes temporary directories if at least 24 hours elapsed since last clear
    global temp_dirs, last_clear_time
    if time.time() - last_clear_time > 86400000:
        new_list = []
        for temp_dir in temp_dirs:
            try:
                print('Removing directory ' + temp_dir)
                shutil.rmtree(temp_dir)
                print('Directory removed.')
            except PermissionError:
                print('Failed to remove ' + temp_dir)
                new_list.append(temp_dir)
        temp_dirs = new_list
        last_clear_time = time.time()
