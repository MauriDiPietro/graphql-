import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import {uuid} from 'uuidv4'

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

const schema = buildSchema(`
    type Persona {
        id: ID!
        nombre: String
        edad: Int
    },
    input PersonaInput {
        nombre: String,
        edad: Int
    },
    type Query{
        getPersonas:[Persona]
    }
    type Mutation{
        addPersona(data: PersonaInput!): Persona
    }
`)

/* en graphiql ó thunderclient*/ 

// mutation{
//     addPersona(data: {nombre: "juan" , edad: 30}){
//       id,
//       nombre
//     }
//   }
  
  
//   query{
//     getPersonas{
//       nombre
//     }
//   }

const personas = []

function addPersona({data}){
    const id = uuid()
    const persona = data
    persona.id = id
    personas.push(persona)
    return persona
}

function getPersonas(){
    return personas
}

function deletePersona(){

}
function updatePersona(){

}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: {
        getPersonas,
        addPersona
    },
    graphiql: true
}))

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{console.log(`SERVER OK IN PORT ${PORT}`)})