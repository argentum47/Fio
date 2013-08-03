package models

import (
	// "github.com/robfig/revel"
	// "labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
	"time"
)

type Entry struct {
	Id         bson.ObjectId `bson:"_id,omitempty" json:"id"`
	Created_at time.Time     `bson:"c_a"           json:"created_at"`
	Note       string        `bson:"n"             json:"note"`
	Amount     float64       `bson:"a"             json:"amount"`
}
