define([],function(){var e=["oc.lazyLoad","ui.router","ngCookies","ngSanitize","httpRequest","editor"],t=angular.module("app",e);return t.config(["$ocLazyLoadProvider","$stateProvider","$urlRouterProvider",function(e,t,r){e.config({jsLoader:requirejs,debug:!1}),t.state("home",{url:"/",templateUrl:"src/modules/home/tpls/home.html",controller:"home.ctrl",params:{home:null},resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("home")}]}}).state("articles",{url:"/a",templateUrl:"src/modules/articles/tpls/articles.html",controller:"articles.ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("articles")}]}}).state("user",{url:"/{username: [a-z]{1}[a-z0-9]{0,5}}",templateUrl:"src/modules/user/tpls/user.html",controller:"user.ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("user")}]}}).state("article",{url:"/{username: [a-z]{1}[a-z0-9]{0,5}}/a/{articleId}",templateUrl:"src/modules/article/tpls/article.html",controller:"article.ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("article")}]}}).state("createArticle",{url:"/createArticle",templateUrl:"src/modules/createArticle/tpls/createArticle.html",controller:"createArticle.ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("createArticle")}]}}).state("updateArticle",{url:"/{username: [a-z]{1}[a-z0-9]{0,5}}/{articleId}/update",templateUrl:"src/modules/updateArticle/tpls/updateArticle.html",controller:"updateArticle.ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(e){return e.load("updateArticle")}]}}).state("404",{url:"/404",templateUrl:"src/modules/404/tpls/404.html"}).state("500",{url:"/500",templateUrl:"src/modules/500/tpls/500.html"}),r.otherwise("/a")}]),t.config(["$httpProvider",function(e){e.interceptors.push("tokenInterceptor")}]),t.controller("app.ctrl",["$rootScope","$scope","$cookies","http",function(e,t,r,l){$("#header .avatar, #header .avatar .userList").hover(function(){$(this).find(".userList").show()},function(){$(this).find(".userList").hide()}),t.loginOut=function(){l.request({method:"GET",url:"/logout?token="+r.get("TOKEN")}).then(function(t){t.data.result&&(r.remove("TOKEN",{path:"/"}),delete e.userInfo)})}}]),t});