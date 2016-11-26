/**
 * Created by Nick on 11/25/2016.
 */

(function indSubInitialization () {
    // Initializes tooltip for individual submission button
    $('#indSubIcon').tooltip({placement: 'auto top',
                                template: '<div class="tooltip indSubTooltip" role="tooltip">' +
                                                '<div class="tooltip-arrow"></div>' +
                                                '<div class="tooltip-inner"></div></div>',
                                title: 'Allows participants in couple to submit personal ranks individually.' +
                                        ' Rank list can be retrieved at a later time with username and list ID.'
    });

    // Add event listener to create buttons on individual submission modal
    document.getElementById('createIDBtn').addEventListener('click', function () {
        createCoupleID('subCoupleID');
    });
    document.getElementById('submitIndJSON').addEventListener('click', submitIndividualHandler);

    // Add listener to Get Results button in Retrieval Modal
    document.getElementById('retrieveBtn').addEventListener('click', retrieveResults);
})();


function createIndividualRanks () {
    var modal = document.getElementById('indSubModal');
    var entryRows = document.getElementsByClassName('row entryRow');
    var entries = [];

    for (var i = 0; i < entryRows.length - 1; i++) {
        var currentRow = entryRows[i];
        console.log('Entry row');
        console.log(currentRow);
        var programNameField = currentRow.getElementsByClassName('tt-input')[0];
        var programName = $(programNameField).typeahead('val');
        var rank = currentRow.getElementsByClassName('rankA')[0].value;
        entries.push(new IndividualRank(programName, rank));
    }

    generateModalRows(document.getElementById('indSubBody'), entries);

    $(modal).modal('show');
    $(modal).on('hidden.bs.modal', clearModal);

    lastIndividualList = entries;
}


function submitIndividualHandler () {
    var submitObject = {
        entries: lastIndividualList,
        username: getSubIDs('subUsername'),
        id: getSubIDs('subCoupleID')
    };
    console.log('Submit Object');
    console.log(submitObject);
    if (submitObject.username === 88) {
        return;
    }

    var req = new XMLHttpRequest();
    req.open('POST', '/couplesmatchindsub', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (this.status === 200) {
            showConfirmation(submitObject.username, submitObject.id);
        }
        else {
            alert('Submission failed. Please try again.');
        }
    };
    req.send(JSON.stringify(submitObject));
}


function getSubIDs (fieldID) {
    var identifierInput = document.getElementById(fieldID);
    var identifier = identifierInput.value.trim();
    if (/[^\d\w]/i.test(identifier) || identifier.length === 0) {
        identifierInput.style.backgroundColor = '#ff8989';
        identifierInput.style.color = 'white';
        identifierInput.addEventListener('input', function () {
            identifierInput.style.backgroundColor = '#ffffff';
            identifierInput.style.color = '#555';
        });
        alert('Must enter username containing only normal alphanumeric characters.');
        return 88;
    }
    return identifier;
}


function showConfirmation (username, id) {
    document.getElementById('usernameCell').innerHTML = username;
    document.getElementById('coupleIDCell').innerHTML = id;

    var modal = document.getElementById('indSubModal');
    $(modal).modal('hide');
    $(modal).on('hidden.bs.modal', function () {
        $('#confirmationModal').modal('show');
    });

}



function showRetrieveModal () {
    $('#retrieveModal').modal('show');
}


function retrieveResults () {
    var usernameIn = getSubIDs('retrievalUsername');
    var coupleIDIn = getSubIDs('retrievalID');
    var maxDistance = document.getElementById('retrievalDist').value;

    if (coupleIDIn.length !== 7 || /[^ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789]/.test(coupleIDIn)) {
        alert('Invalid Couple ID.');
        return;
    }

    var identifiers = {
        username: usernameIn,
        id: coupleIDIn
    };

    var req = new XMLHttpRequest();
    req.open('POST', '/couplesmatchretrieval', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (this.status === 200) {
            var resultsJSON = JSON.parse(req.responseText);
            console.log(resultsJSON);
            if (resultsJSON.success) {
                $('#retrieveModal').modal('hide');
                console.log(resultsJSON.a.entries);
                console.log(resultsJSON.b.entries);
                generateRankList(true, resultsJSON, maxDistance);
            }
            else {
                alert(resultsJSON.reason);
            }
        }
    };
    req.send(JSON.stringify(identifiers));
}


function createCoupleID (targetID) {
    var ID = "";
    var possChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    for (var i = 0; i < 7; i++) {
        ID += possChars.substr(Math.floor(Math.random() * possChars.length), 1);
    }

    document.getElementById(targetID).value = ID;
}