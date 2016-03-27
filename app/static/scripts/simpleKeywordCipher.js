/**
 * Created by Nick on 12/28/2015.
 */

function simpleKeywordCipherEncrypt () {
    var inputText = getText();
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
    var inputText = getText();
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

function PartialSolution (oldSolution, wordList) {
    this.anyLongWordSolved = false;
    this.solvedAllLongWords = false;
    if (oldSolution == null) {
        this.words = {};
        this.subReg = {};
        this.solvedLetters = {};
        this.solvedLetterValues = [];
        this.solvedLettersJSON = "";
        this.unknownWords = 0;

        this.words.numWords = wordList.length;
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < wordList.length; i++) {
            var word = wordList[i];
            var letters = [];
            var subRegWord = [];
            for (var j = 0; j < word.length; j++) {
                if (alphabet.indexOf(word.charAt(j)) > -1 || j !== word.length - 1) {
                    letters.push(word.charAt(j));
                    if (alphabet.indexOf(word.charAt(j)) === -1) {
                        subRegWord.push(true);
                    }
                    else {
                        subRegWord.push(false);
                    }
                }
            }
            this.words[i] = letters;
            this.subReg[i] = subRegWord;
        }

        for (i = 0; i < 26; i++) {
            this.solvedLetters[alphabet.charAt(i)] = null;
        }
        this.solvedLettersJSON = JSON.stringify(this.solvedLetters);
    }
    else {
        this.words = JSON.parse(JSON.stringify(oldSolution.words));
        for (i = 0; i < this.words.numWords; i++) {
            word = this.words[i];
            for (j = 0; j < word.length; j++) {

            }
        }
        this.subReg = JSON.parse(JSON.stringify(oldSolution.subReg));
        this.solvedLetters = JSON.parse(JSON.stringify(oldSolution.solvedLetters));
        this.solvedLetterValues = JSON.parse(JSON.stringify(oldSolution.solvedLetterValues));
        this.solvedLettersJSON = JSON.stringify(this.solvedLetters);
        this.unknownWords = oldSolution.unknownWords;
    }
}

function cleanInput () {
    var inputText = getText();
    inputText = inputText.toUpperCase();
    inputText = inputText.replace(/\n/g, " ");
    var wordList = inputText.split(" ");

    var flagForClear = [];
    for (var i = 0; i < wordList.length; i++) {
        var word = wordList[i];
        if (word.length === 0) {
            flagForClear.push(i);
        }
    }
    for (i = flagForClear.length - 1; i >= 0; i--) {
        wordList.splice(flagForClear[i], 1);
    }

    flagForClear = [];
    var omittedWords = {};
    for (i = 0; i < wordList.length; i++) {
        word = wordList[i];
        var patt = /\d/;
        if (patt.test(word)) {
            omittedWords[i] = word;
            flagForClear.push(i);
        }
    }
    for (i = flagForClear.length - 1; i >= 0; i--) {
        wordList.splice(flagForClear[i], 1);
    }

    return [omittedWords, wordList];
}

PartialSolution.prototype.outputString = function () {
    var output = "";
    for (var i = 0; i < this.words.numWords; i++) {
        var word = this.words[i];
        for (var j = 0; j < word.length; j++) {
            output += word[j];
        }
        output += " ";
    }
    return output;
};

PartialSolution.prototype.updateCiphertext  = function () {
    for (var i = 0; i < this.words.numWords; i++) {
        var word = this.words[i];
        for (var j = 0; j < word.length; j++) {
            if (this.subReg[i][j] === false && this.solvedLetters[word[j]] !== null) {
                word[j] = this.solvedLetters[word[j]];
                this.subReg[i][j] = true;
            }
        }
    }
    this.solvedLettersJSON = JSON.stringify(this.solvedLetters);
    this.solvedLetterValues = [];
    for (var letter in this.solvedLetters) {
        if (this.solvedLetters.hasOwnProperty(letter) && this.solvedLetters[letter] !== null) {
            this.solvedLetterValues.push(this.solvedLetters[letter]);
        }
    }
};

function oneLetterWords (partialSolutions) {
    var singleLetterWords = [];
    var oldSolution = partialSolutions[0];
    for (var i = 0; i < oldSolution.words.numWords; i++) {
        var word = oldSolution.words[i];
        if (word.length === 1 && singleLetterWords.indexOf(word[0]) === -1) {
            singleLetterWords.push(word[0]);
        }
    }
    if (singleLetterWords.length === 0) {
        console.log("No single letter words found.");
        return partialSolutions;
    }
    var tempPartialSolutions = [];
    if (singleLetterWords.length === 1) {
        console.log("One single-letter-word found");
        var newSolution1 = new PartialSolution(oldSolution);
        var newSolution2 = new PartialSolution(oldSolution);
        newSolution1.solvedLetters[singleLetterWords[0]] = 'a';
        newSolution2.solvedLetters[singleLetterWords[0]] = 'i';
        newSolution1.updateCiphertext();
        newSolution2.updateCiphertext();
        tempPartialSolutions.push(newSolution1);
        tempPartialSolutions.push(newSolution2);
    }
    else {
        console.log("Multiple single letter words found.");
        for (i = 0; i < singleLetterWords.length; i++) {
            for (var j = 0; j < singleLetterWords.length; j++) {
                if (i !== j) {
                    var newSolution = new PartialSolution(oldSolution);
                    newSolution.solvedLetters[singleLetterWords[i]] = 'a';
                    newSolution.solvedLetters[singleLetterWords[j]] = 'i';
                    newSolution.updateCiphertext();
                    tempPartialSolutions.push(newSolution);
                }
            }
        }
    }
    partialSolutions = tempPartialSolutions;
    return partialSolutions;
}

function generateThe (partialSolutions) {
    var tempSolutions = [];
    for (var i = 0; i < partialSolutions.length; i++) {
        var partialSolution = partialSolutions[i];
        for (var j = 0; j < partialSolution.words.numWords; j++) {
            var word = partialSolution.words[j];
            if (word.length === 3) {
                var wordSubReg = partialSolution.subReg[j];
                var wordModified = false;
                for (var k = 0; k < wordSubReg.length; k++) {
                    if (wordSubReg[k] === true) {
                        wordModified = true;
                        break;
                    }
                }
                if (!wordModified) {
                    var newSolution = new PartialSolution(partialSolution);
                    newSolution.solvedLetters[word[0]] = 't';
                    newSolution.solvedLetters[word[1]] = 'h';
                    newSolution.solvedLetters[word[2]] = 'e';
                    newSolution.solvedLettersJSON = JSON.stringify(newSolution.solvedLetters);
                    newSolution.updateCiphertext();

                    var solutionUnique = true;
                    for (var l = 0; l < tempSolutions.length; l++) {
                        if (newSolution.solvedLettersJSON === tempSolutions[l].solvedLettersJSON) {
                            solutionUnique = false;
                            break;
                        }
                    }
                    if (solutionUnique) {
                        tempSolutions.push(newSolution);
                    }
                }
            }
        }
    }
    if (tempSolutions.length === 0) {
        return partialSolutions;
    }
    return tempSolutions;
}

function longestWordSolver (partialSolution, solvedLetterThreshold) {
    var failedCandidates = [];
    var solutions = [];
    var longWordsReference = Object.keys(sevenLetterWords);
    currentAttempt:
    while (solutions.length === 0) {
        var longestWordFinder = {
        index: null,
        length: 0
        };
        for (var i = 0; i < partialSolution.words.numWords; i++) {
            if (partialSolution.words[i].length >= longestWordFinder.length && failedCandidates.indexOf(i) === -1) {
                longestWordFinder.length = partialSolution.words[i].length;
                longestWordFinder.index = i;
            }
        }
        var longestWord = partialSolution.words[longestWordFinder.index];

        if (longestWord.length < 7) {
            if (!partialSolution.anyLongWordSolved) break;
            partialSolution.solvedAllLongWords = true;
            solutions.push(partialSolution);
            return solutions;
        }
        var longestWordSolvedLetters = {};
        for (i = 0; i < longestWord.length; i++) {
            if (partialSolution.solvedLetters[longestWord[i].toUpperCase()] === undefined) {
                failedCandidates.push(longestWordFinder.index);
                continue currentAttempt;
            }
            if (partialSolution.subReg[longestWordFinder.index][i]) {
                longestWordSolvedLetters[i] = longestWord[i];
            }
        }
        if (Object.keys(longestWordSolvedLetters).length < solvedLetterThreshold
            || Object.keys(longestWordSolvedLetters).length === longestWord.length) {
            failedCandidates.push(longestWordFinder.index);
            continue;
        }
        currentWord:
        for (i = 0; i < longWordsReference.length; i++) {
            if (longWordsReference[i].length === longestWord.length) {
                var match = true;
                for (var index in longestWordSolvedLetters) {
                    if (longestWordSolvedLetters.hasOwnProperty(index)) {
                        if (longWordsReference[i].charAt(Number(index)) !== longestWordSolvedLetters[index]) {
                            match = false;
                            break;
                        }
                    }
                }
                // Don't even try to read this.
                if (match) {
                    var newSolution = new PartialSolution(partialSolution);
                    for (var j = 0; j < longestWord.length; j++) {
                        if (longestWordSolvedLetters[j] == undefined) {
                            // Second condition allows for letter occurring in same word twice.
                            if (newSolution.solvedLetters[longestWord[j]] !== null
                                && newSolution.solvedLetters[longestWord[j]] !== longWordsReference[i].charAt(j)
                                || newSolution.solvedLetterValues.indexOf(longWordsReference[i].charAt(j)) !== -1) {
                                continue currentWord;
                            }
                            newSolution.solvedLetters[longestWord[j]] = longWordsReference[i].charAt(j);
                        }
                    }
                    console.log("Successful match with " + longestWord.join("") + " and " + longWordsReference[i]);
                    newSolution.updateCiphertext();
                    newSolution.anyLongWordSolved = true;
                    solutions.push(newSolution);
                }
            }
        }
        if (solutions.length === 0) {
            failedCandidates.push(longestWordFinder.index);
        }
    }
    return solutions;
}

function longestWordFinderLoop (partialSolutions, possibleSolutions, solvedLetterThreshold) {
    for (var i = 0; i < partialSolutions.length; i++) {
        var newPartialSolutions = longestWordSolver(partialSolutions[i], solvedLetterThreshold);
        if (newPartialSolutions.length === 0) {
            console.log("Branch terminated.");
            continue;
        }
        if (newPartialSolutions.length === 1 && newPartialSolutions[0].solvedAllLongWords) {
            console.log("Adding possible solution!!");
            possibleSolutions.push(newPartialSolutions[0]);
            continue;
        }
        console.log("Number solutions: " + newPartialSolutions.length);
        console.log(newPartialSolutions);
        longestWordFinderLoop(newPartialSolutions, possibleSolutions, 5);
    }
    if (possibleSolutions.length === 0 && solvedLetterThreshold > 2) {
        console.log("Reducing solved letter threshold.");
        longestWordFinderLoop(partialSolutions, possibleSolutions, solvedLetterThreshold - 1)
    }
}

function oneLetterRemainingWordSolver (partialSolutions) {
    var tempSolutions = [];
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < partialSolutions.length; i++) {
        var oldSolution = partialSolutions[i];
        console.log("Old Solution: " + i);
        var endReached = false;
        var currentSolution = undefined;
        while (!endReached) {
            var unusedLetters = [];
            if (currentSolution == undefined) {
                currentSolution = new PartialSolution(oldSolution);
            }
            for (var j = 0; j < alphabet.length; j++) {
                if (currentSolution.solvedLetterValues.indexOf(alphabet[j]) === -1) {
                    unusedLetters.push(alphabet[j]);
                }
            }
            console.log("Unused letters: " + unusedLetters);
            var lettersTried = {};
            currentWord:
            for (j = 0; j < currentSolution.words.numWords; j++) {
                var wordArray = oldSolution.words[j];
                var unsolvedLettersCount = 0;
                var unsolvedLetterIndex;
                for (var k = 0; k < wordArray.length; k++) {
                    if (!currentSolution.subReg[j][k]) {
                        unsolvedLettersCount++;
                        unsolvedLetterIndex = k;
                    }
                }
                if (unsolvedLettersCount === 1) {
                    if (lettersTried[j] === undefined) {
                        lettersTried[j] = [];
                    }

                    var wordReference;
                    switch (wordArray.length) {
                        case 1:
                            continue;
                        case 2:
                            wordReference = twoLetterWords;
                            break;
                        case 3:
                            wordReference = threeLetterWords;
                            break;
                        case 4:
                            wordReference = fourLetterWords;
                            break;
                        case 5:
                            wordReference = fiveLetterWords;
                            break;
                        case 6:
                            wordReference = sixLetterWords;
                            break;
                        default:
                            wordReference = sevenLetterWords;
                            break;
                    }
                    for (k = 0; k < unusedLetters.length; k++) {
                        if (lettersTried[j].indexOf(unusedLetters[k]) === -1) {
                            var testWord = wordArray.slice();
                            testWord[unsolvedLetterIndex] = unusedLetters[k];
                            if (wordReference[testWord.join("")]) {
                                lettersTried[j].push(unusedLetters[k]);
                                currentSolution.solvedLetters[wordArray[unsolvedLetterIndex]] = unusedLetters[k];
                                currentSolution.updateCiphertext();
                                break currentWord;
                            }
                        }
                    }
                }
            }
            if (j === currentSolution.words.numWords) {
                tempSolutions.push(currentSolution);
                endReached = true;
                console.log("End reached!");
            }
        }
    }
    if (tempSolutions.length === 0) {
        tempSolutions = partialSolutions;
    }
    console.log("tempSolutions: " + tempSolutions.length);
    return tempSolutions;
}

function fractionSolvedWordsCorrect (partialSolution) {
    var solvedWordsCount = 0;
    var knownWordsCount = 0;
    currentWord:
    for (var i = 0; i < partialSolution.words.numWords; i++) {
        for (var j = 0; j < partialSolution.words[i].length; j++) {
            if (!partialSolution.subReg[i][j]) {
                continue currentWord;
            }
        }
        solvedWordsCount++;
        var wordReference;
        switch (partialSolution.words[i].length) {
            case 1:
                continue;
            case 2:
                wordReference = twoLetterWords;
                break;
            case 3:
                wordReference = threeLetterWords;
                break;
            case 4:
                wordReference = fourLetterWords;
                break;
            case 5:
                wordReference = fiveLetterWords;
                break;
            case 6:
                wordReference = sixLetterWords;
                break;
            default:
                wordReference = sevenLetterWords;
                break;
        }
        if (wordReference[partialSolution.words[i].join("")]) knownWordsCount++;
    }
    return knownWordsCount / solvedWordsCount;
}

function selectBestSolution (partialSolutions) {
    // TODO: What if many solutions are tied for most unknown words??
    var bestSolution = [];
    var bestSolutionFraction = 0;
    for (var i = 0; i < partialSolutions.length; i++) {
        var fractionKnown = fractionSolvedWordsCorrect(partialSolutions[i]);
        if (fractionKnown > bestSolutionFraction) {
            bestSolution[0] = partialSolutions[i];
            bestSolutionFraction = fractionKnown;
        }
        else if (fractionKnown === bestSolutionFraction) {
            bestSolution.push(partialSolutions[i]);
        }
    }
    return bestSolution;
}

function replaceOmittedWords (partialSolutions, omittedWords) {
    for (var i = 0; i < partialSolutions.length; i++) {
        var partialSolution = partialSolutions[i];
        var wordList = [];
        for (var j = 0; j < partialSolution.words.numWords; j++) {
            wordList.push(partialSolution.words[j]);
        }
        for (var index in omittedWords) {
            if (omittedWords.hasOwnProperty(index)) {
                var omittedWord = omittedWords[index];
                console.log("Omitted word: " + omittedWord);
                var decipheredWord = [];
                for (j = 0; j < omittedWord.length; j++) {
                    var outputChar = partialSolution.solvedLetters[omittedWord.charAt(j)];
                    if (outputChar !== null && outputChar != undefined) {
                        decipheredWord.push(partialSolution.solvedLetters[omittedWord.charAt(j)]);
                    }
                    else {
                        decipheredWord.push(omittedWord.charAt(j));
                    }
                }
                console.log("Deciphered word: ");
                console.log(decipheredWord);
                wordList.splice(index, 0, decipheredWord);
            }
        }
        for (j = 0; j < wordList.length; j++) {
            partialSolution.words[j] = wordList[j];
        }
        partialSolution.words.numWords = wordList.length;
    }
}

function simpleKeywordCipherCrack () {
    var inputCleaning = cleanInput();
    var omittedWords = inputCleaning[0];
    var initialParse = new PartialSolution(undefined, inputCleaning[1]);
    var partialSolutions = [];
    partialSolutions.push(initialParse);
    console.log("Initial array: ");
    console.log(partialSolutions);

    partialSolutions = oneLetterWords(partialSolutions);
    console.log("oneLetterWords: ");
    console.log(partialSolutions);

    partialSolutions = generateThe(partialSolutions);
    console.log('generateThe');
    console.log(partialSolutions);

    var longestWordFinderOutput = [];
    longestWordFinderLoop(partialSolutions, longestWordFinderOutput, 5);
    partialSolutions = longestWordFinderOutput;
    console.log("Results of solving long words: ");
    console.log(partialSolutions);

    partialSolutions = selectBestSolution(partialSolutions);
    console.log("Best solution(s): ");
    console.log(partialSolutions);

    partialSolutions = oneLetterRemainingWordSolver(partialSolutions);
    console.log("Attempted to solve words with one letter remaining unsolved.");
    console.log(partialSolutions);
    for (var i = 0; i < partialSolutions.length; i++) {
        console.log(partialSolutions[i].outputString());
    }

    partialSolutions = selectBestSolution(partialSolutions);
    replaceOmittedWords(partialSolutions, omittedWords);
    if (partialSolutions.length === 1) {
        return partialSolutions[0].outputString();
    }
    if (partialSolutions.length === 0) {
        return "Cryptanalysis failed.";
    }
}