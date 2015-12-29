/**
 * Created by Nick on 12/27/2015.
 */
var encryptionMethods = {
    "Simple Keyword Cipher": {
        ancillaries: {
            ancillaryInput1: "Input keyword"
        },
        encryptFunction: simpleKeywordCipherEncrypt,
        decryptFunction: simpleKeywordCipherDecrypt
    },

    "Please select method...": {
        ancillaries: null,
        targetFunction: function () {alert("Please select method")}
    }
};