ByLawSearch = function() {
  var self = this;

  var document_index = _.indexBy(SEARCH_DATA, 'url');

  var idx = lunr(function () {
    this.ref('url');
    this.field('heading');
    this.field('body');
    this.metadataWhitelist = ['position'];

    SEARCH_DATA.forEach(function (doc) { this.add(doc) }, this);
  });

  var $form = $('form#search');
  var $results = $('#search-results');
  var template = $('#search-result-tmpl').html();
  var $submit = $form.find('button[type=submit]');
  Mustache.parse(template);

  self.search = function() {
    var q = $form.find('input[name=q]').val().trim();
    if (!q) return;
    var params = {};

    // all terms are required
    q = "+" + q.split(/\s+/).join(" +");

    var hits = idx.search(q);

    console.log(hits);

    hits.forEach(function(result) {
      result.url = result.ref;
      result.doc = document_index[result.ref];

      // snippets
      var snippets = [];

      // snippets for each search term
      _.forEach(result.matchData.metadata, function(info, term) {
        if (info.body) {
          info.body.position.forEach(function(pair) {
            var body = result.doc.body,
                start = pair[0],
                end = pair[0] + pair[1],
                prefix = body.substring(start - 15, start),
                suffix = body.substring(end, end + 15),
                snippet = '<mark>' + body.substring(start, end) + '</mark>';

            snippets.push(prefix + snippet + suffix);
          });
        }
      });
      result.snippet = snippets.join(' ... ');
    });

    // group by title
    var groups = _.map(_.groupBy(hits, function(h) { return h.doc.work; }), function(val, key) {
      return {
        'title': key,
        'hits': val,
      }
    });

    hits = {
      q: q,
      count: hits.length,
      groups: groups,
    };
    $results
      .empty()
      .append(Mustache.render(template, hits));
  };

  self.submitSearch = function(e) {
    if (window.history.pushState) {
      e.preventDefault();

      // don't reload the whole window
      window.history.pushState(null, null, '?' + $form.serialize());
      self.search();
    }
  };

  self.getParamValue = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  // search term from uri
  self.searchFromUri = function() {
    var q = self.getParamValue('q');
    if (q) {
      $form.find('input[name=q]').val(q);
      $form.find('input[name=region]').val(self.getParamValue('region'));
      $form.submit();
    }
  };

  $form.on('submit', self.submitSearch);
  $form.find('input').on('keyup', self.submitSearch);
  window.onpopstate = self.searchFromUri;

  return self;
};

$(function() {
  var search = new ByLawSearch();
  // kick off a search
  search.searchFromUri();
}); 
