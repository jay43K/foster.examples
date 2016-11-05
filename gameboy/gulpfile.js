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

// Note: This task wont work for you unless electron.exe is in the same location
// so should probably swap this out with some kind of npm module that does it for us?
// will look into it later ...
gulp.task("run", function()
{
	var exec = require("child_process").execFileSync;
	exec("C:/Program Files/Electron/electron.exe", [__dirname + "/bin/"]);
	process.exit();
});