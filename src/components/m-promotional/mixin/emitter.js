function broadcast(componentName, eventName) {
	this.$children.forEach(child => {
		var name = child.$options.componentName;
		if(name === componentName) {
			child[eventName](function () {
			    const _this = this.parent;
				_this.$set(_this.validList, this.childKey, true);
			});
		} else {
			broadcast.apply(child, [componentName, eventName]);
		}
	});
}
export default {
	methods: {
		dispatch(componentName, eventName, params = {}) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.componentName;

			while(parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if(parent) {
					name = parent.$options.componentName;
				}
			}
			if(parent) {
				parent[eventName](params);
			}
		},
		broadcast(componentName, eventName) {
			broadcast.call(this, componentName, eventName);
		}
	}
};