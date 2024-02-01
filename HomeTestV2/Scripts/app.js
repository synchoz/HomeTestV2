const _hebrew = new Map([
    ["65", "ש"],
    ["83", "ד"],
    ["68", "ג"],
    ["69", "ק"],
    ["70", "כ"],
    ["71", "ע"],
    ["72", "י"],
    ["73", "ן"],
    ["74", "ח"],
    ["75", "ל"],
    ["76", "ך"],
    ["79", "ם"],
    ["82", "ר"],
    ["90", "ז"],
    ["88", "ס"],
    ["80", "פ"],
    ["67", "ב"],
    ["86", "ה"],
    ["85", "ו"],
    ["84", "א"],
    ["89", "ט"],
    ["66", "נ"],
    ["78", "מ"],
    ["77", "צ"],
    ["188", "ת"],
    ["190", "ץ"],
    ["32", " "]
])

let _currentSearch = '';
let _pagesContent;
const _itemsPerPage = 5;
let _currentPage = 0;
let _items;
let _filteredItems;
let _tableBody;

document.addEventListener('DOMContentLoaded', function () {
    _pagesContent = $('.paginationContainer');
    _tableBody = $('.js_tableList tbody');
    _items = $(_tableBody).children().get();
    const tableHeader = $('.js_tableList th')

    createPageButtons(_items);
    showPage(_currentPage, _items);

    $('th').on('click', function () {
        const columnIndex = $(this).index();

        if (columnIndex === 0) {
            const sortOrder = $(this).hasClass('asc') ? 'desc' : 'asc';

            $(tableHeader).removeClass('desc asc');
            $(this).addClass(sortOrder);

            sortTableRows(columnIndex, sortOrder);
        }
    });

});
function searchFunc(e) {
    const ignoredKeys = [9, 17, 18, 20, 27];

    if (ignoredKeys.includes(e.keyCode)) {
        return;
    }

    if ($('#searchInput').val() == '') {
        _currentSearch = '';
    }

    if (e.keyCode == 8) {
        _currentSearch = _currentSearch.slice(0, -1);
    } else {
        let inputChar = _hebrew.has(e.keyCode) ? _hebrew.get(e.keyCode.toString()) : e.keyCode;
        let keyVal = _hebrew.get(e.keyCode.toString());
        _currentSearch += keyVal;
    }

    $(_items).removeClass('hidden');
    let filteredItems = $(_items).clone(true, true);
    if (_currentSearch.trim() != '') {
        _currentPage = 0;
        filteredItems = filteredItems.filter((index, element) => {
            return $(element).find('.nameValue:contains(' + _currentSearch + ')').length > 0;
        });
    }
    _tableBody.children().remove();
    _tableBody.append(filteredItems);

    createPageButtons(filteredItems);
    showPage(_currentPage, filteredItems);
}

function showPage(page, items) {
    const startIndex = page * _itemsPerPage;
    const endIndex = startIndex + _itemsPerPage;

    $(items).each((index, item) => {
        $(item).toggleClass('hidden', index < startIndex || index >= endIndex);
    });

    updateActiveButtonStates();
}

function updateActiveButtonStates() {
    const pageButtons = $('.pagination button').get();
    pageButtons.forEach((button, index) => {
        if (index === _currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function createPageButtons(items) {
    $('.pagination').remove();
    const totalPages = Math.ceil(items.length / _itemsPerPage);
    if (totalPages === 0) {
        return;
    }

    $('.pagination').remove();
    const paginationContainer = $('<div>').addClass('pagination d-flex align-items-center');
    const pageInfo = $('<div>').addClass('pageInfo').text(`1 of ${totalPages}`);
    
    for (let i = 0; i < totalPages; i++) {
        const pageButton = $('<button>').addClass('btnLink rounded').text(i + 1);
        pageButton.on('click', (function (pageIndex) {
            return function () {
                _currentPage = pageIndex;
                let currentRows = $(_tableBody).children().get();
                showPage(_currentPage, currentRows);
                updateActiveButtonStates();
                pageInfo.text(`${_currentPage + 1} of ${totalPages}`);
            };
        })(i));
        paginationContainer.append(pageButton);
    }
    paginationContainer.append(pageInfo);
    _pagesContent.append(paginationContainer);

}

function sortTableRows(columnIndex, sortOrder) {
    let currentRows = $(_tableBody).children().get();
    $(currentRows).removeClass('hidden');

    currentRows.sort(function (a, b) {
        let aValue = $(a).find('td').eq(columnIndex).text(),
            bValue = $(b).find('td').eq(columnIndex).text();

        return aValue > bValue ? 1
            : aValue < bValue ? -1
                : 0;
    });

    if (sortOrder === 'desc') {
        currentRows.reverse();
    }

    $(_tableBody).empty().append(currentRows);
    showPage(_currentPage, currentRows);
}