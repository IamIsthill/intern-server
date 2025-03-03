const isBool = (bool) => {
    if (bool) {
        if (bool === 'false') {
            return false
        }
        return true
    } else {
        return false
    }
}

module.exports = {
    isBool
}