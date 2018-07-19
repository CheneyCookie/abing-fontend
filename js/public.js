$(function() {
  $("#header").load("/page/header.html");
  $("#footer").load("/page/footer.html");
})

function getUrlParam (key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

function formateDate(time) {
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  var date = time.getDate();
  return year + '-' + month + '-' + date;
}
