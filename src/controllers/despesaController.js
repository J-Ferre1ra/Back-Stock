const Despesa = require('../models/despesa')

const criarDespesa = async (req,res) =>{
    try{
        const {descricao, valor, data} = req.body
        if(!descricao || valor === undefined){
            return res.status(400).json({erro: 'Descrição e valor são obrigatórios!'})
        }

        const novaDespesa = new Despesa({
            descricao,
            valor,
            data
        })

        await novaDespesa.save()
        res.status(201).json(novaDespesa)
    }catch(err) {
        res.status(500).json({erro: 'Erro ao criar despesa.'})
    }
}

const listarDespesas = async (req, res) =>{
    try{
        const despesas = await Despesa.find().sort({data: -1})
        res.json(despesas)
    }catch(err) {
        res.status(500).json({erro: 'Errou ao listar despesas'})
    }
}

module.exports = {criarDespesa, listarDespesas}