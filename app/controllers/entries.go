package controllers

import "github.com/robfig/revel"

type Entries struct {
	*revel.Controller
}

func (c Entries) Index() revel.Result {
	return c.Render()
}

func (c Entries) Create() revel.Result {
	return c.Render()
}

func (c Entries) Update(id string) revel.Result {
	return c.Render()
}
