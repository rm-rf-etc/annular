
module.exports = function(concise, Bindable){

	return function Model(name, obj) {
		if (typeOf(obj) === 'Object' || typeOf(obj) === 'Array') {
			concise.models._new_property_ = [name, new Bindable(obj)]
			return concise.models[name]
		}
	}
}
