define([],function(){var e=[],t=angular.module("article",e);return t.controller("article.ctrl",["$rootScope","$scope","$stateParams","$state","$location","$cookies","http",function(e,t,o,r,i,n,a){!function(){a.request({url:"/article?username="+o.username+"&articleId="+o.articleId,method:"GET"}).then(function(e){e.data.result&&(t.article=e.data.data)})}(),t.heart=function(){if(e.userInfo){if(e.userInfo._id===t.article.author._id)return void console.log("不能点赞自己的文章");a.request({method:"GET",url:"/article/heart?token="+n.get("TOKEN")+"&articleId="+t.article._id}).then(function(e){console.log(e)})}else sessionStorage.redirectTo=i.path(),r.go("home",{home:{login:!0,register:!1}})},t.stamp=function(){if(e.userInfo){if(e.userInfo._id===t.article.author._id)return void console.log("不能反对自己的文章");a.request({method:"GET",url:"/article/stamp?token="+n.get("TOKEN")+"&articleId="+t.article._id}).then(function(e){console.log(e)})}else sessionStorage.redirectTo=i.path(),r.go("home",{home:{login:!0,register:!1}})}}]),t});