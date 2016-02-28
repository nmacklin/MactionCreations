/**
 * Created by Nick on 12/28/2015.
 */

function simpleKeywordCipherEncrypt () {
    var inputText = getText(true);
    var keyword = getKeyword(0, true, false);

    var originalAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z'];
    var transformedAlphabet = [];

    for (var i = 0; i < keyword.length; i++) {
        var letter = keyword.slice(i, i + 1);
        if (originalAlphabet.indexOf(letter) > -1 || letter === " ") {
            if (transformedAlphabet.indexOf(letter) === -1 && letter !== " ") {
                transformedAlphabet.push(letter);
            }
        }
        else {
            alert("Keyword/phrase may only contain letters and spaces.");
            return 88;
        }
    }
    for (i = 0; i < originalAlphabet.length; i++) {
        letter = originalAlphabet[i];
        if (transformedAlphabet.indexOf(letter) === -1) {
            transformedAlphabet.push(letter);
        }
    }

    if (transformedAlphabet.length !== 26) {
        alert("Error occurred in encryption.");
        return 88;
    }

    var output = "";
    for (i = 0; i < inputText.length; i++) {
        letter = inputText.slice(i, i + 1);
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

    return output;
}

function simpleKeywordCipherDecrypt () {
    var inputText = getText(false);
    var keyword = getKeyword(0, true, false);

    var originalAlphabet = [];
    var transformedAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z'];
    for (var i = 0; i < keyword.length; i++) {
        var letter = keyword.slice(i, i + 1);
        if (transformedAlphabet.indexOf(letter) === -1 && letter !== " ") {
            alert("Keyword/phrase must contain only letters and spaces");
            return 88;
        }
        if (originalAlphabet.indexOf(letter) === -1 && letter !== " ") {
            originalAlphabet.push(letter);
        }
    }

    for (i = 0; i < transformedAlphabet.length; i++) {
        letter = transformedAlphabet[i];
        if (originalAlphabet.indexOf(letter) === -1) {
            originalAlphabet.push(letter);
        }
    }

    var output = '';
    for (i = 0; i < inputText.length; i++) {
        letter = inputText.slice(i, i + 1);
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

    return output;
}