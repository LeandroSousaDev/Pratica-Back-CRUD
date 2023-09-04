const express = require('express')
const bcrypt = require('bcrypt')
const knex = require('./conexao')

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
    const resposta = await knex('usuarios')
    res.json(resposta)
})

app.post('/add', async (req, res) => {
    const { nome, idade, email, senha } = req.body

    try {

        const senhatCrypt = await bcrypt.hash(senha, 10)

        const novoUsuario = {
            nome,
            idade,
            email,
            senha: senhatCrypt
        }

        const usuario = await knex('usuarios').insert(novoUsuario).returning('*')

        return res.json(usuario)

    } catch (error) {
        console.log(error)
        return res.json('erro do servidor')
    }
})

app.put('/atualizar/:id', async (req, res) => {
    const { id } = req.params
    const { nome, idade, email, senha } = req.body

    try {
        const novoDados = {
            nome,
            idade,
            email,
            senha
        }

        const usuario = await knex('usuarios').update(novoDados).where('id', id).returning('*')

        return res.json(usuario)

    } catch (error) {
        console.log(error)
    }

})

app.delete('/deleta/:id', async (req, res) => {
    const { id } = req.params

    const usuario = await knex('usuarios').del().where('id', id).returning('*')

    return res.json(usuario)
})

app.listen(3000)