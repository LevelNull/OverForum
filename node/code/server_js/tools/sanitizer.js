module.exports = {
    noSpecial:          noSpecial,
    containsNumeral:    containsNumeral,
    isEmailAddress:     isEmailAddress
}

function noSpecial(str){
    var regex = /^[A-Za-z0-9 ]+$/;
    return regex.test(str);
}
function containsNumeral(str){
    return /\d/.test(str);
}
function isEmailAddress(str){
    var reg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    return reg.test(str);
}