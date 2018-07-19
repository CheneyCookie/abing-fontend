$(function() {
  let id = getUrlParam('id');
  $.ajax({
    url: '/api/blog/' + id,
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    data: {},
    dataType: 'json',
    success: function(data) {
      let title = data.title;
      let time = new Date(data.writeTime);
      if (time) {
        time = formateDate(time);
      }
      let tags = data.tags;
      $('.time-span').html(time)
      $('.title-span').html(title)
      $.each(tags, function(key, tag) {
        let tagContent = $('<div class="tag-div"><a href="/page/index?tagName=' + tag.name + '"><span class="glyphicon glyphicon-tags"></span><span> ' + tag.name + '</span></a></div>')
        tagContent.appendTo($('.tag-divs'))
      });
      $('.blog-detail-content').html(data.content)
      console.log(data)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
    }
  })
})
