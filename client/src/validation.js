const emailValidator = require('email-validator');

function checkString(string) {
    if (!string) throw 'You must provide a string';
    if (typeof string !== 'string') throw 'You must provide a valid string';
    string = string.trim();
    if (string.length === 0) throw 'You must provide a nonempty string';
    return string;
}

function checkNumber(num) {
    if (!num) throw 'You must provide a number';
    num = Number(num);
    if (isNaN(num)) throw 'You must provide a valid number';
    return num;
}

function checkInteger(int) {
    int = checkNumber(int);
    if (!Number.isInteger(int)) throw 'You must provide a valid integer';
    return int;
}

function checkPositiveInteger(int) {
    int = checkInteger(int);
    if (int <= 0) throw 'You must provide a positive integer';
    return int;
}

function checkEmail(email) {
    email = checkString(email);
    if (!emailValidator.validate(email)) throw 'You must provide a valid email';
    return email;
}

function checkPassword(password) {
    password = checkString(password);
    if (/\s/g.test(password)) throw 'Password must not contain spaces';
    if (password.length < 6) throw 'Password must be at least 6 characters in length';
    return password;
}

function comparePasswords(password, confirmPassword) {
    confirmPassword = checkPassword(confirmPassword);
    if (confirmPassword != password) throw 'Passwords must match';
    return confirmPassword;
}

module.exports = {
    checkString,
    checkNumber,
    checkInteger,
    checkPositiveInteger,
    checkEmail,
    checkPassword,
    comparePasswords
}