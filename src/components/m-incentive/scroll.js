export function scrollHandler(_this, ele, eventName) {
    handleScrollListener(ele, eventName);
    // 事件处理
    function eventHandler(e) {
        // 所有数据请求完毕
        if(_this.tableData.length === _this.totalRow) {
            handleRemoveListener(ele, eventName);
            return false;
        }
        // 一秒内，不能连续请求
        if(_this.timer) return false;
        // 距离底部多少
        const scrollBottom = this.scrollHeight - this.clientHeight - this.scrollTop;
        // 参照10条数据的高度
        if(scrollBottom < 400) {
            _this.handleGetSignTable();
            _this.timer = window.setTimeout(function () {
                window.clearTimeout(_this.timer);
                _this.timer = null;
            }, 1000);
        } else {
            return false;
        }
    }
    // 滚动监听
    function handleScrollListener (ele, eventName) {
        ele.addEventListener(eventName, eventHandler, false);
    }
    // 移除监听
    function handleRemoveListener (ele, eventName) {
        ele.removeEventListener(eventName, eventHandler, false);
    }
}