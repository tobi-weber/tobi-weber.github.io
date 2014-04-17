// https://github.com/ghiculescu/jekyll-table-of-contents
(function($){
  $.fn.toc = function(options) {
    var defaults = {
      noBackToTopLinks: false,
      title: '<i>Jump to...</i>',
      showSpeed: 'slow'
    },
    settings = $.extend(defaults, options);
    
    var headers = $('h1, h2, h3, h4, h5, h6').filter(function() {
      // get all headers with an ID
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < 3 || !output.length) {
      return;
    }
    
    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); }
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var lowest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[headers.length-1];
    var return_to_top = '<i class="fa-arrow-up back-to-top"> </i>';
    
    var get_text = function(ele, levels) {
    	l = [];
    	for (i=0; i < levels.length; i++) {
    		if (levels[i] != 0) l.push(levels[i]);
    	}
    	return l.join(".")+" "+ele.innerHTML;}
    
    var level = get_level(headers[0]),
      this_level,
      html = settings.title + " <ul style='list-style-type: none;'>";
	var levels = [];
    for (i=0; i < ((lowest_level+1)-highest_level); i++) {
    	levels.push(0);
    }
    headers.on('click', function() {
      if (!settings.noBackToTopLinks) {
        window.location.hash = this.id;
      }
    })
    
    .addClass('clickable-header')
    .each(function(_, header) {
      this_level = get_level(header);
      levels[this_level-1] += 1
      if (!settings.noBackToTopLinks && this_level === highest_level) {
        $(header).addClass('top-level-header').after(return_to_top);
      }
      if (this_level === level) {// same level as before; same indenting
        html += "<li><a href='#" + header.id + "'>" + get_text(header, levels) + "</a>";
      } else if (this_level < level) {// higher level than before; end parent ol
        levels[level-1] = 0;
        html += "</li></ul></li><li><a href='#" + header.id + "'>" + get_text(header, levels) + "</a>";
      } else if (this_level > level) {// lower level than before; expand the previous to contain a ol
        html += "<ul style='list-style-type: none;'><li><a href='#" + header.id + "'>" + get_text(header, levels) + "</a>";
      }
      level = this_level; // update for the next one
      header.innerHTML = get_text(header, levels);
    });
    html += "</"+settings.listType+">";
    if (!settings.noBackToTopLinks) {
      $(document).on('click', '.back-to-top', function() {
        $(window).scrollTop(0);
        window.location.hash = '';
      });
    }
    if (0 !== settings.showSpeed) {
      output.hide().html(html).show(settings.showSpeed);
    } else {
      output.html(html);
    }
  };
})(jQuery);