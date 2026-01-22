const express = require("express");
const cors = require("cors");
const db = require("./database");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => { //Quando alguém acessar a URL /, eu vou responder com um JSON.
  res.json({ message: "API de autenticação funcionando " });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


const bcrypt = require("bcrypt"); // biblioteca para criptografar senhas
app.post("/register", async (req, res) => { //async = esse metodo faz com que o codigo espere a resposta antes de continuar
  const { name, email, password } = req.body; //POST = enviar dados (nome, email, senha. req.body pega os dados que o client enviou.
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Preencha todos os campos",
    });
  }

  try { // 1. Verifica se o email já está cadastrado
    const checkQuery = "SELECT id FROM users WHERE email = ?"; 
    db.query(checkQuery, [email], async (err, results) => { 
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Erro no servidor",
        });
      }

      if (results.length > 0) { // 2. se a consulta retornar algum resultado, significa que o email já está cadastrado
        return res.status(409).json({
          success: false,
          message: "Email já cadastrado",
        });
      }
      const passwordHash = await bcrypt.hash(password, 10); // 3. Criptografa a senha
      const insertQuery = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";  // 4. Insere usuário no banco
      db.query(
        insertQuery,
        [name, email, passwordHash],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Erro ao criar usuário",
            });
          }

          return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso ",
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro inesperado",
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Preencha todos os campos",
    });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.json({
        success: false,
        message: "Erro no servidor",
      });
    }

    if (results.length === 0) { //aqui ele verifica se o usuário existe
      return res.json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const user = results[0]; // pega o primeiro resultado da consulta (deve ser único pq email é unico)

    const senhaCorreta = await bcrypt.compare( // compara a senha fornecida com o hash armazenado
      password,
      user.password_hash
    );

    if (!senhaCorreta) { //
      return res.json({
        success: false,
        message: "Senha incorreta",
      });
    }

    return res.json({ // se tudo estiver ok, ele retorna sucesso
      success: true,
      message: "Login realizado com sucesso",
    });
  });
});

// resumo do codigo acima:
//1. Recebe email e senha
//2. Verifica se o email existe
//3. Compara a senha com o hash
//4. Retorna sucesso ou erro

