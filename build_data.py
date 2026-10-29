import json
import os

manifest = {
    "subject": "Natural Language Processing (NLP)",
    "courseCode": "SPPU AI&DS 2025/2026",
    "batchDates": {
        "B1": [
            "17/07/2026",
            "31/07/2026",
            "14/08/2026",
            "28/08/2026",
            "04/09/2026",
            "11/09/2026",
            "18/09/2026",
            "25/09/2026",
            "09/10/2026",
            "16/10/2026"
        ],
        "B2": [
            "15/07/2026",
            "22/07/2026",
            "29/07/2026",
            "12/08/2026",
            "26/08/2026",
            "09/09/2026",
            "16/09/2026",
            "30/09/2026",
            "07/10/2026",
            "14/10/2026"
        ],
        "B3": [
            "13/07/2026",
            "27/07/2026",
            "03/08/2026",
            "10/08/2026",
            "24/08/2026",
            "31/08/2026",
            "21/09/2026",
            "28/09/2026",
            "05/10/2026",
            "19/10/2026"
        ]
    },
    "practicals": [
        {
            "expNo": 1,
            "filename": "Program 01.ipynb",
            "pyFilename": "Program_01.py",
            "title": "NLP Pipeline and Linguistic Analysis: Develop a Python-based NLP system to apply and analyze the basic stages of Natural Language Processing on a given text corpus.",
            "shortTitle": "NLP Pipeline & Linguistic Analysis"
        },
        {
            "expNo": 2,
            "filename": "Program 02.ipynb",
            "pyFilename": "Program_02.py",
            "title": "Regular Expressions and Finite Automata: Design and implement a system using Regular Expressions to apply and evaluate pattern matching techniques for structured text processing.",
            "shortTitle": "Regular Expressions & Finite Automata"
        },
        {
            "expNo": 3,
            "filename": "Program 03.ipynb",
            "pyFilename": "Program_03.py",
            "title": "Edit Distance and Spelling Correction: Develop a system to apply and analyze string similarity techniques for spelling correction.",
            "shortTitle": "Edit Distance & Spelling Correction"
        },
        {
            "expNo": 4,
            "filename": "Program 04.ipynb",
            "pyFilename": "Program_04.py",
            "title": "Text Preprocessing and OOV Handling: Design and implement a preprocessing pipeline for textual data.",
            "shortTitle": "Text Preprocessing & OOV Handling"
        },
        {
            "expNo": 5,
            "filename": "Program 05.ipynb",
            "pyFilename": "Program_05.py",
            "title": "Feature Extraction and Text Representation: Develop a system to convert text into numerical representations",
            "shortTitle": "Feature Extraction & Representation"
        },
        {
            "expNo": 6,
            "filename": "Program 06.ipynb",
            "pyFilename": "Program_06.py",
            "title": "Text Classification using Naïve Bayes and Logistic Regression: Develop a text classification system to classify documents into predefined categories.",
            "shortTitle": "Text Classification (NB & LR)"
        },
        {
            "expNo": 7,
            "filename": "Program 07.ipynb",
            "pyFilename": "Program_07.py",
            "title": "POS Tagging using Hidden Markov Model (HMM): Develop a Part-ofSpeech (POS) tagging system using Hidden Markov Models",
            "shortTitle": "POS Tagging using HMM"
        },
        {
            "expNo": 8,
            "filename": "Program 08.ipynb",
            "pyFilename": "Program_08.py",
            "title": "Named Entity Recognition (NER) and Evaluation: Develop a Named Entity Recognition (NER) system to identify entities such as persons, locations, and organizations.",
            "shortTitle": "Named Entity Recognition (NER)"
        },
        {
            "expNo": 9,
            "filename": "Program 09.ipynb",
            "pyFilename": "Program_09.py",
            "title": "Dependency Parsing and Sentence Analysis: Develop a system to analyze grammatical relationships in sentences using dependency parsing, identify syntactic relations, and visualize the resulting parse structure.",
            "shortTitle": "Dependency Parsing & Analysis"
        },
        {
            "expNo": 10,
            "filename": "Program 10.ipynb",
            "pyFilename": "Program_10.py",
            "title": "Transformer-based NLP Pipeline & Mini Project: Develop and evaluate a deep learning pipeline for abstractive text summarization and sentiment classification.",
            "shortTitle": "Mini Project: Transformer NLP Pipeline"
        }
    ]
}

os.makedirs('D:/nlpCode/practicals', exist_ok=True)
os.makedirs('D:/nlpCode/js', exist_ok=True)

with open('D:/nlpCode/practicals/manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)
print('Wrote practicals/manifest.json')

# Build practicals-data.js (embedded offline cache)
files_data = {}
for p in manifest['practicals']:
    path = f"D:/nlpCode/practicals/{p['filename']}"
    with open(path, 'r', encoding='utf-8') as f:
        files_data[p['filename']] = f.read()

with open('D:/nlpCode/js/practicals-data.js', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated practical files offline bundle\n')
    f.write('window.PRACTICALS_MANIFEST = ' + json.dumps(manifest, indent=2) + ';\n\n')
    f.write('window.PRACTICALS_RAW_FILES = ' + json.dumps(files_data) + ';\n')

print('Wrote js/practicals-data.js with', len(files_data), 'embedded files.')
