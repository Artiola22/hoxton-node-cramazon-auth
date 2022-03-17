import express, { request }  from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['error', 'info', 'query', 'warn']})

function createToken (id: number){
//@ts-ignore
const token = jwt.sign({id: id}, process.env.my_secret, {expiresIn: '3days'})
return token
}

 async function getUserFromToken(token: string){
     //@ts-ignore
    const data = jwt.verify(token, process.env.my_secret)
    //@ts-ignore
    const user = await prisma.user.findUnique({where: {id: data.id}, include: {orders: {include: {item: true}}}})
    return user
}
//SIGN UP
app.post('/sign-up', async(req, res )=>{
    const {name, email, password} = req.body

    try{
        const hash = bcrypt.hashSync(password)
        const user = await prisma.user.create({ data: { name, email, password: hash}})
        res.send({user, token: createToken(user.id)})
    }catch(err){

     //@ts-ignore
     res.status(400).send({error: err.message })
    }

})



//SIGN IN 
app.post('/sign-in', async(req, res) =>{
    const { email, password} =req.body
    try{
        const user =  await prisma.user.findUnique({ where: {email: email}, include: {orders: {include: {item: true}}}})
        //@ts-ignore
    const passwordMatches = bcrypt.compareSync(password, user.password)
    if( user && passwordMatches){
        res.send({ user , token: createToken(user.id)})
    }else{
        throw Error('Boom!')
    }
    }catch(err){
        //@ts-ignore
        res.status(400).send({error: 'Email/Password invalid!'})
    }
    
})

app.get('/validate', async(req, res) =>{
const token = request.headers.authorization || ''
 
try{
    const user = await getUserFromToken(token)
res.send(user)
}catch(err){
    //@ts-ignore
    res.status(400).send({error: err.message })
}

})

app.get('/users', async(req, res) =>{
    const user =  await prisma.user.findMany({include: {orders: true}})
    res.send(user)
})

app.get('/orders', async(req, res )=>{
   
    const order = await prisma.order.findMany({ include: {user : true, item: true}})
    res.send(order)
})

app.listen(4000, ()=> {
    console.log(`Server up : http://localhost:4000`)
})