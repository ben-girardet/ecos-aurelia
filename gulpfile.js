var gulp = require("gulp");

gulp.task("copy:html", gulp.series(function() {
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("dist/commonjs"))
    .pipe(gulp.dest("dist/native-modules"))
}));

gulp.task("copy:css", gulp.series(function() {
  return gulp.src("src/**/*.css")
    .pipe(gulp.dest("dist/commonjs"))
    .pipe(gulp.dest("dist/native-modules"))
  }));

gulp.task("copy:json", gulp.series(function() {
  return gulp.src("src/**/*.json")
    .pipe(gulp.dest("dist/commonjs"))
    .pipe(gulp.dest("dist/native-modules"))
  }));

gulp.task("default", gulp.series(["copy:html", "copy:css", "copy:json"]));
