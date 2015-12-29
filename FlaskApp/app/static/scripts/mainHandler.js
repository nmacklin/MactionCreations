/**
 * Created by Nick on 12/27/2015.
 */

var ancillaryInputContainer = document.querySelector("#ancillaryInputContainer");
var encryptionMethodList = document.querySelector("#encryptionMethod");
encryptionMethodList.addEventListener("change", function () {
    var selectedMethod = encryptionMethodList.value;
    var options = encryptionMethods[selectedMethod];
    for (var ancillary in options.ancillaries) {
        var ancillaryCount = 0;
        if (options.ancillaries.hasOwnProperty(ancillary)) {
            var ancillaryInput = document.createElement("INPUT");
            ancillaryInput.type = "text";
            ancillaryInput.className = "codeStyle ancillaryInput";
            ancillaryInput.id = "ancillaryInput" + String(ancillaryCount);
            console.log(ancillaryInput.id);
            ancillaryInput.value = options.ancillaries.ancillaryInput1;
            ancillaryInputContainer.appendChild(ancillaryInput);
            ancillaryCount++;

            for (var i = 0; i < 2; i++) {
                var lineBreak = document.createElement("BR");
                ancillaryInputContainer.appendChild(lineBreak);
            }
        }
    }
});

var encryptButton = document.querySelector("#encryptButton");
encryptButton.addEventListener("click", function () {
    var encryptFunction = encryptionMethods[encryptionMethodList.value].encryptFunction;
    encryptFunction();
});

var decryptButton = document.querySelector("#decryptButton");
decryptButton.addEventListener("click", function () {
    var decryptFunction = encryptionMethods[encryptionMethodList.value].decryptFunction;
    decryptFunction();
});
