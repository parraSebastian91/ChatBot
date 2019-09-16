export const A = (function() {
    function a() { }
    a.prototype._map = (obj, fn) => {
        return Array.prototype.map.call(obj, fn);
    };
    a.prototype._filter = (obj, fn) => {
        return Array.prototype.filter.call(obj, fn)
    }
    return a;
})();

export const _env_ = {
    directLineUrl: "https://directline.botframework.com/v3/directline",
    tokenUrl: "https://botservice-amanda-dev-f.azurewebsites.net/api/token"
};
