// 获取JSON文件内容并生成初始列表
let listContainer = $('#list');
let dataCache = [];

$.ajax({
    url: 'res/list.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
        dataCache = data;  // 缓存数据
        renderList(data);
        initializeSearch();
    },
    error: function () {
        listContainer.html('加载列表时出错！');
    }
});

// 渲染列表函数
function renderList(data) {
    listContainer.empty();
    if (data.length === 0) {
        listContainer.html('未找到相关内容');
        return;
    }
    data.forEach(function (item) {
        let card = $(`
        <div class="mdui-col-md-6 mdui-m-b-3 game-item" data-author="${item.authr.toLowerCase()}" data-date="${item.date}">
            <div class="mdui-card">
                <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">${item.name}</div>
                    <div class="mdui-card-primary-subtitle">作者: ${item.authr}</div>
                </div>
                <div class="mdui-card-content">${item.description}</div>
                <div class="mdui-card-actions">
                    <a href="${item.path}" target="_blank" class="mdui-btn mdui-ripple mdui-btn-raised mdui-color-blue-grey-900">开始游戏</a>
                    <span class="mdui-text-color-grey">发布日期: ${item.date}</span>
                </div>
            </div>
        </div>
        `);
        listContainer.append(card);
    });
}

// 初始化搜索功能
function initializeSearch() {
    $('#search, #startDate, #endDate').on('input', function () {
        applyFilters();
    });

    $('#sortOrder').on('change', function () {
        applyFilters();
    });
}

// 应用筛选和排序
function applyFilters() {
    const query = $('#search').val().toLowerCase();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const sortOrder = $('#sortOrder').val();

    // 过滤数据
    let filteredData = dataCache.filter(function (item) {
        const gameName = item.name.toLowerCase();
        const authorName = item.authr.toLowerCase();
        const description = item.description.toLowerCase();
        const gameDate = item.date;

        // 过滤条件：游戏名、作者名、描述
        let matchesSearch = gameName.includes(query) || authorName.includes(query) || description.includes(query);

        // 过滤条件：发布日期范围
        let matchesDate = true;
        if (startDate && gameDate < startDate) matchesDate = false;
        if (endDate && gameDate > endDate) matchesDate = false;

        return matchesSearch && matchesDate;
    });

    // 排序
    if (sortOrder === 'name') {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'date') {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 渲染列表
    renderList(filteredData);
}

$.get("/README.md", function (data) {
    const parsedMarkdown = marked.parse(data);
    $("#notificationsBody").html(parsedMarkdown);
    // 动态内容加载完成后重新计算弹窗布局
    const dialog = new mdui.Dialog('#notifications');
    dialog.handleUpdate(); // 更新弹窗的布局，以适应新的内容
}).fail(function () {
    $("#notificationsBody").html('获取公告文件失败！');
});

// 获取上次查看公告的时间
const lastSeenNotification = localStorage.getItem("lastSeenNotification");
const currentDate = new Date().toISOString().split("T")[0]; // 只保留日期部分
// 检查是否超过一天
if (lastSeenNotification !== currentDate) {
    // 初始化弹窗
    const dialog = new mdui.Dialog('#notifications');
    dialog.open();

    // 设置查看按钮的事件
    document.querySelector("#notifications button[mdui-dialog-close]").addEventListener("click", function () {
        // 更新 localStorage 中的日期为今天
        localStorage.setItem("lastSeenNotification", currentDate);
    });
}