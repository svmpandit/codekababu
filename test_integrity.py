import json

# Load manifest
with open('D:/nlpCode/practicals/manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print('=== VERIFYING MANIFEST & BATCH DATES ===')
batches = ['B1', 'B2', 'B3']
for b in batches:
    dates = manifest['batchDates'][b]
    print(f'Batch {b} dates count: {len(dates)}')
    assert len(dates) == 9, f'Expected 9 dates for batch {b}, got {len(dates)}'
    print(f'  First date (Exp 1): {dates[0]}')
    print(f'  Last date (Exp 9): {dates[-1]}')

print('\n=== VERIFYING PRACTICAL FILES & TITLES ===')
practicals = manifest['practicals']
assert len(practicals) == 9, f'Expected 9 practicals, got {len(practicals)}'

for p in practicals:
    path = f"D:/nlpCode/practicals/{p['filename']}"
    with open(path, 'r', encoding='utf-8') as fp:
        data = json.load(fp)
    cells = data.get('cells', [])
    outs = sum(len(c.get('outputs', [])) for c in cells)
    print(f"Exp {p['expNo']}: '{p['shortTitle']}' -> File: {p['filename']} (Cells: {len(cells)}, Total Outputs: {outs})")
    assert len(cells) > 0, f"File {p['filename']} has no cells!"

print('\nAll 9 practicals verified successfully!')
