$(function() {
  let title = getUrlParam('title');
  let tagName = getUrlParam('tagName');
  let pageNum = Number(getUrlParam('pageNum'));

  let param = {};
  if (title) {
    param.title = title
    $('#search-input').val(title)
  } else {
    title = ''
  }
  if (tagName) {
    param.tagName = tagName;
  } else {
    tagName = ''
  }
  if (pageNum) {
    param.pageNum = pageNum;
  } else {
    pageNum = 1
  }

  $.ajax({
    url: '/api/blog',
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    data: param,
    dataType: 'json',
    success: function(data) {
        if (data) {
          $.each(data, function(keyBlog, blog) {
            let title = blog.title;
            let time = new Date(blog.writeTime);
            if (time) {
              time = formateDate(time);
            }
            let tags = blog.tags;
            let blogContent = $('<div class="blog-div"><div class="time-div"><span class="glyphicon glyphicon-calendar"></span><span class="time-span">' + time + '</span></div><div class="title-div"><a href="/page/blogdetail?id=' + blog.id + '"><span class="title-span">' + blog.title + '</span></a></div><div class="tag-divs ' + keyBlog + '"></div></div>')
            blogContent.appendTo($('.blogs-div'))
            $.each(tags, function(keyTag, tag) {
              let tagContent = $('<div class="tag-div"><a href="/page/index?tagName=' + tag.name + '"><span class="glyphicon glyphicon-tags"></span><span> ' + tag.name + '</span></a></div>')
              tagContent.appendTo($('.' + keyBlog))
            });
          });
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
    }
  })

  $.ajax({
    url: '/api/blog/count',
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    data: param,
    dataType: 'json',
    success: function(data) {
        if (data) {
          if (pageNum * 10 < data) {
            $('.next').removeClass('hidden')
          } else {
            $('.next').addClass('hidden')
          }
          if (pageNum > 1) {
            $('.last').removeClass('hidden')
          } else {
            $('.last').addClass('hidden')
          }
        } else {
          $('.next').addClass('hidden')
          $('.last').addClass('hidden')
        }


    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
    }
  })

  $.ajax({
    url: '/api/tag',
    type: 'get',
    contentType: 'application/json;charset=utf-8',
    data: {},
    dataType: 'json',
    success: function(data) {
      $.each(data, function(key, tag) {
        let tagContent = $('<a href="/page/index?tagName=' + tag.name + '"><li>' + tag.name + '</li></a>');
        tagContent.appendTo($('.tag-group-div ul'));
      });
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
    }
  })

  $('#search-input').keyup(function(event) {
    if (event.keyCode === 13) {
      window.location.href = '/page/index?title=' + $('#search-input').val();
    }
  });

  $('.next').click(function() {
    pageNum += 1
    window.location.href = '/page/index?title=' + $('#search-input').val() + '&tagName=' + tagName + '&pageNum=' + pageNum;
  })

  $('.last').click(function() {
    pageNum -= 1
    window.location.href = '/page/index?title=' + $('#search-input').val() + '&tagName=' + tagName + '&pageNum=' + pageNum;
  })

  function formateDate(time) {
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    var date = time.getDate();
    return year + '-' + month + '-' + date;
  }
})
