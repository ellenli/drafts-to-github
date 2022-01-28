/*
  Automate publishing from Drafts to GitHub!
  https://github.com/ellenli/drafts-to-github
  
  Original script by Alexander Solovyov
  https://solovyov.net/blog/2020/blog-workflow/
  
  To configure, edit REPO, SOURCE, PATH and SITE. All of them are subject to
  string formatting, so you can use following macros for dynamic URL generation:
  * {year} - four-digit year
  * {month} - two digit month (from 01 to 12)
  * {day} - two digit day (from 01 to 31)
*/

/* Configuration */

// Repository name on Github
var REPO = 'ellenli/notes';
// Where should the file be saved, directory inside repository with site sources
var SOURCE = '';
// Site domain
var SITE = '';
// Path inside source directory *AND* path on site. NOTE: Should they be different?..
var PATH = '';

// Github API base
var BASE = 'https://api.github.com/repos';


/* Connection */

var http = HTTP.create();
var credential = Credential.create('Github', 'Insert Github API token from github.com/settings/tokens');
credential.addTextField('token', 'Personal access token');
credential.authorize();

var TOKEN = credential.getValue('token');


/* Utils */

function pad(i) {
  return (i < 10 ? '0' : '') + i;
}

function format(s, data) {
  return s.replace(/\{([^\}]+)\}/g, function(match, k) {
    return data[k];
  });
}


function getSlug(content) {
  var slug = content.match(/^slug: (.*)$/m);
  if (slug)
    return slug[1];
  var title = content.match(/^title: (.*)$/m);
  if (!title)
  		 var title = content.match(/^# (.*)$/m);
  if (!title)
      throw 'Unknown title!';
  var slug = (title[1]
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''));
  return slug;
}


function req(method, url, data) {
  console.log(method + ' ' + url);
  var res = http.request({
    method: method,
    url: url,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token ' + TOKEN
    },
    encoding: 'json',
    data: data
  });
  if (res.responseText)
    res.data = JSON.parse(res.responseText);
  return res;
}


function urlformat(/* ...bits */) {
  var d = new Date();
  var bits = [].filter.call(arguments, function(x) { return !!x; });
  return format(bits.join('/'),
                {year:  d.getFullYear(),
                 month: pad(d.getMonth() + 1),
                 day:   pad(d.getDate())});
}


/* Logic */

function main() {
  var content = draft.content;
  var slug = getSlug(content);

  var url = urlformat(BASE, REPO, 'contents', SOURCE, PATH, '{year}-{month}-{day}-' + slug + '.md');
  // filename: (?<=\/)[^\/\?#]+(?=[^\/]*$)
    
  var b64 = Base64.encode(content);

  var res = req('GET', url, null);
  console.log('GET response: ' + res.statusCode
              //+ ' ' + res.responseText
             );

  if ((res.statusCode == 200) && (res.data.type != 'file')) {
    throw 'Target file exists, but is not a file: ' + res.data.type;

  } else if (res.statusCode == 200) {
    res = req('PUT', url, {
      message: 'Update via Drafts: ' + slug,
      content: b64,
      sha: res.data.sha
    });

  } else {
    res = req('PUT', url, {
      message: 'New via Drafts: ' + slug,
      content: b64
    });
  }
  console.log('PUT response: ' + res.statusCode
              + ' ' + res.responseText
             );

  var result = urlformat(SITE, PATH, slug, '');
  app.setClipboard(result);
}


main();
