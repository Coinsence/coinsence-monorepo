const gulp = require("gulp");
const apidoc = require("gulp-apidoc");

gulp.task("apidoc", (done) => {
    apidoc({
        src: "./lib/http/",
        dest: "./docs/apidoc"
    }, done);
});

gulp.task("watch", () => {
    gulp.watch(["./lib/http/apps/**"], ["apidoc"]);
});
