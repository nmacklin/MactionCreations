/**
 * Created by Nick on 12/28/2015.
 */

function simpleKeywordCipherEncrypt () {
    var inputText = document.querySelector("#textInput").value;
    inputText = inputText.trim();
    if (!inputText || inputText === "Input message here.") {
        alert("Please enter message to be encrypted.");
        return 88;
    }

    var keyword = document.querySelector("#ancillaryInput0").value;
    keyword = keyword.trim();
    keyword = keyword.toUpperCase();
    if (!inputText || keyword === "Input keyword") {
        alert("Please enter a keyword.");
        return 88;
    }

    var originalAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z'];
    var transformedAlphabet = [];

    for (var i = 0; i < keyword.length; i++) {
        var letter = keyword.slice(i, i + 1);
        if (originalAlphabet.indexOf(letter) > -1) {
            if (transformedAlphabet.indexOf(letter) === -1) {
                transformedAlphabet.push(letter);
            }
        }
        else {
            alert("Keyword must contain only letters.");
            return 88;
        }
    }
    for (var i = 0; i < originalAlphabet.length; i++) {
        var letter = originalAlphabet[i];
        if (transformedAlphabet.indexOf(letter) === -1) {
            transformedAlphabet.push(letter);
        }
    }

    if (transformedAlphabet.length !== 26) {
        alert("Error occurred in encryption.");
        return 88;
    }

    var output = "";
    for (var i = 0; i < inputText.length; i++) {
        var letter = inputText.slice(i, i + 1);
        var letterNumber = originalAlphabet.indexOf(letter.toUpperCase());
        if (letterNumber === -1) {
            output += letter;
            continue;
        }
        if (letter === letter.toUpperCase()) {
            output += transformedAlphabet[letterNumber];
        }
        else {
            output += transformedAlphabet[letterNumber].toLowerCase();
        }
    }

    var textOutput = document.querySelector("#textOutput");
    textOutput.value = output;
    return 0;
}

function simpleKeywordCipherDecrypt () {
    var inputText = document.querySelector("#textOutput").value;
    inputText = inputText.trim();
    if (!inputText) {
        alert("Please enter text to be decrypted in right box");
        return 88;
    }

    var keyword = document.querySelector("#ancillaryInput0").value;
    keyword = keyword.trim();
    keyword = keyword.toUpperCase();
    if (!keyword || keyword === "Input keyword") {
        alert("Please enter keyword");
        return 88;
    }

    var originalAlphabet = [];
    var transformedAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z'];
    for (var i = 0; i < keyword.length; i++) {
        var letter = keyword.slice(i, i + 1);
        if (transformedAlphabet.indexOf(letter) === -1) {
            alert("Keyword must contain only letters");
            return 88;
        }
        if (originalAlphabet.indexOf(letter) === -1) {
            originalAlphabet.push(letter);
        }
    }

    for (var i = 0; i < transformedAlphabet.length; i++) {
        var letter = transformedAlphabet[i];
        if (originalAlphabet.indexOf(letter) === -1) {
            originalAlphabet.push(letter);
        }
    }

    var output = '';
    for (var i = 0; i < inputText.length; i++) {
        var letter = inputText.slice(i, i + 1);
        var letterNumber = originalAlphabet.indexOf(letter.toUpperCase());
        if (letterNumber > -1) {
            if (letter.toUpperCase() === letter) {
                output += transformedAlphabet[letterNumber];
            }
            else {
                output += transformedAlphabet[letterNumber].toLowerCase();
            }
        }
        else {
            output += letter;
        }
    }

    var textOutput = document.querySelector("#textInput");
    textOutput.value = output;
}