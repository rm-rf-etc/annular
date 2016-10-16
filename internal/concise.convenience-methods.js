
module.exports = function(defs, DomBuilder){

	var DEFINE = defs.DEFINE
	var DEFINE_SETTER = defs.DEFINE_SETTER
	var DEFINE_GETTER = defs.DEFINE_GETTER

	DEFINE_SETTER(DomBuilder.prototype, 'value', function(val){
		this.el.innerHTML = val
	})

	DomBuilder.prototype.onFocus = function(cb){
		this.el.addEventListener('focus',cb)
	}

	DomBuilder.prototype.onBlur = function(cb){
		this.el.addEventListener('blur',cb)
	}

	DomBuilder.prototype.onSubmit = function(cb){
		this.el.addEventListener('submit',cb)
	}

	DomBuilder.prototype.onClick = function(cb){
		this.el.addEventListener('click',cb)
	}

	DomBuilder.prototype.onInput = function(cb){
		this.el.addEventListener('input',cb)
	}

	DomBuilder.prototype.setValid = function(bool, string){
		this.el.setCustomValidity( bool ? '' : string )
	}

}