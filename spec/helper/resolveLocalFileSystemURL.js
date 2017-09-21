module.exports = global.resolveLocalFileSystemURL = function (path, win, fail) {
    if (win && typeof win === 'function') {
        win({
            toURL: function () {
                return 'file://' + path;
            }
        });
    }
};
