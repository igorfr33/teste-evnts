const { Router } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require ('../mysql').pool;
  
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'SELECT * FROM item;',
            (error, result, fields) =>{
                if (error) {return req.status(500).sen({error: error})}
                const response = {
                    quantidade : result.length,
                    items: result.map(p => {
                        return {
                            nome: p.Nome,
                            preço: p.Preco,
                            descrição: p.Descricao,
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna todos os items',
                                url: 'http://localhost:3000/item/' + p.Nome
                            }

                        }
                    })
                }

                return res.status(200).send(response)
            }
        );
    });
});

//INSERE UM ITEM
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'INSERT INTO item (idrestaurante, nome, preco, descricao) VALUES (?, ?, ?, ?)',
            [req.body.idrestaurante, req.body.nome, req.body.preco, req.body.descricao],
            (error, result, field) => {
                conn.release();

                if (error) {return req.status(500).sen({error: error})}

                const response = {
                    mensagem: 'Item inserido com sucesso',
                    itemCadastrado: {
                        id: result.Id,
                        nome: req.body.nome,
                        preço: req.body.preco,
                        descrição: req.body.descricao,
                        request: {
                            tipo: 'POST',
                            descrição: 'Inseri um item',
                            ulr: 'http://localhost:3000/item' 
                        }
                    }
                }

                res.status(201).send(response);
            }
            );

    });
});

//RETORNA OS DADOS DE UM ITEM
router.get('/:nome', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'SELECT * FROM item WHERE nome = ?;',
            [req.params.nome],
            (erros, resultado, fields) =>{
                if (error) {return req.status(500).sen({error: error})}

                return res.status(200).send({response: resultado})
            }
        );
    });
});


//ATUALIZA UM ITEM
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE item
                SET idrestaurante = ?,
                    nome = ?,
                    preco = ?,
                    descricao = ?
                WHERE id = ?    
            `,
            [req.body.idrestaurante, req.body.nome, req.body.preco, req.body.descricao, req.body.id],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: 'Item Alterado Com Sucesso',
                });
            }
            );
    });
});


//REMOVE UM ITEM
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM item where id = ?`,
            [req.body.id],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: 'Item Removido Com Sucesso',
                });
            }
            );
    });
});




module.exports = router;