// CartModal.js
import React from 'react';
import { Modal, Table, Button, Form, FormControlLabel, Checkbox } from 'react-bootstrap';

function CartModal({
    showModal,
    setShowModal,
    selectedOriginalCourses,
    cursosOriginais,
    selectedPriceOptions,
    handlePriceSelection,
    handleSubmit,
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    email,
    setEmail,
    whatsapp,
    setWhatsapp,
    agreedToTerms,
    setAgreedToTerms
}) {
    // Garanta que cursosOriginais e selectedPriceOptions são arrays ou objetos válidos
    if (!cursosOriginais || !selectedPriceOptions) {
        console.error("cursosOriginais ou selectedPriceOptions estão indefinidos");
        return null; // ou algum JSX que indique um estado de erro
    }
    
    // Definição correta da função calculateTotal dentro do componente
    const calculateTotal = () => {
        return selectedOriginalCourses.reduce((total, courseId) => {
            const curso = cursosOriginais.find(curso => curso.id === courseId);
            if (!curso) return total;
            
            const price = selectedPriceOptions[courseId];
            return total + parseFloat(price.replace(',', '.'));
        }, 0);
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Carrinho de Compras</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nome do Curso</th>
                            <th>15 dias</th>
                            <th>30 dias</th>
                            <th>6 meses</th>
                            <th>Selecione o Periodo de Acesso</th>
                        </tr>
                    </thead>
                    <tbody>
                            {selectedOriginalCourses.map((courseId) => {
                            const curso = cursosOriginais.find((curso) => curso.id === courseId);
                            if (!curso) return null;

                            return (
                                <tr key={curso.id}>
                                    <td>{curso.nome}</td>
                                    <td>R$ {curso.valor_15d}</td>
                                    <td>R$ {curso.valor_30d}</td>
                                    <td>R$ {curso.valor_6m}</td>
                                    <td>
                                        <div className="price-options">
                                            {/* Repetição para cada opção de preço */}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan="4"><strong>Total:</strong></td>
                            <td><strong>R$ {calculateTotal().toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </Table>
                <Form onSubmit={handleSubmit}>
                    {/* Seus campos de formulário aqui */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{ backgroundColor: '#FF7F00' }} variant="secondary" onClick={() => setShowModal(false)}>
                    Fechar
                </Button>
                <Button
                    style={{ backgroundColor: '#FF7F00' }}
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!nome || !email || selectedOriginalCourses.length === 0 || !agreedToTerms}
                >
                    Enviar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CartModal;
