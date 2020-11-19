const { ipcRenderer } = require("electron");
const Realm = require("realm");
const ObjectId = require("bson").ObjectId;

var DogSchema = {
  name: 'Dog',
  properties: {
    _id: 'objectId',
    breed: 'string?',
    name: 'string'
  },
  primaryKey: '_id',
};

var PersonSchema = {
  name: 'Person',
  properties: {
    _id: 'objectId',
    age: 'int',
    dogs: {
      type: 'list',
      objectType: 'Dog'
    },
    firstName: 'string',
    lastName: 'string'
  },
  primaryKey: '_id',
};

let realm;

async function run() {
  const realmApp = new Realm.App({ id: "YOUR_APP_ID" });
  let credentials = Realm.Credentials.emailPassword("YOUR_USER", "YOUR_PASS");
  await realmApp.logIn(credentials);

  const config = {
    path: "my.realm",
    schema: [DogSchema, PersonSchema],
    sync: true,
  };

  realm = new Realm(config);
  const persons = realm.objects("Person");
  console.log(`Renderer: Number of Person objects: ${persons.length}`);
  setObjects(persons.length);

  setTimeout(intervalFunc, 5000);
  
  const createElement = document.getElementById("create");
  createElement.addEventListener("click", createNewObject);
}

const intervalFunc = () => {
  createNewObject();
  setTimeout(intervalFunc, 5000);
};

let counter = 0;
function createNewObject() {
  realm.write(() => {
    console.log("Creating new Person object");
    john = realm.create("Person", { "_id": new ObjectId(), firstName: "John2", lastName: "Smith", age: 25 });

    const johnsDog = realm.create("Dog", { "_id": new ObjectId(), name: "DoggoAA" });
    john.dogs.push(johnsDog);
    console.log("Added a new person in the Realm.");
  });

  console.log("Query Persons.");
  const persons = realm.objects("Person");
  console.log(`Message ${counter++}: the Realm contains ${persons.length} 'Person' objects.`);
  setObjects(persons.length);
};

function setObjects(objects) {
  const objectsEl = document.getElementById("objects");
  objectsEl.innerText = `${objects} Objects`;
}

run();
