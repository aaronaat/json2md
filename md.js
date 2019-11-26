var fs = require('fs'); //to access filewrite
var toMarkdown = require ('to-markdown'); //to convert HTML to Markdown
var request = require("request"); //to request the JSON file from the server
var tomlify = require('tomlify'); //to add the frontmatter

    //Request options
    var options = {
       method: 'GET',
       json: true,
       url: 'YOUR_API_URL',
       /* headers:  
           {   'cache-control': 'no-cache',
               'x-apikey': 'YOUR_API_KEY' } 
      }; optional */

    //Request
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        
        var obj = body; //The actual JSON from the API
        console.log("Start converting API to files");

       //Split up the JSON response
        for (var i=0; i<obj.length; i++) {

            var toFrontmatter = obj[i]; 
            var htmlstring = obj[i].content; //The content that goes into the Markdown part
            var markdowntext = toMarkdown(htmlstring); //The HTML conversion
            delete toFrontmatter['_id']; //Deleting the stuff that I do not need to put into the frontmatter
            delete toFrontmatter['content'];   //Deleting the stuff that I do not need to put into the frontmatter
            var obj2 = tomlify(toFrontmatter, {delims: true}); //Creating the frontmatter
            obj2 = obj2 +"\n" + markdowntext; //Putting it all togeter
            var file = './content/posts/' + obj[i].slug+'.md'; //I have set up a slug as the file name in my CMS and don't forget to create the directory structure in advance.
            fs.writeFile(file, obj2, function (err) {  //writing it out to the filesystem
                 if (err) {
                     console.error(err);
                 } else {
                     console.log("Done converting API", obj2); 
                 }
            });
         }
      });