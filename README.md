
Make sure you use **--recursive**:  
`git clone --recursive https://github.com/rm-rf-etc/concise.git`

# Concise.js

(WIP)

_Concise.js_ is an experimental frontend framework. The general philosophy is to remove as much junk as possible, leaving you with only straight javascript and HTML elements that are immediately alive and ready to be manipulated the moment they are defined. Concise.js is built upon Connected.js, a never-polling 2-way data binding library.


## Demo

Steps:
* `npm install`
* `grunt`
* `open http://localhost:3000` (the 'open' command works on Macs)

This project uses the browserSync built-in server, and running `grunt` starts the server. `app/routing.js` is a middleware
for browserSync which serves up a read-only backend. (or you can use the firebase endpoint. See `main.js`).

See [todo-ui.js](//github.com/rm-rf-etc/concise/blob/master/node_modules/app/ui/todo-ui.js).
See [auth-form-ui.js](//github.com/rm-rf-etc/concise/blob/master/node_modules/app/ui/auth-form-ui.js).


## License

Concise.js is available under the [MIT License](//github.com/rm-rf-etc/concise/blob/master/LICENSE.txt).
