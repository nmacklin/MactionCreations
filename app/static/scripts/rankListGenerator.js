/**
 * Created by Nick on 11/17/2016.
 */

var currentRowCount = 1;
var inputRowsContainer = document.getElementById('inputRowsContainer');
var emptyInputRow;
var lastGeneratedList, emptyRankListRow;

(function initializeFields () {
    // Gets clone of first input row and then cleans IDs to be numbers instead of X.
    var firstInputRow = document.getElementsByClassName('row entryRow')[0];
    emptyInputRow = firstInputRow.cloneNode(true);
    var firstProgramName = firstInputRow.getElementsByClassName('form-control programName')[0];
    firstProgramName.addEventListener('blur', createEntryRow);

    // Adds event listeners to generate and clear buttons
    document.getElementById('generateListBtn').addEventListener('click', generateRankList);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllRows);

    // Adds event listener to Export as Excel button
    document.getElementById('saveAsXLS').addEventListener('click', submitHandler);
})();

function createEntryRow (event) {
    console.log("Creating new row!");
    console.log(event);
    // Check if any text entered. If not, cancel function. Else, remove event listener from prior field.
    var lastProgramEntry = event.target;
    if (lastProgramEntry.value.length === 0) {
        console.log("No input detected.");
        return;
    }
    lastProgramEntry.removeEventListener('blur', createEntryRow);

    // Add program to count and create new row with event listener for input.
    currentRowCount++;
    var newRow = emptyInputRow.cloneNode(true);
    console.log(newRow);
    inputRowsContainer.appendChild(newRow);
    var newProgramEntry = newRow.getElementsByClassName('form-control programName')[0];
    newProgramEntry.addEventListener('blur', createEntryRow);

    // Add delete button and event listener for deletion to prior row.
    var previousRow = newRow.previousElementSibling;
    var deleteButton = previousRow.getElementsByTagName('button')[0];
    deleteButton.style.display = 'inline-block';
    deleteButton.addEventListener('click', deleteRow);
}

function deleteRow (event) {
    // Prevent removal of only row.
    if (currentRowCount <= 1) {
        alert("Cannot remove last row");
        return;
    }
    console.log("Deleting row!");
    var clickedButton = event.target;
    console.log(clickedButton);

    // Get current row and delete.
    var currentElement = clickedButton;
    while (currentElement.className !== 'row entryRow') {
        currentElement = currentElement.parentNode;
        console.log('Parent: ');
        console.log(currentElement);
    }
    inputRowsContainer.removeChild(currentElement);
    currentRowCount--;

    // Reinstate event listener on final row.
    var lastRow = inputRowsContainer.children[inputRowsContainer.children.length - 1];
    var programEntryField = lastRow.getElementsByClassName('form-control programName')[0];
    console.log(programEntryField);
    programEntryField.addEventListener('blur', createEntryRow);
}

function generateRankList () {
    var entries = [];
    var entryRows = document.getElementsByClassName('row entryRow');
    if (entryRows.length === 1) {
        alert('No entries detected!');
        return;
    }

    var applicantARanks = {};
    var applicantBRanks = {};
    for (var i = 0; i < entryRows.length; i++) {
        var row = entryRows[i];
        var programName = row.getElementsByClassName('form-control programName')[0].value;
        if (programName.length === 0) continue;

        var rankA = parseInt(row.getElementsByClassName('form-control rankA')[0].value);
        var rankB = parseInt(row.getElementsByClassName('form-control rankB')[0].value);

        if (rankA) {
            applicantARanks[programName] = rankA;
        }
        if (rankB) {
            applicantBRanks[programName] = rankB;
        }
    }

    for (var rank1 in applicantARanks) {
        if (applicantARanks.hasOwnProperty(rank1)) {
            for (var rank2 in applicantBRanks) {
                if (applicantBRanks.hasOwnProperty(rank2)) {
                    var currentRank = new CoupleRank(rank1, applicantARanks[rank1], rank2, applicantBRanks[rank2]);
                    entries.push(currentRank);
                }
            }
        }
    }

    entries.sort(function (a, b) {
        return a.averageRank - b.averageRank;
    });
    console.log(entries);

    var rankListBody = document.getElementById('rankListBody');
    if (emptyRankListRow == undefined) {
        // Clone blank row and delete
        var firstRankRow = document.getElementsByClassName('row rankListRow')[0];
        emptyRankListRow = firstRankRow.cloneNode(true);
        rankListBody.removeChild(firstRankRow);
    }

    for (i = 0; i < entries.length; i++) {
        var coupleRank = entries[i];
        var newRow = emptyRankListRow.cloneNode(true);

        var rank = newRow.getElementsByClassName('col-lg-1 numRank')[0];
        var programA = newRow.getElementsByClassName('col-lg-4 appAProgram')[0];
        var programB = newRow.getElementsByClassName('col-lg-4 appBProgram')[0];
        var averageRank = newRow.getElementsByClassName('col-lg-3 averageRank')[0];

        rank.innerHTML = String(i + 1);
        programA.innerHTML = coupleRank.programA;
        programB.innerHTML = coupleRank.programB;
        averageRank.innerHTML = String(coupleRank.averageRank);

        rankListBody.appendChild(newRow);
    }

    $('#resultsModal ').modal('show');
    lastGeneratedList = entries;
    console.log(JSON.stringify(lastGeneratedList));
    $('#resultsModal').on('hidden.bs.modal', clearModal);
}

function clearAllRows () {
    var entryRows = document.getElementsByClassName('row entryRow');
    for (var i = 0; i < entryRows.length; i++) {
        var row = entryRows[i];
        row.getElementsByClassName('form-control programName')[0].value = "";
        row.getElementsByClassName('form-control rankA')[0].value = "";
        row.getElementsByClassName('form-control rankB')[0].value = "";
    }
}

function clearModal () {
    var rankRows = document.getElementsByClassName('row rankListRow');
    var modalBody = document.getElementById('rankListBody');

    for (var i = rankRows.length - 1; i >= 0; i--) {
        modalBody.removeChild(rankRows[i]);
    }
}

function submitHandler () {
    var req = new XMLHttpRequest();
    req.open("POST", '/couplesmatchsubmit', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.responseType = 'arraybuffer';
    req.onload = function () {
        if (this.status === 200) {
            var blob = new Blob([req.response],
                {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

            if (window.navigator.msSaveBlob) {
                // Detects IE/Edge => createObjectURL not supported by IE and Edge
                console.log('Windows platform detected');
                window.navigator.msSaveBlob(blob, 'RankList.xlsx');
            }
            else {
                //noinspection JSUnresolvedVariable
                var newURL = window.URL || window.webkitURL;
                //noinspection JSUnresolvedFunction
                var downloadUrl = newURL.createObjectURL(blob);

                var a = document.createElement('a');
                if (typeof a.download === 'undefined') {
                    console.log('Safari detected');
                    alert('Sorry, but your browser (usually Safari) does not support this download feature! All other major browsers are supported.');
                    return;
                }
                else {
                    console.log('Generating download element.');
                    a.href = downloadUrl;
                    console.log(downloadUrl);
                    a.download = 'RankList.xlsx';
                    document.body.appendChild(a);
                    a.click();
                }
            }
        }

        var req2 = new XMLHttpRequest();
        req2.open('POST', '/couplesmatchsubmit', true);
        req2.setRequestHeader('Content-Type', 'text/plain');
        req2.send('Data received');
    };
    req.send(JSON.stringify(lastGeneratedList));
}

function CoupleRank (programA, rankA, programB, rankB) {
    this.programA = programA;
    this.rankA = rankA;
    this.programB = programB;
    this.rankB = rankB;
    this.averageRank = (this.rankA + this.rankB) / 2;
}