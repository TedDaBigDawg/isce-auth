"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateRandomString = void 0;
exports.generateCode = generateCode;
const GenerateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.GenerateRandomString = GenerateRandomString;
function generateCode() {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let randomNumbers = '';
    for (let i = 0; i < 5; i++) {
        randomNumbers += getRandomNumber(0, 9).toString();
    }
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet.charAt(getRandomNumber(0, alphabet.length - 1));
    const randomString = randomNumbers + randomLetter;
    return randomString;
}
//# sourceMappingURL=utils.js.map