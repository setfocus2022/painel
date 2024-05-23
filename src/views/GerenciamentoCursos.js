import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import CursosFMATCH from './CursosFMATCH.json'; // Importa o arquivo JSON

const GerenciamentoCurso = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Carrega os dados do JSON no estado
    setCursos(CursosFMATCH);
  }, []);

  return (
    <div>
      <h1>Gerenciamento de Cursos</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor (10 dias)</th>
          
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td>{curso.nome}</td>
              <td>{curso.descricao}</td>
              <td>{curso.valor_10d}</td>
         
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GerenciamentoCurso;