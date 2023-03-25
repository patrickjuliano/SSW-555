const { ObjectId } = require('mongodb');
const emailValidator = require('email-validator');

function checkFile(file) {
    if (!(file instanceof File)) throw 'You must provide a valid file';
    return file;
}

function checkBoolean(bool) {
    if (typeof bool === 'string') {
        bool = bool.toLowerCase();
        if (bool === 'true') bool = true;
        else if (bool === 'false') bool = false;
    }
    if (typeof bool !== 'boolean') throw 'You must provide a valid boolean';
    return bool;
}

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

function checkNonnegativeInteger(int) {
    int = checkInteger(int);
    if (int < 0) throw 'You must provide a nonnegative integer';
    return int;
}

function checkDate(day, month, year) {
    day = checkNonnegativeInteger(day);
    month = checkNonnegativeInteger(month);
    year = checkNonnegativeInteger(year);
    if (((month === 2) && ((day > 29) || ((day === 29) && ((year % 400 !== 0) && ((year % 4 !== 0) || (year % 100 === 0)))))) ||
    ((month === 4 || month === 6 || month === 9 || month === 11) && (day > 30)) ||
    ((month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) && (day > 31))) throw 'You must provide a valid date';
    return { day, month, year };
}

function checkId(id) {
    id = checkString(id);
    if (!ObjectId.isValid(id)) throw 'You must provide a valid id';
    return id;
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
    checkFile,
    checkBoolean,
    checkString,
    checkNumber,
    checkInteger,
    checkPositiveInteger,
    checkNonnegativeInteger,
    checkDate,
    checkId,
    checkEmail,
    checkPassword,
    comparePasswords
}