#!/usr/bin/env node
var async    = require('async');
var sqlite3 = require('sqlite3').verbose();
var path = '/Volumes/Gandalf/Pictures/Lightroom/Lightroom\ Catalog.lrcat';
var db = new sqlite3.Database(path, 'OPEN_READONLY');

function getFile(tag) {
	var absolutePath, pathFromRoot, baseName, extension, filename;
	var tasks = [
		fileAbsolutePath, filePathFromRoot, fileBaseName, fileExtension, buildFilename, createCopy
	];

	// Each function below is executed in order
	async.series(tasks, finish);

	function fileAbsolutePath(cb) {
		db.parallelize(function(){
		    	db.get("SELECT absolutePath from AgLibraryRootFolder where id_local=(SELECT rootFolder from AgLibraryFolder where id_local=(SELECT folder from AgLibraryFile where id_local=(SELECT rootFile from adobe_images where captureTime=(SELECT max(captureTime) FROM adobe_images AS A JOIN (SELECT image from aglibrarykeywordimage where tag=(SELECT id_local from aglibrarykeyword where lc_name='"+tag+"')) AS B ON A.id_local=B.image where pick=1.0))))"
		    	, function(err, row) {
				if (err){
					console.log(err);
					process.exit(69);
				}
				else{
					absolutePath = row.absolutePath;
					cb();
				}
			});
		});
	}

	function filePathFromRoot(cb) {
		db.parallelize(function(){
		    	db.get("SELECT pathFromRoot from AgLibraryFolder where id_local=(SELECT folder from AgLibraryFile where id_local=(SELECT rootFile from adobe_images where captureTime=(SELECT max(captureTime) FROM adobe_images AS A JOIN (SELECT image from aglibrarykeywordimage where tag=(SELECT id_local from aglibrarykeyword where lc_name='"+tag+"')) AS B ON A.id_local=B.image where pick=1.0)))"
		    	, function(err, row) {
				if (err){
					console.log(err);
					process.exit(69);
				}
				else{
					pathFromRoot = row.pathFromRoot;
					cb();
				}
			});
		});
	}

	function fileBaseName(cb) {
		db.parallelize(function(){
		    	db.get("SELECT baseName from AgLibraryFile where id_local=(SELECT rootFile from adobe_images where captureTime=(SELECT max(captureTime) FROM adobe_images AS A JOIN (SELECT image from aglibrarykeywordimage where tag=(SELECT id_local from aglibrarykeyword where lc_name='"+tag+"')) AS B ON A.id_local=B.image where pick=1.0))"
		    	, function(err, row) {
				if (err){
					console.log(err);
					process.exit(69);
				}
				else{
					baseName = row.baseName;
					cb();
				}
			});
		});
	}

	function fileExtension(cb) {
		db.parallelize(function(){
			db.get("SELECT lc_idx_filenameExtension from AgLibraryFile where id_local=(SELECT rootFile from adobe_images where captureTime=(SELECT max(captureTime) FROM adobe_images AS A JOIN (SELECT image from aglibrarykeywordimage where tag=(SELECT id_local from aglibrarykeyword where lc_name='"+tag+"')) AS B ON A.id_local=B.image where pick=1.0))"
		    	, function(err, row) {
				if (err){
					console.log(err);
					process.exit(69);
				}
				else{
					extension = row.lc_idx_filenameExtension;
					cb();
				}
			});
		});
	}

	function buildFilename(cb) {
		filename = absolutePath+pathFromRoot+baseName+'.'+extension;
		cb(null, filename);
	}
	function finish(err, results){
		console.log(filename+' is a '+extension);
	}

};

getFile('auriana');
getFile('sophie');
getFile('jane');
db.close();