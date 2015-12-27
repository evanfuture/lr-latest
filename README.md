lr-latest
=========

lr-latest is a node.js module for pulling the latest Picked photo of a given Keyword from a Lightroom Catalog.

It also includes options for resizing, for use in Übersicht, and for multiple keywords.

installation
============

In order to use lr-latest, you'll have to manually install a few things.

First is Homebrew, to make all the rest much easier.  You can install it by following the instructions here:

Next is ImageMagick plus plugins, which you can install by running the following three commands in order:

````javascript
brew install libpng jpeg libtiff dcraw little-cms exiv2 freetype webp
````

````javascript
brew install ufraw --with-exiv2
````

````javascript
brew install imagemagick --with-webp
````

This will let you convert whatever image you wish from the Catalog, including raw files and DNGs.

Finally, you can run the basic installer:

````javascript
npm install lr-latest -g
````

arguments
=========

By itself,

````javascript
lr-latest
````

will create a fullsize jpeg copy of the latest image that has the Picked flag in the default Lightroom Catalog.

Other arguments you can use, alongside their defaults:

--catalog "/Users/USERNAME/Pictures/Lightroom/Lightroom\ Catalog.lrcat"
  Absolute path to the Lightroom Catalog you want to use.  Useful for catalogs on external drives.

--size 500
  Maximum longest edge in pixels

--help
  Shows help text.

--ubersicht
  Hidden function to allow the script to work with Ubersicht.  (uses absolute path to convert command, and puts converted images in the lr-latest widget folder)

Any additional arguments without "--[arg]" parsers will be treated as keywords.  So, `lr-latest --size 500 gopher` will create a 500px wide/tall jpeg copy of the latest picked image with the keyword 'gopher', and `lr-latest --size 500 gopher marigold` will create two images, one from the keyword 'gopher' and one from the keyword 'marigold'.
