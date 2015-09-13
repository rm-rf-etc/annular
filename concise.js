
/*
The MIT License (MIT)

Copyright (c) 2014 Rob Christian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

The only time you EVER need a semi-colon for statement termination:
;[1,2,3].map(function(val){ 'do stuff' })
;(function(){ 'do stuff' })

*/



;(function(){

	var global = typeof global !== 'undefined' ? global : window

	global.familyOf = require('typeof').familyOf
	global.typeOf = require('typeof').typeOf

	var Context = null
	var connected = require('connected')
	var Bindable = connected.Bindable

	var concise = new Concise()
	var DEFINE = Object.defineProperty
	var _current_modifiers_
	var MicroEvent = require('microevent')
	var _controller_events = new MicroEvent()
	var _regions

	var runway = require('runway/runway-browser.js')
	Object.keys(runway).map(function(prop){
		concise[prop] = runway[prop]
	})


	/**
	 *
	 * Concise Classes
	 *
	 */

	function Concise(){

		this.current_view = null

		var view = document.createElement('div')
		view.id = 'view'

		var body = document.querySelector('body')
		body.insertBefore(view, body.firstChild)

		this.view_body = view
	}

	Concise.prototype.setContextObject = function(obj){
		if (typeOf(obj) !== 'Function')
			throw new Error('Concise.setContextObject() called but expects a constructor function only.')
		else
			Context = obj
	}

	Concise.prototype.setView = function(view){
		if (this.current_view) this.view_body.removeChild(this.current_view)
		this.current_view = view
		this.view_body.appendChild(view)
	}

	Concise.prototype.Model = function(name, obj) {
		if (typeOf(obj) === 'Object' || typeOf(obj) === 'Array') {
			concise.models._new_property_ = [name, new Bindable(obj)]
			return concise.models[name]
		}
	}

	Concise.prototype.get = function(path, cb){
		var xhr = global.XMLHttpRequest || ActiveXObject
		var request = new xhr('MSXML2.XMLHTTP.3.0')

		request.onload = function(){

			if (request.status >= 200 && request.status < 400) {

				try { cb( JSON.parse(request.responseText) ) }
				catch (e) { console.log(e) }

			}
			else console.log('failed')

		}

		request.open('GET', path, 1)
		request.send()
	}

	Concise.prototype.inject = function(href) {
		var js = document.createElement('script')
		js.src = href
		document.body.appendChild(js)
	}

	Concise.prototype.helpers = require('concise/concise.helpers.js')
	Concise.prototype.Controller = Controller
	Concise.prototype.models = new Bindable({})



	function Regions(){

		this.list = {}

		var self = this

		self.define = function(name, el){
			if (! self.list[name]) {
				self.list[name] = el
			} else {
				console.error('ERROR: Cannot redefine partial "'+name+'"')
			}
		}

		self.newMention = function(name, C$){
			if (self.list[name]) renderPartial()
			self.bind(name, renderPartial)

			function renderPartial(){
				C$.el.innerHTML = ''
				C$.dom = self.list[name]
			}
		}
	}
	_regions = (new Regions())
	MicroEvent.mixin(Regions)

	Concise.prototype.Region = function Region(name, el){
		_regions.define(name, el)
	}



	function Controller(name, constructor){
		console.log(this)

		this._id = name || Math.random().toString().split('.')[1]
		// this.parent = concise

		var view = document.createElement('div')
		view.id = name || this._id

		this.builder = new DomBuilder(null, view)

		// arguments[arguments.length-1].call(this)
		constructor.call(this)

		return function(){
			_controller_events.trigger(this._id)
			concise.setView(view)
		}
	}
	Controller.prototype.onActive = function(fn){
		_controller_events.bind(this._id, fn)
	}
	DEFINE(Controller.prototype, 'view', {enumerable:false, configurable:false,
		set:function(view){
			this.builder.dom = typeOf(view) === 'Function' ? view(this) : view
		}
	})
	DEFINE(Controller.prototype, 'models', {enumerable:false, configurable:false,
		get:function(){ return concise.models }
	})



	function DomBuilder(parent, el){
		this.el = el
		this.parent = parent || {}
		this.validates = false
	}

	DEFINE(DomBuilder.prototype, 'dom', {enumerable:false, configurable:false,
		set:domBuilderMethod
	})
	function domBuilderMethod(structure){
		//console.log(typeOf(structure), structure)
		if (! familyOf(this.el)) throw new Error('Missing valid view element. Cannot build a DOM before doing `$.view = document.querySelector(<your_selector>)`.')
		if (typeOf(structure) !== 'Object') throw new Error('Invalid dom structure object.')

		var helper_fn, helper_str, builder, val, expected_model, data, parsed, el


		Object.keys(structure).map( recursiveDomBuildingProcess.bind(this) )

		function recursiveDomBuildingProcess(key){
			val = structure[key]

			if (! elDefinitionValidate(key)) return

			parsed = parseElementString(key)
			if (parsed.validate) this.validates = true
			el = parsed.el

			if (! val) {
				this.el.appendChild(el)
				return
			}

			switch (true)
			{
				case !! (parsed.helpers && parsed.helpers.length):
					var context = Context ? new Context() : {}

					parsed.helpers.map(function(helper_str){
						var _parent, _prop
						if (typeOf(val) !== 'Function') throw new Error('DOM object "'+key+'" defined with helper method but has no function upon which to apply it.')

						helper_fn = concise.helpers[ helper_str.split('(')[0] ]

						expected_model = /\((.+)\)/g.exec(helper_str)[1]
						data = expected_model.split('.').reduce(function(object, prop){
							_parent = object
							_prop = prop
							return object[prop]
						}, concise.models)
						if (! data) {
							console.info('Alert! Expected model "'+expected_model+'" not available for each() templating helper')
						}
						builder = new DomBuilder(this, el)
						helper_fn.call(context,builder,_parent,_prop,val)
						this.el.appendChild(el)

					}.bind(this))
					break

				case typeOf(val) === 'Function':
					var context = Context ? new Context() : {}

					builder = new DomBuilder(this, el)
					val.call(context, builder)
					this.el.appendChild(el)

					break

				case typeOf(val) === 'Object':
					domBuilderMethod.call({ el:el, parent:this.parent }, val)
					this.el.appendChild(el)

					break

				case typeOf(val) === 'String':
					el.innerHTML = val
					this.el.appendChild(el)

					break
			}
		}

		if (this.parent && this.parent.validates && this.el.tagName === 'FORM') this.formValidate()
	}

	DEFINE(DomBuilder.prototype, 'model', {enumerable:false, configurable:false, set:function(){},
		get:function(){ return this._model || this.parent.model }
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

	DomBuilder.prototype.partial = function(name){
		if (_regions) _regions.newMention(name, this)
	}

	DomBuilder.prototype.formValidate = function(){
		console.log( 'FORM VALIDATE', this )

		this._model = new Bindable({})
		var model = this._model
		var done_for = ['input','textarea']
		model._new_property_ = ['_valid_', false]


		var child = this.el.firstChild
		while (child) {
			if (done_for.indexOf(child.tagName.toLowerCase()) != -1 && child.name) {
				model._new_property_ = [child.name, '']
				// child.addEventListener('input',listener.bind(child))
				Bindable.bindField(child, model)
			}
			child = child.nextSibling
		}

		function listener(){ model[this.name] = this.value }
	}



	/* Takes a CSS selector-style string and generates corresponding real DOM element. */

	var _reg = ''
	_reg += "(\\w+[\\w-]*(?:\\.\\w+)*=['].*?['])(?=\\s[\\w\\d.]+(?:[=(]|$))" + '|'
	_reg += '(\\w+[\\w-]*(?:\\.\\w+)*=["].*?["])(?=\\s[\\w\\d.]+(?:[=(]|$))' + '|'
	_reg += "(\\w+[\\w-]*(?:\\.\\w+)*=['].*?['])$" + '|'
	_reg += '(\\w+[\\w-]*(?:\\.\\w+)*=["].*?["])$' + '|'
	_reg += '(\\w+[\\w-]*[(]\\w(?:[\\w\\d]+|[\\w\\d.][^.])*[)])$' + '|'
	_reg += '([\\w\\d-]+)'
	_reg = new RegExp(_reg,'g')
	// var _reg = /(\w+[\w-]*(?:\.\w+)*=['].*?['])(?=\s[\w\d.]+(?:[=(]|$))|(\w+[\w-]*(?:\.\w+)*=["].*?["])(?=\s[\w\d.]+(?:[=(]|$))|(\w+[\w-]*(?:\.\w+)*=['].*?['])$|(\w+[\w-]*(?:\.\w+)*=["].*?["])$|(\w+[\w-]*[(]\w(?:[\w\d]+|[\w\d.][^.])*[)])$|([\w\d-]+)/g

	function parseElementString(desc){
		var el=null, parts, tag_id_classes, props_helpers, tag='', id='', classes=[], matches=true, properties=[], tokens, validate=false, helpers=[]
		var keywords = ['validate']

		if (/^[^\w]/g.test(desc)) throw new Error("Descriptor doesn't begin with a tag name: "+desc)

		// Split at the very first space character.
		parts = /^([^\s]+)(?:\s(.*))?$/g.exec(desc)
		tag_id_classes = parts[1]
		if (tag_id_classes && /#/g.test(tag_id_classes) && tag_id_classes.match(/#/g).length > 1) throw new Error('HTML descriptor cannot contain multiple ids: '+tag_id_classes)


		tag_id_classes = tag_id_classes.match(/[#.]?\w[\w\d-]*/g)
		tag = tag_id_classes[0]
		tag_id_classes.map(function(string){
			switch (string[0]) {
				case ('#'):
					id = string.slice(1)
					break
				case ('.'):
					classes[classes.length] = string.slice(1)
					break
			}
		})


		el = document.createElement(tag)
		if (classes.length)
			el.className = classes.join(' ')
		if (id)
			el.id = id


		// Now for the hard stuff. Handling property values and helper referrences.

		if (parts[2]) {
			props_helpers = parts[2]

// console.log( 'BEFORE', props_helpers ) // KEEP THIS FOR FUTURE DEBUGGING

			tokens = props_helpers.match(_reg)
			if (/\w+\(.*\)$/g.test(props_helpers) && /\w+\((?:[^\w].*|.*[^\w])\)$/g.test(props_helpers))
				throw new Error('Invalid helper definition: '+props_helpers)

// console.log( 'AFTER', tokens ) // KEEP THIS FOR FUTURE DEBUGGING

			validate = tokens.indexOf('validate') !== -1

			tokens.map(function(string, id){
				// console.log( 'TOKEN', string )
				switch (true) {

					case (/^[\w\d][\w\d-]*$/.test(string)):
						matches = /^[\w\d][\w\d-]*$/.exec(string)
						if (keywords.indexOf(matches[0]) === -1) properties[properties.length] = [matches[0], true]
						break

					case (/^(\w[\w\d-.]*)=["'](.*)["']$/.test(string)):
						var property_path
						matches = /^([\w\d-.]+)=["']((?:\"|\'|[^'"])*)["']$/.exec(string)
						property_path = matches[1].split('.')
						property_path[property_path.length] = matches[2]
						properties[properties.length] = property_path
						// console.log('PROP PATH', property_path)
						break

					case (/^\w[\w\d]+\([^)]+\)$/.test(string)):
						if (! helpers) helpers = []
						helpers[helpers.length] = string
						break

					default: throw new Error('Invalid token in HTML descriptor: '+string)
				}
			})


			// A property path is an array where each subsequent item is the value of the previous property on the parent.
			// This allows us to set nested properties defined as a string, like "style.display='block'".
			properties.forEach(function(prop_path){

				prop_path.reduce(function(parent, child){ //if (logit) console.log(parent, child)
					if (prop_path.indexOf(child) === prop_path.length-2) {
						parent[child] = prop_path.pop()
					} else {
						return parent[child]
					}
				}, el)

			})
		}

		return { el:el, validate:validate, helpers:helpers }
	}


	function elDefinitionValidate(el_str){ return true
		if (/\s/g.test(el_str) && el_str.match(/\s/g).length > 1) {
			throw new Error('Invalid DOM object definition. Cannot have more than one space character.')
			return false
		}
		else return true
	}


	if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
		module.exports = concise
	} else {
		global.concise = concise
	}

})()
