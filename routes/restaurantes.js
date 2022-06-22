const { Router } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require ('../mysql').pool;

//RETORNA TODOS OS RESTAURANTES
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'SELECT * FROM restaurante;',
            (error, resultado, fields) =>{
                if (error) {return req.status(500).sen({error: error})}
                const response = {
                    quantidade : resultado.length,
                    items: resultado.map(p => {
                        return {
                            id: p.Id,
                            nome: p.Nome,
                            culinária: p.Culinaria,
                            endereço: p.Endereco,
                            descrição: p.Descricao,
                            request: {
                                tipo: 'GET',
                                descrição: '',
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

//INSERE UM RESTAURANTE
router.post('/CadastraRestaurante', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        conn.query(
            'SELECT * FROM restaurante WHERE nome = ? and culinaria = ? and endereco = ? and cidade = ?;',
            [req.body.nome, req.body.culinaria, req.body.endereco, req.body.cidade],
            (error, result, fields) =>{

                if (error) {return req.status(500).sen({error: error})}

                if (result.length > 0) {
                    return res.status(201).send({mensagem: 'Restaurante já cadastrado'});     
                }

                else{
                    conn.query(
                        'INSERT INTO restaurante (nome, culinaria, endereco, cidade) VALUES (?, ?, ?, ?)',
                        [req.body.nome, req.body.culinaria, req.body.endereco, req.body.cidade],
                        (error, result, field) => {
                            conn.release();
            
                            if (error) {return req.status(500).sen({error: error})}
            
                            const response = {
                                mensagem: 'Restaurante inserido com sucesso',
                                restauranteCadastrado: {
                                    nome: req.body.Nome,
                                    culinária: req.body.Culinaria,
                                    endereço: req.body.Endereco,
                                    cidade: req.body.cidade,
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
                }
            }
        );   
    });
});

        
//RETORNA OS DADOS DE UM RESTAURANTE
router.post('/filtro', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {return req.status(500).sen({error: error})}

        if(req.body.culinaria) {
            conn.query('select *from restaurante where culinaria = ?',
            [req.body.culinaria],
            (erros, result, fields) => {
                if (error) {return req.status(500).send({error: error})}
                const response = {
                    quantidade : result.length,
                    items: result.map(p => {
                        return {
                            nome: p.Nome,
                            culinária: p.Culinaria,
                            endereco: p.Endereco,
                            cidade: p.cidade
                        }
                    })
                }
                res.status(201).send(response);
                conn.release();
            }
            )
            
        }

        if(req.body.cidade) {
            conn.query('select *from restaurante where cidade = ?',
            [req.body.cidade],
            (erros, result, fields) => {
                if (error) {return req.status(500).send({error: error})}
                const response = {
                    quantidade : result.length,
                    items: result.map(p => {
                        return {
                            nome: p.Nome,
                            culinária: p.Culinaria,
                            endereco: p.Endereco,
                            cidade: p.cidade
                        }
                    })
                }
                res.status(201).send(response);
                conn.release();
            }
            )
        }

        if(req.body.prato) {
            conn.query('SELECT R.NOME, R.CULINARIA, R.ENDERECO, R.CIDADE FROM RESTAURANTE AS R INNER JOIN PRATOS AS P ON R.ID = P.IDRESTAURANTE WHERE P.NOME = ?',
            [req.body.prato],
            (erros, result, fields) => {
                if (error) {return req.status(500).send({error: error})}
                const response = {
                    quantidade : result.length,
                    items: result.map(p => {
                        return {
                            nome: p.NOME,
                            culinária: p.CULINARIA,
                            endereco: p.ENDERECO,
                            cidade: p.CIDADE
                        }
                    })
                }
                res.status(201).send(response);
                conn.release();
            }
            )
        }
    });
});

//ATUALIZA UM RESTAURANTE
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE restaurante
                SET nome = ?,
                    culinaria = ?,
                    endereco = ?,
                    cidade = ?
                WHERE id = ?    
            `,
            [req.body.nome, req.body.culinaria, req.body.endereco, req.body.cidade, req.body.id],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: 'Restaurante Alterado Com Sucesso',
                });
            }
            );
    });
});

//REMOVE UM RESTAURANTE
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM restaurante where id = ?`,
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
                    mensagem: 'Restaurante Removido Com Sucesso',
                });
            }
            );
    });
});



module.exports = router;