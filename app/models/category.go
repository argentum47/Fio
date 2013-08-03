package models

import (
	// "github.com/robfig/revel"
	// "labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
	"time"
)

type Category struct {
	Id         bson.ObjectId `bson:"_id,omitempty",json:"id"`
	Created_at time.Time     `bson:"c_a",json:"created_at"`
	Name       string        `bson:"n",json:"name"`
	Slug       float64       `bson:"s",json:"slug"`
}
