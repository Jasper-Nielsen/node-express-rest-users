import express from "express";
import fs from "fs/promises";
import cors from "cors";
import { connection } from "./database.js";

const app = express();
const port = 3333;

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get("/", (request, response) => {
  response.send("Node.js Users REST API 🎉");
});

async function getUsersFromJSON() {
  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  users.sort((userA, userB) => userA.name.localeCompare(userB.name));
  return users;
}

// READ all users
app.get("/users", (request, response) => {
  // response.json(await getUsersFromJSON());
  const query = "SELECT * FROM users";
  connection.query(query, function (err, results, fields) {
    console.log(err);
    response.json(results);
  });
});

// READ one user
app.get("/users/:id", (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
  // const users = await getUsersFromJSON();
  //const user = users.find(user => user.id === id);
  const query = `SELECT * FROM users WHERE id=?`;
const values = [id] //skriver sådan fordi sql injection noget med sikkerhed!!!!

  //   response.json(user);
  connection.query(query,values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results[0]);
    }
  });
});

// CREATE user
app.post("/users", (request, response) => {
  const user = request.body;
  const query = `INSERT INTO users(Image, Mail, Name, Title) VALUES(?, ?, ?, ?)`;
  const values = [user.Image, user.Mail, user.Name, user.Title]; //tager info i et array

  connection.query(query, values,(err, results, fields)=>{
    if(err){
        console.log(err);
    }else {
        response.json(results);
    }

   
  });
  //   const newUser = request.body;
  //   newUser.id = new Date().getTime();
  //   console.log(newUser);

  //   const users = await getUsersFromJSON();
  //   users.push(newUser);
  //   fs.writeFile("data.json", JSON.stringify(users));
  //   response.json(users);
});

// UPDATE user
app.put("/users/:id", (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
  const query = `UPDATE users SET Image=?, Mail=?, Name=?, Title=? WHERE id=?`;
  const user = request.body;
  const values = [user.Image, user.Mail, user.Name, user.Title, id]; //tager info i et array
  
  
  connection.query(query, values, (err, results, fields) =>
  {
    if(err){
        console.log(err)
    }else{
        response.json(results)
    }
  })
  
  //   const users = await getUsersFromJSON();
  //   let userToUpdate = users.find((user) => user.id === id);
  //   userToUpdate = request.body;

  //   fs.writeFile("data.json", JSON.stringify(users));
  //   response.json(users);
});

// DELETE user
app.delete("/users/:id", async (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
 const query = `DELETE FROM users WHERE id=?`; 
  const values = [id];
  connection.query(query, values, (err,results,fields) =>{
    if(err){
        console.log(err)
    }else{
        response.json(results);
    }
  })
//   const users = await getUsersFromJSON();
//   // const newUsers = users.filter(user => user.id !== id);
//   const index = users.findIndex((user) => user.id === id);
//   users.splice(index, 1);
//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`App listening on http://localhost:${port}`);
  console.log(`Users Endpoint http://localhost:${port}/users`);
});
