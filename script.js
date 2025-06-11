let sheetCount = 0;
let cellData = {};
let currentCell = null;

function createSpreadsheet(containerId) {
    const container = document.getElementById(containerId);
    const spreadsheet = document.createElement('div');
    spreadsheet.className = 'spreadsheet';
    spreadsheet.dataset.sheetId = ++sheetCount;

    // Top-left blank cell
    spreadsheet.appendChild(document.createElement('div'));

    // Column headers
    for (let col = 0; col < 20; col++) {
        const colHeader = document.createElement('div');
        colHeader.className = 'header';
        colHeader.textContent = String.fromCharCode(65 + col);
        spreadsheet.appendChild(colHeader);
    }

    for (let row = 1; row <= 50; row++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'row-header';
        rowHeader.textContent = row;
        spreadsheet.appendChild(rowHeader);

        for (let col = 0; col < 20; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.contentEditable = true;
            const cellId = `S${sheetCount}_${String.fromCharCode(65 + col)}${row}`;
            cell.dataset.id = cellId;

            cell.addEventListener('click', () => currentCell = cell);
            cell.addEventListener('input', () => {
                cellData[cellId] = {
                    value: cell.innerText,
                    color: cell.style.color,
                    bg: cell.style.backgroundColor
                };
            });

            spreadsheet.appendChild(cell);
        }
    }

    container.appendChild(spreadsheet);
}

function format(command) {
    document.execCommand(command, false, null);
}

function applyColor(color, type) {
    if (currentCell) {
        currentCell.style[type] = color;
        const cellId = currentCell.dataset.id;
        cellData[cellId] = cellData[cellId] || {};
        cellData[cellId][type === 'color' ? 'color' : 'bg'] = color;
    }
}

document.getElementById('fontSelect').addEventListener('change', function () {
    if (currentCell) {
        currentCell.style.fontFamily = this.value;
        const cellId = currentCell.dataset.id;
        cellData[cellId] = cellData[cellId] || {};
        cellData[cellId].fontFamily = this.value;
    }
});

document.getElementById('fontSizeSelect').addEventListener('change', function () {
    document.execCommand('fontSize', false, this.value);
});

document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

function addNewSheet() {
    createSpreadsheet('sheetContainer');
}

function exportToCSV() {
    const sheet = document.querySelector('.spreadsheet:last-of-type');
    let csv = '';
    let rows = 50;
    let cols = 20;
    for (let row = 1; row <= rows; row++) {
        let rowData = [];
        for (let col = 0; col < cols; col++) {
            let cellId = `S${sheetCount}_${String.fromCharCode(65 + col)}${row}`;
            rowData.push(cellData[cellId]?.value || '');
        }
        csv += rowData.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Theme toggle logic
window.onload = () => {
    const toggle = document.getElementById('toggleMode');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', currentTheme === 'dark');
    toggle.checked = currentTheme === 'dark';

    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark', toggle.checked);
        localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
    });

    createSpreadsheet('sheetContainer');
};