var fs = require('fs');
var readline = require('./readline');

var NL = '\n';
var GLUE = ' ';
var NEEDLE = '|';
var INPUT_FILE = './test.csv';
var OUTPUT_FILE = './out.csv';

// We create a write stream, we will append the
// transformed content to this file, line by line.
var outStream = fs.createWriteStream(OUTPUT_FILE);

readline(INPUT_FILE)
.on('header', function transformHeader(line){ // this handler only gets called for the first line
    var out = '';
    // Make an array with our line content using
    // the pipe symbol as breaking point
    var chunks = line.split(NEEDLE);

    /* This is the CSV header: We want to go from:
     *    Radio station | latitude, longitude | latitude, longitude | latitude, longitude
     * to:
     *    Radio station, latitude, longitude
     */
    out = [chunks[0], ',', chunks[1]].join(GLUE) + NL;
    outStream.write(out);
})
.on('line', function transformLine(line) {
    var out = '';
    // Make an array with our line content using
    // the pipe symbol as breaking point
    var chunks = line.split(NEEDLE);

        /*
         * Here we need to expand each content line from this:
         *     1 | a, b | c, d | e, f
         * to:
         * 1, a, b
         * 1, c, d
         * 1, e, f
         *
         * To do so we use out as a buffer.
         * We are manually building the first line
         */
        var id = chunks.shift();
        out = [ id, ',', chunks.shift(), NL].join(GLUE);
        // And then appending each subsequent chunk item
        // to our out string buffer.
        chunks.forEach(function(item) {
            out += [id, ',', item, NL].join(GLUE);
        });


    outStream.write(out);

}).on('end', function endFile() {
    // Terminate file with new line.
    outStream.end(NL);
});