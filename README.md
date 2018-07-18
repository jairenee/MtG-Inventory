MtG Inventory (Working name)
==============

This is a tool I'm working on for organizing my large inventory of Magic the Gathering cards. The original goal was just to create a way to programatically update my Google Spreadsheet automatically. Once I got the start of a CLI working, I realized it would be a lot cooler to make a web app, since I have zero experience making something of this size. (Not how it is currently, but how I intend it to be when it's complete).

I figured this might be helpful for other people. I'll be building this with CI/CD on my home server for releases, but for now, you'll need some setup for this to work in development.

Installation
-------

#### Requirements

**Electron**: `npm install -g electron@2.0.5`

`cd` into the directory and run `npm install`

Then you can simply start the application by running `npm start dev`