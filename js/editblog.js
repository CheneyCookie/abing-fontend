$(function() {
  var E = window.wangEditor;
  var editor = new E('#div1', '#div2');  // 两个参数也可以传入 elem 对象，class 选择器
  editor.create();
  var tags = [];

  function generateTag(tag) {
    var tagLi = $('<li>')
    var tagEditSelect = $('<div>').addClass('tag-edit-select').appendTo(tagLi);
    var checkbox = $('<input type="checkbox" value="' + tag.id + '">').appendTo(tagEditSelect);
    var label = $('<label class="tag-name">').html(tag.name).appendTo(tagEditSelect);
    var input = $('<input type="text" value="' + tag.name + '">').addClass('edit-tag-input hidden').appendTo(tagEditSelect);
    var errorTag = $('<span class="tag-error-tip hidden" id="tagErrorTip">已存在</span>').appendTo(tagEditSelect);
    return tagLi;
  }

  $.ajax({
    url: '/api/tag',
    type: 'get',
    data: {},
    dataType: 'json',
    success: function(data) {
      data.reverse();
      $.each(data, function(key, value) {
        let tagLi = generateTag(value);
        tagLi.appendTo($('.tag-ul'));
        tags = data
      });
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });

  $('.btn-save').click(function() {
    $('.select-tag-div').removeClass("hidden");
  });

  $('.btn-update').click(function() {
    $('.select-tag-div').removeClass("hidden");
  });

  $('#cancelSave').click(function() {
    $('.select-tag-div').addClass("hidden");
  });

  $('#confirmSave').click(function() {
    $('.select-tag-div').removeClass("hidden");
  });

  $('#add').click(function() {
    $('#addInput').removeClass('hidden');
    $('#addInput').focus();
  });

  $('body').delegate('.tag-name', 'dblclick', function() {
    $(this).addClass('hidden');
    $(this).next().removeClass('hidden');
  });

  $('body').delegate('.edit-tag-input', 'blur', function() {
    let tagName = $(this).val();
    let tagId = $(this).prev().prev().val();
    let changingTagName = $(this).prev().html();
    let isExist = false;
    let $this = $(this)
    if (changingTagName === tagName) {
      $this.prev().removeClass('hidden');
      $this.addClass('hidden');
      return false;
    }

    if (tagName) {
      $.each(tags, function(key, tag) {
        if (tagName.toLowerCase() === tag.name.toLowerCase()) {
          isExist = true;
        }
      });

      if (isExist) {
        $this.next().removeClass('hidden');
      } else {
        let tag = {id: tagId, name: tagName}
        $.ajax({
          url: '/api/tag',
          type: 'put',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(tag),
          dataType: 'json',
          success: function(data) {
            if (data.id) {
              $.each(tags, function(key, tag) {
                if(tag.name === changingTagName) {
                  tag.name = data.name
                  console.log(tags)
                }
              })
              $this.prev().html(data.name);
              $this.prev().removeClass('hidden');
              $this.addClass('hidden');
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        });
      }
    } else {
      $('#tagErrorTip').addClass('hidden');
      $('#addInput').addClass('hidden');
    }
  });

  $('#addInput').blur(function() {
    let tagName = $('#addInput').val();
    let isExist = false;
    if (tagName) {
      $.each(tags, function(key, tag) {
        if (tagName.toLowerCase() === tag.name.toLowerCase()) {
          isExist = true;
        }
      });

      if (isExist) {
        $('#tagErrorTip').removeClass('hidden');
      } else {
        let tag = {name: tagName}
        $.ajax({
          url: '/api/tag',
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(tag),
          dataType: 'json',
          success: function(data) {
            if (data.id) {
              let tagLi = generateTag(data)
              tagLi.insertAfter($('#createTag'));
              $('#addInput').val('')
              $('#addInput').addClass('hidden');
              tags.push(data)
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        });
      }
    } else {
      $('#tagErrorTip').addClass('hidden');
      $('#addInput').addClass('hidden');
    }
  });

  function getUrlParam (key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }
  let id = getUrlParam('id');

  $('#confirmSave').click(function() {
    let title = $('#blogTitle').val();
    let content = editor.txt.html();
    let tags = [];
    $.each($('input:checkbox'), function() {
      if(this.checked){
        let id = $(this).val()
        let name = $(this).next().html();
        let tag = {'id': id, 'name': name}
        tags.push(tag);
      }
    });

    let blog = {title: title, content: content, tags: tags}

    if (id) {
      blog = {id: id, title: title, content: content, tags: tags}
      $.ajax({
        url: '/api/blog',
        type: 'put',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(blog),
        dataType: 'json',
        success: function(data) {
          if (data.id) {
            window.location.href = '/page/editblog?id=' + data.id;
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    } else {
      $.ajax({
        url: '/api/blog',
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(blog),
        dataType: 'json',
        success: function(data) {
          if (data.id) {
            window.location.href = '/page/editblog?id=' + data.id;
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }
  });

  if (id) {
    $('.btn-save').addClass('hidden');
    $.ajax({
      url: '/api/blog/' + id,
      type: 'get',
      contentType: 'application/json;charset=utf-8',
      dataType: 'json',
      success: function(data) {
        if (data.id) {
          let tags = data.tags
          $('#blogTitle').val(data.title);
          editor.txt.html(data.content);
          let checkboxs = $('input:checkbox');
          $.each(tags, function(key, tag) {
            $.each(checkboxs, function() {
              if ($(this).val() === tag.id) {
                $(this).prop('checked', 'checked');
              }
            });
          });
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });

  } else {
    $('.btn-update').addClass('hidden');
  }

});
