/**
 * CodeKaBabu - Header Injection Engine
 * Safely personalizes Jupyter Notebooks (.ipynb) and Python (.py) scripts
 * without modifying original logic or execution outputs.
 */

/**
 * Creates the formatted header text for a given experiment and student.
 */
export function createCommentHeader(student, exp, dateStr) {
  return [
    `# ==============================================================================`,
    `# Experiment No       : ${exp.expNo}`,
    `# Title of Experiment : ${exp.title}`,
    `# Name                : ${student.name.trim()}`,
    `# Roll No             : ${student.rollNo.trim()}`,
    `# Batch               : ${student.batch.toUpperCase()}`,
    `# Date of Performance : ${dateStr}`,
    `# ==============================================================================`,
    ''
  ].join('\n');
}

/**
 * Personalizes a Jupyter Notebook (.ipynb)
 * Inserts a top header code cell containing the student details and experiment title.
 * ALL existing code cells and their outputs (stream, tables, plots) remain 100% INTACT.
 */
export function personalizeNotebook(notebookJsonStr, student, exp, dateStr) {
  let nb;
  try {
    nb = typeof notebookJsonStr === 'string' ? JSON.parse(notebookJsonStr) : notebookJsonStr;
  } catch (err) {
    console.error('Failed to parse notebook JSON:', err);
    return notebookJsonStr;
  }

  // Deep clone to ensure original is immutable
  const cloned = JSON.parse(JSON.stringify(nb));

  const headerSource = [
    `# ==============================================================================\n`,
    `# Experiment No       : ${exp.expNo}\n`,
    `# Title of Experiment : ${exp.title}\n`,
    `# Name                : ${student.name.trim()}\n`,
    `# Roll No             : ${student.rollNo.trim()}\n`,
    `# Batch               : ${student.batch.toUpperCase()}\n`,
    `# Date of Performance : ${dateStr}\n`,
    `# ==============================================================================\n`
  ];

  const headerCell = {
    cell_type: 'code',
    execution_count: null,
    id: `codekababu-header-${Date.now()}`,
    metadata: {
      collapsed: false,
      jupyter: {
        source_hidden: false
      }
    },
    outputs: [],
    source: headerSource
  };

  // If first cell is already a CodeKaBabu header from previous run, replace it; else unshift
  if (
    cloned.cells &&
    cloned.cells.length > 0 &&
    Array.isArray(cloned.cells[0].source) &&
    cloned.cells[0].source.join('').includes('Experiment No') &&
    cloned.cells[0].source.join('').includes('Date of Performance')
  ) {
    cloned.cells[0] = headerCell;
  } else {
    cloned.cells = [headerCell, ...(cloned.cells || [])];
  }

  return JSON.stringify(cloned, null, 2);
}

/**
 * Extracts and converts a Jupyter Notebook into a standalone executable Python script (.py)
 * with the student header prepended.
 */
export function notebookToPersonalizedPython(notebookJsonStr, student, exp, dateStr) {
  let nb;
  try {
    nb = typeof notebookJsonStr === 'string' ? JSON.parse(notebookJsonStr) : notebookJsonStr;
  } catch (err) {
    return '# Error parsing notebook source';
  }

  const header = createCommentHeader(student, exp, dateStr);
  const codeBlocks = [];

  for (const cell of nb.cells || []) {
    if (cell.cell_type === 'code') {
      const src = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
      // Comment out IPython magics or pip installs if exporting to pure .py
      const sanitized = src
        .split('\n')
        .map((line) => {
          if (line.trim().startsWith('!') || line.trim().startsWith('%')) {
            return `# ${line}`;
          }
          return line;
        })
        .join('\n');

      if (sanitized.trim().length > 0) {
        codeBlocks.push(sanitized.trim());
      }
    }
  }

  return header + '\n\n' + codeBlocks.join('\n\n# ' + '='.repeat(60) + '\n\n');
}
