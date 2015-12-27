#!/usr/bin/env node
var os = require('os');
var async    = require('async');
var sqlite3 = require('sqlite3');
var child_process     = require('child_process');
// var SmartCrop = require('smartcrop-node');

var argv = require('yargs')
	.usage('Usage: $0 [options] [tags]')
	.option('c', {
	        alias: 'catalog',
	        default: os.homedir()+'/Pictures/Lightroom/Lightroom\ Catalog.lrcat',
	        defaultDescription: '$HOME/Pictures/Lightroom/Lightroom\ Catalog.lrcat',
	        describe: 'Absolute path to the Lightroom Catalog you want to use.  Useful for catalogs on external drives.',
	        type: 'string'
	    })
	.option('s', {
	        alias: 'size',
	        default: 500,
	        describe: 'Maximum longest edge in pixels',
	        type: 'string'
	    })
	.option('u', {
	        alias: 'ubersicht',
	        boolean: true,
	        describe: false
	    })
	.demand(1, 'Please include a keyword!')
  .showHelpOnFail(false)
	.help('h')
	.alias('h', 'help')
	.argv
;

var db = new sqlite3.Database(argv.c, 'OPEN_READONLY');

async.each(argv._, function(tag){
	getFile(tag);
}, function(err){
	if( err ) {
      console.log(err);
    }
});

function getFile(tag) {
	var absolutePath, pathFromRoot, baseName, extension, filename;
	var tasks = [
		fileAbsolutePath, filePathFromRoot, fileBaseName, fileExtension, buildFilename, convertImage, /*cropImage*/
	];

	// Each function below is executed in order
	async.series(tasks, finish);

	function fileAbsolutePath(cb) {
		db.parallelize(function(){
		    	db.get("SELECT absolutePath from AgLibraryRootFolder where id_local=(SELECT rootFolder from AgLibraryFolder where id_local=(SELECT folder from AgLibraryFile where id_local=(SELECT rootFile from adobe_images where captureTime=(SELECT max(captureTime) FROM adobe_images AS A JOIN (SELECT image from aglibrarykeywordimage where tag=(SELECT id_local from aglibrarykeyword where lc_name='"+tag+"')) AS B ON A.id_local=B.image where pick=1.0))))"
		    	, function(err, row) {
				if (err){
					console.log(err);
					process.exit(2);
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
					process.exit(2);
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
					process.exit(2);
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
					process.exit(2);
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
		cb();
	}

	function convertImage(cb) {
		if (argv.u) {
			child_process.exec(['/usr/local/bin/convert -units PixelsPerInch ' + filename + ' -colorspace sRGB -density 72 -format JPG -quality 80 -resize '+argv.s+'x'+argv.s+' -auto-orient "' + process.cwd()+'/lightroom-latest.widget/'+tag+'-latest.jpg"'], function(err) {
		      if (err instanceof Error) {
		        console.log(err);
		        process.exit(1);
		      }
		      cb();
		    });
		} else {
			child_process.exec(['convert -units PixelsPerInch ' + filename + ' -colorspace sRGB -density 72 -format JPG -quality 80 -resize '+argv.s+'x'+argv.s+' -auto-orient "' + process.cwd()+'/'+tag+'-latest.jpg"'], function(err) {
		      if (err instanceof Error) {
		        console.log(err);
		        process.exit(1);
		      }
		      cb();
		    });
		}
	}

	function cropImage(cb) {
		// Once this is working again, change convertImage above to return tag-tmp.jpg, and the finish function below to remove the tmp file.

		SmartCrop.crop({
			height: 350,
			width: 467,
	    input: process.cwd()+'/'+tag+'-tmp.jpg',
	    output: process.cwd()+'/'+tag+'-latest.jpg'
		});
		cb();
	}

	function finish(err, results){
		if (argv.u) {
			console.log('./lightroom-latest.widget/'+ tag +'-latest.jpg,');
		} else {
      console.log(tag+' Done.');
    }
	}

};

db.close();