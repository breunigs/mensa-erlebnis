function changeAufgang() {
  var a = $('input[name=aufgang]:checked').val();
  if(!a) return;
  a = a.toLowerCase();
  $("#aufgang-details").children().trigger("collapse");
  $(".details-aufgang-" + a).trigger("expand");
}

function getText() {
  var aufgang = $('input[name=aufgang]:checked').val();
  var text = "Liebes StuWe,\n\nich war heute ";
  text += {"AB": "beim Buffet", "D": "bei D", "E": "an Aufgang E"}[aufgang];

  if(aufgang == "AB") {
    var kats = $('input[name=ab-kategorie]:checked');
    if(kats.length == 0) {
      text += ". ";
    } else if(kats.length == 1) {
      text += " und habe mich bei den " + $(kats.first()).val();
      text += " bedient.";
    } else {
      text += " und habe mich bei den " + $(kats.first()).val();
      $.each(kats.slice(1,-1), function(ind, x) {
	text += ", " + $(x).val();
      });
      text += " und " + $(kats.last()).val() + " bedient.";
    }
  }

  if(aufgang == "D") {
    var gericht = $('input[name=d-gericht]:checked').val();
    if(gericht) {
      text += " und habe das ";
      text += gericht == "veget" ? "vegetarische Gericht" : "Fleisch/Fischgericht";
      text += " (";
      text += data["d"][gericht] + ") gegessen. ";
    } else {
      text += ". "
    }
  }

  if(aufgang == "E") {
    var gericht = $('input[name=e-gericht]:checked').val();
    if(gericht) {
      text += " und hatte das ";
      text += gericht == "veget" ? "vegetarische Gericht" : "Fleisch/Fischgericht";
      text += " (";
      text += data["e"][gericht] + ") ";
    } else {
      text += " und hatte kein Hauptgericht "
    }

    var beilagen = $('input[name=e-beilage]:checked');
    if(beilagen.length == 0) {
      text += "ohne Beilagen."
    } else if(beilagen.length == 1) {
      text += "mit " + $(beilagen.first()).val() + ".";
    } else {
      text += "mit " + $(beilagen.first()).val();
      $.each(beilagen.slice(1,-1), function(ind, x) {
	text += ", " + $(x).val();
      });
      text += " und " + $(beilagen.last()).val() + ".";
    }
  }

  text += "\n\n";

  var stimmung = $('input[name=stimmung]:checked').val();
  if(stimmung == "Neutral") text += "Das Essen bewerte ich neutral."
  if(stimmung == "Lob") text += "Das Essen fand ich sehr gut und spreche mein Lob aus."
  if(stimmung == "Tadel") text += "Das Essen war nicht so gut und ich muss tadeln."

  var msg = $("#mitteilung").val().replace(/^\s+|\s+$/, "");
  if(msg !== "") {
    text += " Außerdem möchte ich noch sagen: " + msg;
  }

  text += "\n\nViele Grüße"
  return text;
}


var submitInProgress = false;

$(document).ready(function() {
  $("input[type='radio']").bind("change", function(event) {
    if(event.target.name === "aufgang") changeAufgang();
  });

  changeAufgang(); // for reloads

  $("form").submit(function(e) {
    if(submitInProgress) return false;

    if(!confirm("Mensa-Erlebnis so absenden?"))
      return false;

    submitInProgress = true;
    $.mobile.showPageLoadingMsg();
    $('[type="submit"]').button('disable');

    var i = $("iframe").contents();
    i.find("form").attr("onsubmit", "");
    i.find("select").val("01|Essen & Trinken");
    $("iframe").contents().find("input[name=zv_action]").val("SW_SEND_FEEDBACK");
    i.find("input[name=SW_LOB_SUBJECT]").val("Mein Mensa-Erlebnis (Zentralmensa)");
    i.find("textarea[name=SW_LOB_COMMENT]").val(getText());
    $("iframe").one("load", function() {
      $.mobile.hidePageLoadingMsg();
      alert("Erlebnis gesendet!");
      $("form")[0].reset();
      $.mobile.silentScroll(0);
      submitInProgress = false;
      $('[type="submit"]').button('enable');
      $("iframe").attr("src", "form.html");
    });
    // actually submit the form
    i.find("form").submit();

    return false;
  });


  $(document.body).append('<iframe id="stwform" src="form.html"></iframe>');
});
