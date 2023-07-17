import express, { Request, Response } from "express";
import cors from "cors";
import {
  getProductById,
  products,
  purchases,
  queryProductsByName,
  users,
} from "./database";
import { Category, TProduct, TPurchase, TUser } from "./types";
import { emit } from "process";
import { networkInterfaces } from "os";
import { db } from "./database/knex";
import { builtinModules } from "module";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

//GET All users
app.get("/users", async (req: Request, res: Response) => {
  try {

    const result = await db("users") 

    res.status(200).send({ users: result });

  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//GET All products
app.get("/products", async (req: Request, res: Response) => {
  try { 

    const result = await db("products")

    res.status(200).send({ products: result });

  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//GET All purchase
app.get("/purchases", async (req: Request, res: Response) => {
  try { 

    const result = await db("purchases")

    res.status(200).send({purchases: result});

  } catch (error: any) {

    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//busca produtos por nome
app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    if (q.length <= 1) {
      res.status(400); // definimos um status code apropriado antes do disparo
      throw new Error("query params deve possuir pelo menos um caractere");
    }

    const product = await db.raw(`
    SELECT * FROM products
    WHERE name LIKE "%${q}%";
    `);

    res.status(200).send({ product: product });

  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//POST Create User
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password, created_at } = req.body as TUser;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' inválido, deve ser string!");
      }
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        res.status(400);
        throw new Error(
          "Id não disponível. Tente um novo Id."
        );
      }
    }

    if (name !== undefined) {
      if (typeof name !== "string") {
        res.status(400);
        throw new Error("Nome do user deve ser uma string");
      }
    }

    if (id.length < 1 || name.length < 1) {
      res.status(400);
      throw new Error("'Id' ou 'Name' devem ter no minímo 1 caractere.");
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        res.status(400);
        throw new Error(
          "Este E-mail não está disponível para cadastro. Tente um novo E-mail."
        );
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        res.status(400);
        throw new Error("Email do user deve ser uma string");
      }
    }

    if (password !== undefined) {
      if (typeof password !== "string") {
        res.status(400);
        throw new Error("Password do user deve ser uma string");
      }
    }

    const newUser = {
      id,
      name,
      email,
      password,
      created_at,
    };
    users.push(newUser);

    await db.raw(`
    INSERT INTO users (id, name, email, password) 
    VALUES ("${id}", "${name}", "${email}","${password}")`);

    res.status(201).send(`${name} cadastrado com sucesso!`);

  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//POST Create Product
app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, category, image_url } = req.body as TProduct;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("Id deve ser uma string");
      }
    }

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        res.status(400);
        throw new Error(
          "Este Id não está disponível para cadastro. Tente um novo Id."
        );
      }
    }

    if (name !== undefined) {
      if (typeof name !== "string") {
        res.status(400);
        throw new Error("Name deve ser uma string");
      }
    }

    if (id.length < 1 || name.length < 1) {
      res.status(400);
      throw new Error(
        "'Id' ou 'Name' de produto deve ter no minímo 1 caractere."
      );
    }

    if (price !== undefined) {
      if (typeof price !== "number") {
        res.status(400);
        throw new Error("'Price' do produto deve ser um número");
      }
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400);
        throw new Error("'Description' inválida, deve ser uma string");
      }
    }

    if (category !== undefined) {
      if (typeof category !== "string") {
        res.status(400);
        throw new Error("'Category' invalida, deve ser uma string");
      }
    }

    if (image_url !== undefined) {
      if (typeof image_url !== "string") {
        res.status(400);
        throw new Error("'Image_url' inválida, deve ser uma string");
      }
    }

    const newProduct = {
      id,
      name,
      price,
      description,
      category,
      image_url,
    };
    products.push(newProduct);

    await db.raw(`
    INSERT INTO products (id, name, price, description, category, image_url)
    VALUES ("${id}", "${name}", "${price}", "${description}", "${category}", "${image_url}");
    `);

    res.status(201).send(`Produto ${name} cadastrado com sucesso!`);
    
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//POST Create purchases
app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer, total_price, created_at, paid } = req.body as TPurchase;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("id deve ser uma string");
      }
    }

    const [findPurchaseId] = await db.raw(
      `SELECT * FROM purchases WHERE id="${id}"`
    );
    if (findPurchaseId) {
      res.status(400);
      throw new Error("Id de compra já cadastrado. Tenta novo Id de compra.");
    }

    if (buyer !== undefined) {
      if (typeof buyer !== "string") {
        res.status(400);
        throw new Error("Buyer deve ser uma string");
      }
    }

    const [findUserId] = await db.raw(
      `SELECT * FROM users WHERE id="${buyer}"`
    );
    if (!findUserId) {
      res.status(400);
      throw new Error("Não foi possivel achar o usuario pelo ID");
    }

    if (id.length < 1 || buyer.length < 1) {
      res.status(400);
      throw new Error(
        "As informações da compra devem ter no minímo 1 caractere."
      );
    }

    if (total_price !== undefined) {
      if (typeof total_price !== "number") {
        res.status(400);
        throw new Error("Preço total da compra deve ser um número");
      }
    }
    if (paid !== undefined) {
      if (typeof paid !== "number") {
        res.status(400);
        throw new Error("Status de pago deve ser um número");
      }
    }

    const newPurchase = {
      id,
      buyer,
      total_price,
      created_at,
      paid,
    };
    purchases.push(newPurchase);

    res.status(201).send("Compra realizada com sucesso!");

    await db.raw(`
    INSERT INTO purchases ( id, buyer, total_price, paid)
    VALUES ("${id}", "${buyer}", "${total_price}", "${paid}");
    `);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//busca compras por id
app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [ purchase ] = await db("purchases").where({ id: id })

    if(purchase){
            
      const [purchase] = await db("purchases")
      .select(
          "purchases.id AS purchaseID",
          "purchases.total_price AS totalPrice",
          "purchases.created_at AS createdAt",
          "purchases.paid AS isPaid",
          "users.id AS buyerID",
          "users.email",
          "users.name"
        )
      .innerJoin("users","purchases.buyer","=","users.id")
      .where({'purchases.id': id});

      const purchaseProducts = await db("purchases_products")
      .select("purchases_products.product_id AS id",
      "products.name",
      "products.price",
      "products.description",
      "products.image_url AS urlImage",
      "purchases_products.quantity")
      .innerJoin("products","products.id","=","purchases_products.product_id")
      const result = {...purchase, productsList:purchaseProducts}
      res.status(200).send({purchase: result});
      }  

    if (!purchase) {
      res.status(400); 
      throw new Error("A compra não existe!");
    }


  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});


//busca produtos por id
app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [product] = await db.raw(`
    SELECT * FROM products
    WHERE id = "${id}"
    `);

    if (!product) {
      res.status(400); 
      throw new Error("O produto não existe!");
    }

    res.status(200).send({ product: product });

  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//busca compras de usuário por id
app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const buyer = req.params.id;

    const [userPurchase] = await db.raw(`
      SELECT * FROM purchases
      WHERE buyer = "${buyer}"
    `);

    if (!userPurchase) {
      res.status(400);
      throw new Error("Usuário não encontrado");
    }

    res.status(200).send({ purchase: userPurchase });
    console.log("Array de compras do usuário:");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//excluir usuário por id
app.delete("/user/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const findUser = users.find((user) => user.id === id);
    if (!findUser) {
      res.status(400);
      throw new Error("Usuário não encontrado");
    }

    const indexToRemove = users.findIndex((user) => user.id === id);

    if (indexToRemove >= 0) {
  
      users.splice(indexToRemove, 1);
    }

    res.status(200).send("Usuário deletado com sucesso");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//excluir produto por id
app.delete("/product/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const findProduct = products.find((product) => product.id === id);
    if (!findProduct) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }

    const indexToRemove = products.findIndex((product) => product.id === id);

   
    if (indexToRemove >= 0) {
   
      products.splice(indexToRemove, 1);
    }

    res.status(200).send("Produto deletado com sucesso");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//Editar usuário por id
app.put("/user/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const findUser = users.find((user) => user.id === id);

    if (!findUser) {
      res.status(400);
      throw new Error("Usuáio não encontrado.");
    }

    const newEmail = req.body.email as string | undefined;
    const newPassword = req.body.password as string | undefined;

    const findEmail = users.find((user) => user.email === newEmail);
    if (newEmail && findEmail) {
      res.status(400);
      throw new Error("Este Email já existe. Tente novamente!");
    }

    if (newPassword && newPassword.length < 6) {
      res.status(400);
      throw new Error(
        "A senha deve possuir no mínimo 6 caracteres. Tente novamente!"
      );
    }

    findUser.email = newEmail || findUser.email;
    findUser.password = newPassword || findUser.password;

    res.status(200).send("Atualização realizada com sucesso");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//Editar produto por id
app.put("/product/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const findProduct = products.find((product) => product.id === id);

    if (!findProduct) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }

    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newCategory = req.body.category as Category | undefined;

    if (newName && newName.length < 2) {
      res.status(400);
      throw new Error("O name deve possuir pelo menos 2 caracteres.");
    }

    if (typeof newPrice !== "number") {
      res.status(400);
      throw new Error("O preço deve ser um número. Tente novamente!");
    }

    findProduct.name = newName || findProduct.name;
    findProduct.price = newPrice || findProduct.price;
    findProduct.category = newCategory || findProduct.category;
    
    res.status(200).send("Atualização realizada com sucesso");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});
