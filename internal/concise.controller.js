
module.exports = function(concise, DEFINE, _ctrl_events, DomBuilder){

	function Controller(name, constructor){
		var self = this
		console.info('new controller:', name, self)

		self._id = name || Math.random().toString().split('.')[1]

		self.builder = new DomBuilder(null)
		self.builder.el = new DocumentFragment()

		constructor.call(self)

		concise.controllers[name] = function(){
			_ctrl_events.trigger(self._id)
			concise.setView(self)
		}

		return concise.controllers[name]
	}
	Controller.prototype.onActive = function(fn){
		_ctrl_events.bind(this._id, fn)
	}
	DEFINE(Controller.prototype, 'view', {enumerable:false, configurable:false,
		set:function(view){
			this.builder.dom = typeOf(view) === 'Function' ? view(this) : view
		}
	})
	DEFINE(Controller.prototype, 'models', {enumerable:false, configurable:false,
		get:function(){ return concise.models }
	})

	return Controller
}
