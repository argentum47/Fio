package controllers

import (
	"github.com/jgraham909/revmgo"
	"github.com/robfig/revel"
)

type Application struct {
	*revel.Controller
	revmgo.MongoController
}

type ApiResponse struct {
	Error   bool
	Message string
}

// Responsible for doing any necessary setup for each web request.
func (c *Application) Setup() revel.Result {
	return nil
}
