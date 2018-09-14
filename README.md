# GPS.Markedpp

This extension performs pre-processing on Markdown (or any other text file) with the [markedpp](https://github.com/commenthol/markedpp) node.js module.

Simply configure the .gps.markedpp config file to define the root source files and options for markedpp, then invoke the "GPS: Transform" command.

## Features

GPS.Markedpp allows for all options of markedpp to be used including:

- Generation of a "Table of Contents"
- Automatic numbering of Headings
- Include various files into a single output document
- Sorted collection of References
- Autonumbering of ordered lists
- Automatic update of heading identifiers

## Requirements

There are no dependencies for this plugin that won't be installed by VS-Code.

## Extension Settings

GPS.Markedpp uses a configuration file named .gps.markedpp that contains the location of the root files to process.  

The format of .gps.markedpp

```json
{
    "rootSourceFiles": [
        "./example/manual.md"
    ],
    "outputDirectory": "./example/transformed",
    "options": {
        "gfm": true,
        "include": true,
        "toc": true,
        "numberedheadings": true,
        "ref": true,
        "breaks": true,
        "tags": true,
        "level": 3,
        "minlevel": 1,
        "autonumber": true,
        "autoid": true,
        "githubidv": false    
    }
}
```
- **rootSourceFiles** is an array of filenames (including path if necessary) that points to files that are to be the beginning of a transformation.  You can have multiple transformations across multiple root files.
- **outputDirectory** specifies the location for the transformed files to be written to.
- **options** specifies the [markedpp options](https://github.com/commenthol/markedpp#usage) to pass to the pre-processor.

## Known Issues

None... at this time.

## Release Notes

### 1.0.0

Initial release of GPS.Marked

### GPS.Markedpp is released under the MIT license.

###### (c) 2018, Gateway Programming School, Inc.