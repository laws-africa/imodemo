$(function() {
  // tag term definition containers
  $('.akoma-ntoso .akn-def[data-refersto]').each(function(i, def) {
    var term = def.getAttribute("data-refersto").replace('#', '');

    $(def)
      .closest('.akn-p, .akn-subsection, .akn-section, .akn-blockList')
      .attr('data-defines', def.getAttribute('data-refersto'))
      .attr('id', 'defn-' + term);
  });

  // link term definitions
  $(".akoma-ntoso .akn-term[data-refersto]").each(function(i, term) {
    $(term)
      .addClass('term-link')
      .on('click', function(e) {
        // jump to term definition
        e.preventDefault();
        window.location.hash = '#defn-' + term.getAttribute("data-refersto").replace('#', '');
      });
  });

  // show definition popups
  $('.akn-term').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    template: '<div class="popover term-definition" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body akoma-ntoso"></div></div>',
    delay: { show: 500 },
    title: function() {
      var term_id = $(this).data('refersto');
      var term = $('.akn-def[data-refersto="' + term_id + '"]').text();
      if (window.ga) ga('send', 'event', 'term-popup', term_id.replace('#', ''));
      return term;
    },
    content: function() {
      var term_id = $(this).data('refersto');
      return $('.akoma-ntoso [data-defines="' + term_id + '"]')[0].outerHTML;
    }
  });

  // show custom popups
  $('[data-sec-ref]').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body akoma-ntoso"></div></div>',
    delay: { show: 500 },
    title: function() {
      return this.getAttribute('data-sec-ref');
    },
    content: function() {
      var ref = this.getAttribute('data-sec-ref');
      return {
        '38(a)': 'Perform such functions as are or may be conferred upon the Organization by or under international conventions for the prevention and control of marine pollution from ships, particularly with respect to the adoption and amendment of regulations or other provisions, as provided for in such conventions;',
        '16(2)(d)': 'amendments shall be adopted by a two-thirds majority of only the Parties to the Convention present and voting;',
        '16(2)(f)(iii)': 'an amendment to an appendix to an Annex to the Convention shall be deemed to have been accepted at the end of a period to be determined by the appropriate body at the time of its adoption, which period shall be not less than ten months, unless within that period an objection is communicated to the Organization by not less than one third of the Parties or by the Parties the combined merchant fleets of which constitute not less than 50 per cent of the gross tonnage of the world’s merchant fleet whichever condition is fulfilled;',
        '16(2)(g)(ii)': 'in the case of an amendment to Protocol I, to an appendix to an Annex or to an Annex to the Convention under the procedure specified in subparagraph (f)(iii), the amendment deemed to have been accepted in accordance with the foregoing conditions shall enter into force six months after its acceptance for all the Parties with the exception of those which, before that date, have made a declaration that they do not accept it or a declaration under subparagraph (f)(ii), that their express approval is necessary.',
        '16(2)(e)': 'if adopted in accordance with subparagraph (d) above, amendments shall be communicated by the Secretary-General of the Organization to all the Parties to the Convention for acceptance;',
      }[ref];
    }
  })
});
