const { Router } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require ('../mysql').pool;
  
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'SELECT * FROM pratos;',
            (error, result, fields) =>{
                if (error) {return res.status(500).send({error: error})}
                const response = {
                    quantidade : result.length,
                    pratos: result.map(p => {
                        return {
                            nome: p.Nome,
                            preço: p.Preco,
                            descrição: p.Descricao,
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna todos os pratos',
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

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error})}

        conn.query(
            'INSERT INTO pratos (idrestaurante, nome, preco, descricao) VALUES (?, ?, ?, ?)',
            [req.body.idrestaurante, req.body.nome, req.body.preco, req.body.descricao],
            (error, result, field) => {
                conn.release();

                if (error) {return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'prato inserido com sucesso',
                    pratoCadastrado: {
                        id: result.Id,
                        nome: req.body.nome,
                        preço: req.body.preco,
                        descrição: req.body.descricao,
                        request: {
                            tipo: 'POST',
                            descrição: 'Inseri um prato',
                            ulr: 'http://localhost:3000/item' 
                        }
                    }
                }

                res.status(201).send(response);
            }
            );

    });
});

router.get('/:nome', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return res.status(500).send({error: error})}

        conn.query(
            'SELECT * FROM pratos WHERE nome = ?;',
            [req.params.nome],
            (error, result, fields) =>{
                if (error) {return req.status(500).sen({error: error})}

                const response = {
                    quantidade : result.length,
                    pratos: result.map(p => {
                        return {
                            nome: p.Nome,
                            preço: p.Preco,
                            descrição: p.Descricao,
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna Dados de um Prato',
                            }

                        }
                    })
                }

                return res.status(200).send(response)
            }
        );
    });
});

router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE pratos
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
                    mensagem: 'prato Alterado Com Sucesso',
                });
            }
            );
    });
});


//REMOVE UM ITEM
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM pratos where id = ?`,
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
                    mensagem: 'Prato Removido Com Sucesso',
                });
            }
            );
    });
});




module.exports = router;