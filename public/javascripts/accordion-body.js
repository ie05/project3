(function(jQuery){

	jQuery( function() {

    jQuery( "#accordion" ).accordion({
      active: false,
      collapsible: true,
      icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
      heightStyle: 'content'
    });

    jQuery( "#accordion2" ).accordion({
      active: false,
      collapsible: true,
      icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
      heightStyle: 'content'
    });

  } );// end doc ready

})(jQuery);