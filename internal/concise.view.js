
module.exports = function(concise, DomBuilder){

	return MakeView
	function MakeView(name, ensuing){
		if (!(this instanceof MakeView)) return new MakeView(name, ensuing)

		var self = this

		self.C$ = new DomBuilder(null, ensuing)
		self.callback = View

		concise.views[concise.views.length] = self

		return View
		function View(){
			concise.setView(self.C$)
		}
	}
}
