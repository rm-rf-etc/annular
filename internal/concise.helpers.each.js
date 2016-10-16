
module.exports = function each(C$, parent, child, constructor){
	var self = this

	parent.bind(child, function(keyval, type){
		// Further optimizations are likely to come.
		// if (type === 'push') {
		//   constructor.call(o.el, o, keyval[0], keyval[1])
		// }
		// else if (type === 'pop') {
		//   o.el.lastChild.outerHTML = ''
		// }
		while (C$.el.firstChild) C$.el.removeChild(C$.el.firstChild)
		buildDom()
	})

	if (! parent[child]) return


	function buildDom(){
		Object.keys(parent[child]).map(function(index){

			self.bind = function(prop){
				return function(C$){
					C$.value = parent[child][index][prop]
					parent[child][index].bind(prop, function(val){ C$.value = val })
				}
			}

			if (typeOf(constructor) === 'Function')
				constructor.call(self, C$, index, parent[child][index])

			else if (typeOf(constructor) === 'Object')
				C$.dom = constructor

		})
	}
	buildDom()
}


// module.exports = function each(C$, parent, prop, constructor){
// 	var context = this

// 	if (! parent[prop]) {
// 		return
// 		// throw new Error('Helper received invalid data object with constructor: '+constructor.toString())
// 	}

// 	parent.bind(prop, function(keyval, type){
// 		// Further optimizations are likely to come.
// 		// if (type === 'push') {
// 		//   constructor.call(o.el, o, keyval[0], keyval[1])
// 		// }
// 		// else if (type === 'pop') {
// 		//   o.el.lastChild.outerHTML = ''
// 		// }
// 		C$.el.innerHTML = ''
// 		buildDom()
// 	})


// 	function buildDom(){
// 		Object.keys(parent[prop]).map(function(key){

// 			if (typeOf(constructor) === 'Function')
// 				constructor.call(context, C$, key, parent[prop][key])

// 			else if (typeOf(constructor) === 'Object')
// 				C$.dom = constructor

// 		})
// 	}
// 	buildDom()
// }
