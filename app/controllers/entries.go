package controllers

import (
	"github.com/elisehein/fio/app/models"
	"github.com/robfig/revel"
	"labix.org/v2/mgo/bson"
	"time"
)

type Entries struct {
	Application
}

func (c Entries) Index() revel.Result {
	var entries []models.Entry
	coll := models.Collection(new(models.Entry), c.MongoSession)
	if err := coll.Find(nil).All(&entries); err != nil {
		panic(err)
	}
	return c.RenderJson(entries)
}

func (c Entries) Create() revel.Result {
	e := models.Entry{
		Id:         bson.NewObjectId(),
		Created_at: time.Now(),
		Note:       "A note",
		Amount:     3.14,
	}
	coll := models.Collection(e, c.MongoSession)
	coll.Insert(e)
	return c.RenderJson(ApiResponse{})
}

func (c Entries) Update(id string) revel.Result {
	return c.Render()
}
