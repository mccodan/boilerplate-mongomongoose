require('dotenv').config();
require('mongodb');
const mongoose = require('mongoose');

//this is us "turning on" the database connection at the beginning of our app
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true}, {useNewUrlParser: true});

const { Schema } = mongoose;
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [{ type: String }]
  //comments: [{ body: String, date: Date}],
  //hidden: Boolean,
  //meta: {
  //  votes: Number,
  //  favs: Number
  //}
})

const Person = mongoose.model('Person', personSchema);
//here we create a model for our Person schema
//it is with our models that we make documents. A document has a unique doc._id property that tells
//what model it is an instance of

/*The following is the CREATE part of CRUD
     We are creating data  */
//here we are creating a new DOCUMENT of the Person MODEL
const createAndSavePerson = (done) => {
  var doogieHowser = new Person({
    name: "Doogie Howser",
    age: 12,
    favoriteFoods: ["pop-tarts", "ice cream", "mac & cheese"]
  });

  //This is how we save to the collection. We have a callback verification function that checks for errors when trying to save
  doogieHowser.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

//Here, we are defining an array of Persons, then creating them with
//model.create (in this case, Person.create).
var arrayOfPeople = [
  {name: "Boom", age: 33, favoriteFoods: ["Possum"]},
  {name: "Trey", age: 16, favoriteFoods: ["Hotdogs"]},
  {name: "Matt", age: 28, favoriteFoods: ["Liver"]}  ];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.error(err);
    done(null, people);
  })
};


/*The following is the READ part of CRUD
     We are READING data  */
const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
  });
};

/*The following is the UPDATE part of CRUD
     We are UPDATING data  */
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if(err) return console.log(err); 
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => {
      if (err) return console.log(err);
      done(null, updatedPerson);
    })
  })
};

//here we use the findOneAndUpdate method. This takes a document matched by personName
//   and updates the ageToSet document property
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};

/*The following is the DELETE part of CRUD
     We are DELETING data  */
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedDoc) => {
    if(err) return console.log(err);
    done(null, removedDoc);
  })
};

const removeManyPeople = (done) => {
  var nameToRemove = "Mary";
  Person.deleteMany({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};


//Finally, here, we are chaining commands, known as a query chain
//First, we find persons whose favorite food is "burrito". Then we
//  sort by name (ascending, 1), limit to 2 top results, exclude
//  age (you can only exclude or include when using select, 0 or 1),
//  then finally it's all executed against an error handler
const queryChain = (done) => {
  const foodToSearch = "burrito";
  const record = Person.find({ favoriteFoods: foodToSearch})
    .sort({ name: 1})
    .limit(2)
    .select({age: 0})
    .exec((err, data) => {
      if(err)
        done(err);
      else
        done(null, data);
    })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
