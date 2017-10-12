"use strict"

var cron = require('node-cron');
var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyCOhTUhnffq6weqmORVHVBa3G6QQwsCwHo",
  authDomain: "mang-go.firebaseapp.com",
  databaseURL: "https://mang-go.firebaseio.com",
  projectId: "mang-go",
  storageBucket: "",
  messagingSenderId: "878454416444"
};

firebase.initializeApp(config);

var db = firebase.database()

class MangoTree {
  constructor() {
    this.age = 0
    this.height = 0
    // this.qty = 0
    this.fruits = []
    this.stopheigth = 15
    this.healthyStatus = true
    this.maxAge = 25
    this.harvested = ''
  }

  grow() {
    this.age++
    if(this.age <= this.stopheigth) {
      let added_height = Math.random() * (1-0) + 0
      this.height += added_height
    }
    if(this.age == this.maxAge) {
      this.healthyStatus = false
    }
  }

  harvest() {
    let qty = Math.floor(Math.random() * (10-1) + 1)
    let statuses = ['good', 'bad']
    this.harvested = qty
    let jumlahGood = 0
    let jumlahBad = 0
    for (var i = 0; i < qty; i++) {
      //random status buah
      let randomStatus = Math.round(Math.random())
      if(randomStatus == 0) {
        jumlahGood++
      } else {
        jumlahBad++
      }
      this.fruits.push(new Mango(statuses[randomStatus]))
    }
    this.harvested += ` (${jumlahGood} good, ${jumlahBad} bad)`
  }
}

class Mango {
  constructor(status) {
    this.status = status
  }
}


// * driver code untuk release 0
let mangoTree = new MangoTree()
// console.log(mangoTree);

db.ref('tree').set(mangoTree)

let grow = cron.schedule('*/2 * * * * *', function () {
		if (mangoTree.healthyStatus !== false) {
      mangoTree.grow();
      // console.log(mangoTree);
      //   mangoTree.produceMangoes();
      mangoTree.harvest();
      // console.log(mangoTree);
      db.ref('tree').set(mangoTree)
      console.log(`[Year ${mangoTree.age} Report] Height = ${mangoTree.height} | Fruits harvested = ${mangoTree.harvested}`)
    }
    else {
      grow.stop()
      console.log('mango dead');
    }
  })
