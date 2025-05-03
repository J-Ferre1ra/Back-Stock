const Cliente = require('../models/cliente')

const criarCliente = async (req, res) =>{
    try{
        const {nome, cpf, telefone} = req.body

        const clienteExistente = await Cliente.findOne({cpf})

        if (clienteExistente) {
            return res.status(400).json({erro: 'Cliente com esse CPF já existe.'})
        }

        const novoCliente = new Cliente({nome, cpf, telefone})
        await novoCliente.save()

        res.status(201).json(novoCliente)
    }catch(err) {
        res.status(500).json({erro: 'Erro ao criar cliente.'})
    }
}

const listarClientes = async (req, res) =>{
    try{
        const clientes = await Cliente.find()
        res.json(clientes)
    }catch (err) {
        res.status(500).json({erro: 'Erro ao listar clientes'})
    }
}

const buscarCliente = async (req, res) =>{
    try{
        const {query} = req.query
        
        if (!query) {
            return res.status(400).json({erro: 'A consulta não pode estar vazia'})
        }

        const clientes = await Cliente.find({
            $or:[
                {nome: {$regex:query, $options: 'i'}},
                {cpf: query}
            ]
        })

        if (clientes.length === 0) {
            return res.status(404).json({mensagem: 'Nenhum cliente encontrado.'})
        }

        res.json(clientes)
    }catch (err) {
        res.status(500).json({erro: 'Erro ao buscar cliente'})
    }
}

const editarCliente = async(req, res) =>{
    try{
        const {id} = req.params
        const {nome,cpf, telefone} = req.body

        const cliente = await Cliente.findById(id)
        if (!cliente) {
            return res.status(404).json({erro: 'Cliente não encontrado'})
        }

        cliente.nome = nome || cliente.nome
        cliente.cpf = cpf || cliente.cpf
        cliente.telefone = telefone || cliente.telefone

        await cliente.save()

        res.json(cliente)
    }catch (err) {
        res.status(500).json({erro: 'Erro ao editar cliente'})
    }
}

const excluirCliente = async( req, res) =>{
    try{
        const {id} = req.params

        const cliente = await Cliente.findById(id)

        if (!cliente) {
            return res.status(404).json({erro: 'Cliente não encontrado'})
        }

        await Cliente.findByIdAndDelete(id)

        res.json({mensagem: 'Cliente excluído com sucesso'})
    }catch (err) {
        res.status(500).json({erro: 'Erro ao excluir cliente'})
}
}


module.exports = {criarCliente, listarClientes, buscarCliente, editarCliente, excluirCliente}