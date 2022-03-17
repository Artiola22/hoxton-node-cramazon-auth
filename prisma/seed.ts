import { Prisma,  PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma =  new PrismaClient()

const hash = bcrypt.hashSync('mypassword')

const items: Prisma.ItemCreateInput[] =  [
    {
      title: "T-shirt",
      image:
        "https://media.istockphoto.com/photos/blank-black-tshirt-front-with-clipping-path-picture-id483960103?b=1&k=20&m=483960103&s=170667a&w=0&h=hNKNseCmaThTsh4i7Q3kHETlWo5Zi7Ogw-luVozfP_M=",
      price: 20.99
    },
    {
      title: "Sweater",
      image:
        "https://cdn.shopify.com/s/files/1/0044/2286/0867/products/IMG_1649_521e80cc-784d-4408-a5ee-cc70e5a1b5c9_250x.jpg?v=1631525274",
      price: 29.99
    },
    {
      title: "Jacket",
      image:
        "https://img.joomcdn.net/94dbc89bdc6cdcdf6482894f33d534679a700318_original.jpeg",
      price: 35.99
    },
    {
      title: "Coat",
      image:
        "https://media.dior.com/couture/ecommerce/media/catalog/product/9/X/1586461506_841M55A3332_X1700_E01_GHC.jpg?imwidth=800",
      price: 45.99
    },
    {
      title: "Jeans",
      image:
        "https://cdn.outfitbook.fr/20003-thickbox_default/high-waisted-mom-jeans-in-light-blue.jpg",
      price: 25.99
    },
  ];


const users: Prisma.UserCreateInput[] = [
    {
      name: "Artiola",
      email: "artiola@email.com",
      password: bcrypt.hashSync("artiola123"),
     orders: {
         create: [{ item: { connect: { title: "T-shirt" }}, quantity: 2},
         { item: { connect: { title: "Jeans" }}, quantity: 1},
         { item: { connect: { title: "Coat" }}, quantity: 1}]
     }
    },
    {
      name: "Erald",
      email: "erald@email.com",
      password: bcrypt.hashSync("erald123"),
      orders: {
        create: [
        { item: { connect: { title: "T-shirt" }}, quantity: 1},
        { item: { connect: { title: "Jeans" }}, quantity: 2},
        { item: { connect: { title: "Coat" }}, quantity: 1}]
    }
     
    },
    {
      name: "Mario",
      email: "mario@email.com",
      password: bcrypt.hashSync("mario123"),
      orders: {
        create: [
        { item: { connect: { title: "T-shirt" }}, quantity: 3},
        { item: { connect: { title: "Sweater" }}, quantity: 1},
        { item: { connect: { title: "Coat" }}, quantity: 1}]
    }
    },
    {
      name: "Diora",
      email: "diora@email.com",
      password: bcrypt.hashSync("diora123"),
      orders: {
        create: [
        { item: { connect: { title: "Jeans" }}, quantity: 1},
        { item: { connect: { title: "Coat" }}, quantity: 1}]
    }
    },
  ];
  
async function createStuff(){
for(const item of items){
  await prisma.item.create({ data: item})
}

  for(const user of users){
    await prisma.user.create({ data: user})
  }
}
createStuff()