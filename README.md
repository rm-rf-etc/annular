# No longer maintained

3 other projects are used as modules in this project, and you have to use npm link to include them, if you want to get this project running. The projects you need to clone are rm-rf-etc/typeof, rm-rf-etc/runway, and rm-rf-etc/connected. The following steps should get things working for you.

```
$ cd ~/projects
$ git clone git@github.com:rm-rf-etc/typeof
$ git clone git@github.com:rm-rf-etc/runway
$ git clone git@github.com:rm-rf-etc/connected
$ git clone git@github.com:rm-rf-etc/concise
```

Now you have to use npm link to use typeof in runway. If you're using nvm to manage node versions, make sure you stay on the same version while changing directories. Everything has been updated and tested in node version 6.8.1.

```
$ cd ~/projects/typeof && npm link
$ cd ~/projects/runway && npm install && npm link && npm link typeof
$ cd ~/projects/connected && npm install && npm link && npm link typeof
$ cd ~/projects/concise
$ npm install
$ npm link typeof runway connected
$ npm link
```

You should now be able to use `npm link concise` in your project, it will symlink concise under `node_modules`. I have a working to-do app, made using concise, on my github page. http://rm-rf-etc.github.io


## Concise.js

(WIP)

_Concise.js_ is an experimental frontend framework. The general philosophy is to remove as much junk as possible, leaving you with only straight javascript and HTML elements that are immediately alive and ready to be manipulated the moment they are defined. Concise.js is built upon Connected.js, a never-polling 2-way data binding library.


## Demo

Steps:
* `git clone --recursive https://github.com/rm-rf-etc/concise.git`
* `npm install`
* `grunt`
* `open http://localhost:3000` (the 'open' command works on Macs)

This repo is for developing Concise.js & Connected.js, and to that end, includes a working to-do app. It uses the browserSync built-in
server for a backend, and running `grunt` starts the server.

* The framework lives in `node_modules/app/libs`.
* The sample web application lives in `./main.js` and `node_modules/app/ui`.
* `app/server/routing.js` is a middleware for browserSync which serves up a read-only backend. (or you can use firebase. See `main.js`).

See [todo-ui.js](//github.com/rm-rf-etc/concise/blob/master/node_modules/app/ui/todo-ui.js).
See [auth-form-ui.js](//github.com/rm-rf-etc/concise/blob/master/node_modules/app/ui/auth-form-ui.js).


## License

Concise.js is available under the [MIT License](//github.com/rm-rf-etc/concise/blob/master/LICENSE.txt).
