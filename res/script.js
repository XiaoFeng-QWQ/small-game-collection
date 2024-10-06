let listContainer = $('#list');

// 获取JSON文件内容并生成初始列表
$.ajax({
    url: '/list.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
        // 遍历每个游戏项并生成HTML
        data.forEach(function (item) {
            let card = $(`
            <div class="col-md-6 mb-3 game-item animate__animated" data-author="${item.authr.toLowerCase()}">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">作者: ${item.authr} 描述: ${item.description}</p>
                        <p class="card-text"><small class="text-muted">发布日期: ${item.date}</small></p>
                        <a href="${item.path}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">开始游戏</a>
                    </div>
                </div>
            </div>
            `); // 初始隐藏
            listContainer.append(card);
        });

        // 调用初始化搜索功能
        initializeSearch();
    },
    error: function () {
        listContainer.html('加载列表时出错！')
    }
});

// 初始化搜索功能
function initializeSearch() {
    $('#search').on('input', function () {
        const query = $(this).val().toLowerCase();
        $('.game-item').each(function () {
            const gameName = $(this).find('.card-title').text().toLowerCase();
            const authorName = $(this).data('author'); // 这里获取作者名称
            // 检查搜索查询是否存在于游戏名称或作者名称中
            if (gameName.includes(query) || authorName.includes(query)) {
                $(this).show()
            } else {
                $(this).hide();
            }
        });
    });
}