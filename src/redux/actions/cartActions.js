// Adicionar curso ao carrinho
export const addToCart = (curso) => ({
    type: 'ADD_TO_CART',
    payload: curso,
});

// Remover curso do carrinho
export const removeFromCart = (cursoId) => ({
    type: 'REMOVE_FROM_CART',
    payload: cursoId,
});
