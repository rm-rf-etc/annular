
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/


;(function(){

  var concise = require('./libs/concise.js')
  var connected = require('./libs/connected.js')
  var Bindable = connected.Bindable
  var uis = {
    todo: require('./ui/todo-ui.js')
  , auth_me: require('./ui/auth-form-ui.js')
  }

  var ctrls, list

  concise.get('/data/todos.json',function(data){
    concise.models.list = list = new Bindable(data)

    ctrls = bootstrap() // I wanted routes defined above controller functions, so I put them in a named function.

    concise.routes
    ('/', ctrls.HomeCtrl)
    ('/join', ctrls.HomeCtrl)
    ('/todos', ctrls.TodoAllCtrl)
    ('/todos-complete', ctrls.TodoCheckedCtrl)
    ('/todos-incomplete', ctrls.TodoUncheckedCtrl)
  })

  // This is another style you can use to define routes.
  // concise.routes([
  //   ['/', HomeCtrl()]
  // , ['/todos', TodoCtrl()]
  // ])

  // v For use in debugging.
  window.concise = concise
  window.connected = connected


  function bootstrap(){

    return {

      TodoAllCtrl: new concise.Controller('todo-all', function(){
        this.view = uis.todo
      }),

      TodoCheckedCtrl: new concise.Controller('todo-complete', function(){
        this.show_when = true
        this.view = uis.todo
      }),

      TodoUncheckedCtrl: new concise.Controller('todo-incomplete', function(){
        this.show_when = false
        this.view = uis.todo
      }),

      HomeCtrl: new concise.Controller('home', function(){
        this.view = uis.auth_me
      })

    }
  }


})();
