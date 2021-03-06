// GENERATED CODE - DO NOT EDIT
package routes

import "github.com/robfig/revel"


type tApplication struct {}
var Application tApplication


func (_ tApplication) Setup(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Application.Setup", args).Url
}


type tTestRunner struct {}
var TestRunner tTestRunner


func (_ tTestRunner) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("TestRunner.Index", args).Url
}

func (_ tTestRunner) Run(
		suite string,
		test string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "suite", suite)
	revel.Unbind(args, "test", test)
	return revel.MainRouter.Reverse("TestRunner.Run", args).Url
}

func (_ tTestRunner) List(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("TestRunner.List", args).Url
}


type tStatic struct {}
var Static tStatic


func (_ tStatic) Serve(
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.Serve", args).Url
}

func (_ tStatic) ServeModule(
		moduleName string,
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "moduleName", moduleName)
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.ServeModule", args).Url
}


type tEntries struct {}
var Entries tEntries


func (_ tEntries) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Entries.Index", args).Url
}

func (_ tEntries) Create(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Entries.Create", args).Url
}

func (_ tEntries) Update(
		id string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "id", id)
	return revel.MainRouter.Reverse("Entries.Update", args).Url
}


