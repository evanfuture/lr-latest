lr-latest
=========

lr-latest is a node.js module for pulling the latest Picked photo of a given Keyword from a Lightroom Catalog.

It also includes options for resizing, for use in [Übersicht](http://tracesof.net/uebersicht/), and for multiple keywords.

installation
============

In order to use lr-latest, you'll have to manually install a few things.

First is Homebrew, to make all the rest much easier.  You can install it by following the instructions here:

[Install Homebrew](http://brew.sh/)

Next is ImageMagick plus plugins, which you can install by running the following command:

````bash
brew install libpng jpeg libtiff dcraw little-cms exiv2 freetype webp ufraw --with-exiv2 imagemagick --with-webp
````

This will let you convert whatever image you wish from the Catalog, including raw files and DNGs.

Finally, you can run the basic installer:

````bash
npm install lr-latest -g
````

arguments
=========

By itself,

````bash
lr-latest
````

will currently do nothing, and must be followed by a keyword from which to create a jpeg copy of the latest image that has both that keyword and the Picked flag set in the default Lightroom Catalog.

There are two arguments you can use, shown below alongside their defaults:

**--catalog, -c** "/Users/USERNAME/Pictures/Lightroom/Lightroom\ Catalog.lrcat"

*Absolute path to the Lightroom Catalog you want to use.  Useful for catalogs on external drives.*

**--size, -s** 500

*Maximum longest edge in pixels*

**--help, -h**

*Shows help text.*

**--ubersicht, -u**

*Hidden function to allow the script to work with Ubersicht.  (uses absolute path to convert command, and puts converted images in the lr-latest widget folder).  Boolean value (true or false).*

Any additional arguments without "--[arg]" parsers will be treated as the keywords.  So, `lr-latest --size 500 gopher` will create a 500px wide/tall jpeg copy of the latest picked image with the keyword 'gopher', and `lr-latest --size 500 gopher marigold` will create two images, one from the keyword 'gopher' and one from the keyword 'marigold'.

Übersicht widget
================

You can find a widget for using the images on your desktop with Übersicht here:

[lightroom-latest.widget](https://github.com/evanfuture/lightroom-latest.widget)
