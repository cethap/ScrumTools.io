function reveal() {
  $(".madlib").removeClass("madlib-hidden");
  $("#reveal").hide();
  $("#hide").show();
}

function hide() {
  $(".madlib").addClass("madlib-hidden");
  $("#reveal").show();
  $("#hide").hide();
}

$("#reveal").click(reveal);
$("#hide").click(hide);

var chat = null;

if(location.href.indexOf("#") == -1 || MainProyecto){
  // Hello is sent from every newly connected user, this way they will receive what has already been drawn:
  // TogetherJS.hub.on('togetherjs.hello', function (a) {
  //   console.log(".........",a,".........");
  // });
  $("#initVota").removeClass("hide");
}

// Draw initially received drawings:
TogetherJS.hub.on('initScrum', function (msg) {
  if(msg.ready){
    $("#cardsHide").addClass("hide");
    $("#cardsShow").removeClass("hide");
  }
  chat = TogetherJS.require("chat");
});

$("#initVota").click(function(){
  TogetherJS.send({type:"initScrum",ready:true});
  chat = TogetherJS.require("chat")
  $("#cardsHide").addClass("hide");
  $("#cardsShow").removeClass("hide");
});

$("#cardsShow .card").click(function(){
  var el = $(this);
  $(".seleccionado").removeClass("seleccionado");
  el.addClass("seleccionado");
  chat.submit('He votado por el valor "'+el.attr("data-value").replace(/[♠♣♦♥]/gi, '')+'"');
});

TogetherJS.config("cloneClicks", "#reveal, #hide");
