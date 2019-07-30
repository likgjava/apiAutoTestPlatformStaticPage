// ===========================项目管理===============================
function to_project_list() {
    window.location.href = '../project/project_list.html'
}

function to_project_detail(pId) {
    window.location.href = '../project/project_detail.html?pid=' + pId;
}

function del_project(id) {
    if (confirm('删除操作不可撤回，确定删除该项目吗？')) {
        $.post('./del_project', {pid: id}, function (json) {
            if (json.code === '0000') {
                alert('删除成功！');
                window.location.href = './project_list';
            } else {
                alert('系统异常！')
            }
        });
    }
}

function save_project() {
    // 校验数据
    var project_name = $('#project_name').val();
    if (project_name == null || project_name.length == 0) {
        alert("项目名称不能为空！");
        return false;
    }

    var data = {};
    data['id'] = $('#project_id').val();
    data['project_name'] = project_name;
    data['project_version'] = $('#project_version').val();
    data['base_url'] = $('#base_url').val();
    $.post('/save_project', data, function (json) {
        if (json.code === '0000') {
            alert('保存成功');
            window.location.href = './project_list';
        } else {
            alert(json.msg);
        }
    });
}

// ===========================接口管理===============================
function to_api_list(group_id) {
    url = '../api/api_list.html';
    if (group_id) {
        url += '?group_id=' + group_id
    }
    window.location.href = url
}

function to_api_detail(api_id) {
    window.location.href = './api_detail.html?api_id=' + api_id;
}

function to_edit_api(api_id) {
    window.location.href = './edit_api.html?api_id=' + api_id;
}

function del_api(api_id, group_id) {
    if (confirm('确定删除该API吗？')) {
        $.post('/del_api', {id: api_id}, function (json) {
            if (json.success) {
                to_api_list(group_id);
            } else {
                alert(json.msg)
            }
        });
    }
}

function to_api_test(api_id) {
    window.location.href = './api_test.html?api_id=' + api_id;
}

function save_api() {
    var data = {};
    data['id'] = $('#api_id').val();
    var group_id = $('#group_id').val();
    data['group_id'] = group_id;
    data['api_protocol'] = $('#api_protocol').val();
    data['api_method'] = $('#api_method').val();
    data['api_name'] = $('#api_name').val();
    data['api_url'] = $('#api_url').val();

    var headers = {};
    $('#headerTable').find('tbody tr').each(function (i, dom) {
        var name = $(dom).find('input[name="header_name"]').val();
        var value = $(dom).find('input[name="header_value"]').val();
        if (name != null && name !== '') {
            headers[name] = value;
        }
    });
    data['headers'] = JSON.stringify(headers);

    //请求参数
    var api_req_param_type = $('input[name=api_req_param_type]:checked').val();
    data['api_req_param_type'] = api_req_param_type;
    var params = {};
    if (api_req_param_type === 'form') {
        $('#formTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                params[name] = value;
            }
        });
        data['api_req_data'] = JSON.stringify(params);
    } else if (api_req_param_type === 'json') {
        $('#jsonTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                params[name] = value;
            }
        });
        data['api_req_data'] = JSON.stringify(params);
    } else {
        data['api_req_data'] = $('#raw').val();
    }

    //返回参数
    var api_res_param_type = $('input[name=api_res_param_type]:checked').val();
    data['api_res_param_type'] = api_res_param_type;
    if (api_res_param_type === 'json') {
        var res_params = {};
        $('#jsonResTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                res_params[name] = value;
            }
        });
        data['api_res_data'] = JSON.stringify(res_params);
    } else {
        data['api_res_data'] = $('#resRaw').val();
    }

    //返回示例
    data['api_success_mock'] = $('#api_success_mock').val();
    data['api_failure_mock'] = $('#api_failure_mock').val();

    $.post('./save_api', data, function (json) {
        if (json.success) {
            alert('保存成功');
            to_api_list(group_id);
        } else {
            alert('保存失败');
        }
    });
}

// ===========================用例管理===============================
function to_case_list() {
    window.location.href = '../case/case_list.html'
}

function to_case_detail(id) {
    window.location.href = './case_detail.html?id=' + id;
}

function to_add_case_item(case_id) {
    window.location.href = './add_case_item.html?case_id=' + case_id;
}

function to_edit_case_item(item_id) {
    window.location.href = './edit_case_item.html?item_id=' + item_id;
}

function del_case_item(case_id, item_id) {
    if (!confirm('确定删除该接口吗？')) {
        return false;
    }
    $.post('/del_case_item', {id: item_id}, function (json) {
        if (json.code === '0000') {
            window.location.href = '/case_detail?id=' + case_id;
        } else {
            alert(json.msg);
        }
    });
}

function save_case_item() {
    var data = {};
    var case_id = $('#case_id').val();
    data['id'] = $('#item_id').val();
    data['case_id'] = case_id;
    data['api_protocol'] = $('#api_protocol').val();
    data['api_method'] = $('#api_method').val();
    data['api_name'] = $('#api_name').val();
    data['api_url'] = $('#api_url').val();

    var headers = [];
    $('#headerTable').find('tbody tr').each(function (i, dom) {
        var name = $(dom).find('input[name="name"]').val();
        var value = $(dom).find('input[name="value"]').val();
        if (name != null && name !== '') {
            headers.push({'header_name': name, 'header_value': value})
        }
    });
    data['headers'] = JSON.stringify(headers);

    //请求参数
    var api_req_param_type = $('input[name=api_req_param_type]:checked').val();
    data['api_req_param_type'] = api_req_param_type;
    var params = {};
    if (api_req_param_type === 'form') {
        $('#formTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                params[name] = value;
            }
        });
        data['api_req_data'] = JSON.stringify(params);
    } else if (api_req_param_type === 'json') {
        $('#jsonTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                params[name] = value;
            }
        });
        data['api_req_data'] = JSON.stringify(params);
    } else {
        data['api_req_data'] = $('#raw').val();
    }

    //返回参数
    var api_res_param_type = $('input[name=api_res_param_type]:checked').val();
    data['api_res_param_type'] = api_res_param_type;
    if (api_res_param_type === 'json') {
        var res_params = {};
        $('#jsonResTable').find('tbody tr').each(function (i, dom) {
            var name = $(dom).find('input[name="name"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (name != null && name !== '') {
                res_params[name] = value;
            }
        });
        data['api_res_data'] = JSON.stringify(res_params);
    } else {
        data['api_res_data'] = $('#resRaw').val();
    }

    //校验规则
    var check_type = $('input[name=check_type]:checked').val();
    data['check_type'] = check_type;
    if (check_type === '1' || check_type === '2') {
        data['check_rule'] = $('#textCheck').val();
    } else if (check_type === '3') {
        var ruleList = [];
        $('#jsonCheckTable').find('tbody tr').each(function (i, dom) {
            var key = $(dom).find('input[name="key"]').val();
            var r = $(dom).find('select[name="rule"]').val();
            var value = $(dom).find('input[name="value"]').val();
            if (key != null && key !== '') {
                ruleList.push({'key': key, 'rule': parseInt(r), 'value': value});
            }
        });
        data['check_rule'] = JSON.stringify(ruleList);
    }
    data['check_status_code'] = $('#check_status_code').val();

    $.post('/save_case_item', data, function (json) {
        if (json.code === '0000') {
            alert('保存成功');
            to_case_detail(case_id);
        } else {
            alert(json.msg);
        }
    });
}

//<!--校验类型[0:不校验; 1:完全校验; 2:正则校验; 3:json校验]-->
function select_check_type(dom, type) {
    $(dom).removeClass('btn-default').addClass('btn-success');
    $(dom).siblings().removeClass('btn-success').addClass('btn-default');
    if (type === 0) {
        $('#statusCodeDiv').hide();
        $('#jsonCheckTable').hide();
        $('#textCheckDiv').hide();
    } else if (type === 1 || type === 2) {
        $('#statusCodeDiv').show();
        $('#jsonCheckTable').hide();
        $('#textCheckDiv').show();
    } else if (type === 3) {
        $('#statusCodeDiv').show();
        $('#jsonCheckTable').show();
        $('#textCheckDiv').hide();
    }
}

function changeHeaderValue(dom) {
    var nextTr = $(dom).parent().parent().next();
    if ($(dom).val() !== '' && nextTr.html() == null) {
        $(dom).parent().parent().find('td:last').show();
        $(dom).parent().parent().parent().append($('#headerTrTemplate').html());
        $(dom).parent().parent().parent().find('input[name=header_name]').bsSuggest(headerLabelData);
    }
}

function changeRelationParamValue(dom) {
    var nextTr = $(dom).parent().parent().next();
    if ($(dom).val() !== '' && nextTr.html() == null) {
        $(dom).parent().parent().find('td:last a').show();
        $(dom).parent().parent().parent().append($('#relationParamTrTemplate').html());
    }
}

function changeParamValue(dom) {
    var nextTr = $(dom).parent().parent().next();
    if ($(dom).val() !== '' && nextTr.html() == null) {
        $(dom).parent().parent().find('td:last').show();
        $(dom).parent().parent().parent().append($('#paramTrTemplate').html());
    }
}

function changeJsonCheckValue(dom) {
    var nextTr = $(dom).parent().parent().next();
    if ($(dom).val() !== '' && nextTr.html() == null) {
        $(dom).parent().parent().find('td:last').show();
        $(dom).parent().parent().parent().append($('#jsonCheckTrTemplate').html());
    }
}

function showParams(dom, itemId) {
    $(dom).siblings().removeClass('active');
    $(dom).addClass('active');
    var paramListDiv = $('#paramListDiv');
    paramListDiv.find('ul').hide();
    paramListDiv.find('ul[id=params' + itemId + ']').show();
}

function selectedParam(targetTrIndex, type, itemId, paramKey) {
    var content = '<response[:itemId].:paramKey>'.replace(':itemId', itemId).replace(':paramKey', paramKey);
    if (type === 'header') {
        var value_obj = $('#headerTable').find('tbody>tr').eq(targetTrIndex).find('input[name=value]');
        value_obj.val(value_obj.val() + content);
    } else {
        var req_type = $('input[name=api_req_param_type]:checked').val();
        var value_obj = $('#' + req_type + 'Table').find('tbody>tr').eq(targetTrIndex).find('input[name=value]');
        value_obj.val(value_obj.val() + content);
    }
    $("#bindParamModal").modal('hide');
}

// ===========================通用方法===============================
// 删除当前行，格式：<tr><td><a>this</a></td></tr>
function delThisTr(dom) {
    $(dom).parent().parent().remove();
}


function activeMenu(path) {
    $('#nav-sidebar').parent().find('li a').each(function (i, dom) {
        if ($(dom).attr('href').indexOf(path) !== -1) {
            $('#nav-sidebar').parent().find('li').removeClass('active');
            $(dom).parent().addClass('active');
            return false;
        }
    });
}

// ==================================================================
var headerLabelData = {
    indexId: 0,
    indexKey: 0,
    //showBtn: false,
    allowNoKeyword: false,
    inputWarnColor: null,
    ignorecase: true,
    data: {
        'value': [
            {'v': 'Accept'},
            {'v': 'Accept-Charset'},
            {'v': 'Accept-Encoding'},
            {'v': 'Accept-Language'},
            {'v': 'Accept-Ranges'},
            {'v': 'Authorization'},
            {'v': 'Cache-Control'},
            {'v': 'Connection'},
            {'v': 'Cookie'},
            {'v': 'Content-Length'},
            {'v': 'Content-Type'},
            {'v': 'Content-MD5'},
            {'v': 'Date'},
            {'v': 'Expect'},
            {'v': 'From'},
            {'v': 'Host'},
            {'v': 'If-Match'},
            {'v': 'If-Modified-Since'},
            {'v': 'If-None-Match'},
            {'v': 'If-Range'},
            {'v': 'If-Unmodified-Since'},
            {'v': 'Max-Forwards'},
            {'v': 'Origin'},
            {'v': 'Pragma'},
            {'v': 'Proxy-Authorization'},
            {'v': 'Range'},
            {'v': 'Referer'},
            {'v': 'TE'},
            {'v': 'Upgrade'},
            {'v': 'User-Agent'},
            {'v': 'Via'},
            {'v': 'Warning'}
        ]
    }
};
