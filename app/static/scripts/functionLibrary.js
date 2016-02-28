/**
 * Created by Nick on 2/26/2016.
 */

function getText (inputBoolean) {
    var inputOutputSelector;
    if (inputBoolean) {
        inputOutputSelector = "#textInput"
    }
    else {
        inputOutputSelector = "#textOutput"
    }

    var inputText = document.querySelector(inputOutputSelector).value;
    inputText = inputText.trim();
    if (!inputText) {
        alert("Please enter message to be encrypted.");
        return 88;
    }

    return inputText;
}


function getKeyword (inputNumber, toUpper, removeSpaces) {
    var keyword = document.querySelector("#ancillaryInput" + inputNumber.toString()).value;
    keyword = keyword.trim();

    if (toUpper) {
        keyword = keyword.toUpperCase();
    }

    if (removeSpaces) {
        var tempKeyword = "";
        var letter;
        for (var i = 0; i < keyword.length; i++) {
            letter = keyword.slice(i, i + 1);
            if (letter !== " ") {
                tempKeyword += letter;
            }
        }
        keyword = tempKeyword;
    }

    if (!keyword || keyword.toUpperCase() === "INPUT KEYWORD" || keyword.toUpperCase() === "INPUTKEYWORD") {
        alert("Please enter a key word or phrase.");
        return 89;
    }

    return keyword;
}