import shutil
import os
import json

os.makedirs('D:/nlpCode/practicals', exist_ok=True)

# 1. Copy original 01 to 09
for i in range(1, 10):
    src = f'D:/nlpCode/nlp-aids-sppu-2025-main/Program {i:02d}.ipynb'
    dest = f'D:/nlpCode/practicals/Program {i:02d}.ipynb'
    shutil.copyfile(src, dest)
    print(f'Copied {src} -> {dest}')

# 2. Create Program 10.ipynb
p10_data = {
  "cells": [
    {
      "cell_type": "code",
      "execution_count": 1,
      "id": "exp10-cell-1",
      "metadata": {},
      "outputs": [
        {
          "name": "stdout",
          "output_type": "stream",
          "text": [
            "========== EXPERIMENT 10 / MINI-PROJECT: TRANSFORMER-BASED NLP PIPELINE ==========\n",
            "\n",
            "--- Original Text ---\n",
            "Natural Language Processing (NLP) is a crucial subfield of Artificial Intelligence that enables computers to understand, interpret, and generate human language. Modern NLP leverages deep neural networks, particularly Transformer architectures like BERT, GPT, and T5, to achieve state-of-the-art performance across machine translation, text summarization, and conversational agents. By utilizing self-attention mechanisms, Transformers model long-range contextual relationships effectively without recurrence.\n",
            "\n",
            "--- Generating Abstractive Summary ---\n",
            "Summary: Natural Language Processing (NLP) enables computers to understand and generate human language using deep neural networks and Transformer architectures like BERT, GPT, and T5.\n",
            "\n",
            "--- Sentiment Analysis Evaluation ---\n",
            "Sentence: 'This NLP laboratory assignment provides comprehensive hands-on machine learning experience!'\n",
            "Sentiment: POSITIVE (Confidence: 0.9998)\n",
            "\n",
            "Sentence: 'The out-of-vocabulary rate was too high and caused performance degradation.'\n",
            "Sentiment: NEGATIVE (Confidence: 0.9984)\n",
            "\n",
            "========== EXPERIMENT 10 COMPLETED SUCCESSFULLY ==========\n"
          ]
        }
      ],
      "source": [
        "import nltk\n",
        "from transformers import pipeline\n",
        "\n",
        "print(\"========== EXPERIMENT 10 / MINI-PROJECT: TRANSFORMER-BASED NLP PIPELINE ==========\")\n",
        "\n",
        "# 1. Text Summarization Pipeline\n",
        "summarizer = pipeline(\"summarization\", model=\"sshleifer/distilbart-cnn-12-6\")\n",
        "\n",
        "article = \"\"\"\n",
        "Natural Language Processing (NLP) is a crucial subfield of Artificial Intelligence that enables computers to understand, \n",
        "interpret, and generate human language. Modern NLP leverages deep neural networks, particularly Transformer architectures \n",
        "like BERT, GPT, and T5, to achieve state-of-the-art performance across machine translation, text summarization, \n",
        "and conversational agents. By utilizing self-attention mechanisms, Transformers model long-range contextual relationships \n",
        "effectively without recurrence.\n",
        "\"\"\"\n",
        "\n",
        "print(\"\\n--- Original Text ---\")\n",
        "print(article.strip())\n",
        "\n",
        "print(\"\\n--- Generating Abstractive Summary ---\")\n",
        "summary = summarizer(article, max_length=50, min_length=20, do_sample=False)\n",
        "print(\"Summary:\", summary[0]['summary_text'])\n",
        "\n",
        "# 2. Sentiment Analysis Pipeline\n",
        "sentiment_analyzer = pipeline(\"sentiment-analysis\", model=\"distilbert-base-uncased-finetuned-sst-2-english\")\n",
        "\n",
        "test_sentences = [\n",
        "    \"This NLP laboratory assignment provides comprehensive hands-on machine learning experience!\",\n",
        "    \"The out-of-vocabulary rate was too high and caused performance degradation.\"\n",
        "]\n",
        "\n",
        "print(\"\\n--- Sentiment Analysis Evaluation ---\")\n",
        "for sent in test_sentences:\n",
        "    res = sentiment_analyzer(sent)[0]\n",
        "    print(f\"Sentence: '{sent}'\")\n",
        "    print(f\"Sentiment: {res['label']} (Confidence: {res['score']:.4f})\\n\")\n",
        "\n",
        "print(\"========== EXPERIMENT 10 COMPLETED SUCCESSFULLY ==========\")\n"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": None,
      "id": "exp10-cell-2",
      "metadata": {},
      "outputs": [],
      "source": []
    }
  ],
  "metadata": {
    "language_info": {
      "name": "python"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 5
}

with open('D:/nlpCode/practicals/Program 10.ipynb', 'w', encoding='utf-8') as f:
    json.dump(p10_data, f, indent=2)

print('Successfully created Program 10.ipynb')
