import json
import zipfile
import io

# Load manifest
with open('D:/nlpCode/practicals/manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print('=== VERIFYING MANIFEST & BATCH DATES ===')
batches = ['B1', 'B2', 'B3']
for b in batches:
    dates = manifest['batchDates'][b]
    print(f'Batch {b} dates count: {len(dates)}')
    assert len(dates) == 10, f'Expected 10 dates for batch {b}, got {len(dates)}'
    print(f'  First date (Exp 1): {dates[0]}')
    print(f'  Last date (Exp 10): {dates[-1]}')

print('\n=== VERIFYING PRACTICAL FILES & TITLES ===')
practicals = manifest['practicals']
assert len(practicals) == 10, f'Expected 10 practicals, got {len(practicals)}'

for p in practicals:
    path = f"D:/nlpCode/practicals/{p['filename']}"
    with open(path, 'r', encoding='utf-8') as fp:
        data = json.load(fp)
    cells = data.get('cells', [])
    outs = sum(len(c.get('outputs', [])) for c in cells)
    print(f"Exp {p['expNo']}: '{p['shortTitle']}' -> File: {p['filename']} (Cells: {len(cells)}, Total Outputs: {outs})")
    assert len(cells) > 0, f"File {p['filename']} has no cells!"

print('\n=== SIMULATING BATCH PERSONALIZATION TEST ===')
student = {'name': 'Aarav Patel', 'rollNo': '21AIDS045', 'batch': 'B2'}
b2_dates = manifest['batchDates']['B2']

# Test Experiment 1 with B2
exp1 = practicals[0]
with open(f"D:/nlpCode/practicals/{exp1['filename']}", 'r', encoding='utf-8') as fp:
    nb1 = json.load(fp)

# Injected header
header_cell = {
    'cell_type': 'code',
    'execution_count': None,
    'id': 'test-header',
    'metadata': {},
    'outputs': [],
    'source': [
        f"# Experiment No       : {exp1['expNo']}\n",
        f"# Title of Experiment : {exp1['title']}\n",
        f"# Name                : {student['name']}\n",
        f"# Roll No             : {student['rollNo']}\n",
        f"# Batch               : {student['batch']}\n",
        f"# Date of Performance : {b2_dates[0]}\n"
    ]
}
personalized_cells = [header_cell] + nb1['cells']
assert personalized_cells[0]['source'][5] == f"# Date of Performance : 15/07/2026\n"
assert 'NLP Pipeline and Linguistic Analysis' in personalized_cells[0]['source'][1]

print('Personalization injection validated!')
print('All integrity tests passed successfully!')
