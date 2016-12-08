var gulp = require("gulp"),
    ts = require("gulp-typescript"),
	del = require('del');

// copies any game assets to the bin folder
gulp.task("assets", function()
{
	return gulp.src("./src/**/*.{png,json,jpg,mp3,wav,html,js}")
	.pipe(gulp.dest("./bin/"));
});

// compiles the typescript
gulp.task("ts", function()
{
	return gulp.src("./src/**/*.ts")
		.pipe(ts({ out: "game.js", target: "es6" }))
		.pipe(gulp.dest("./bin"));
});

// cleans the bin folder
gulp.task("clean", function()
{
	return del(['./bin']);
});

// compiles the sample game
gulp.task("default", ["clean"], function()
{
	return gulp.start(["assets", "ts"]);
});

// NOTE: this requires that you have Electron globally installed:
// npm install -g electron
gulp.task("run", function()
{
	var exec = require("child_process").exec;
	exec("electron ./bin/");
});