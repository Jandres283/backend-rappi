const AcceptOrderButton = ({ orderId, onAccept, isLoading }) => {
  const handleClick = () => {
    if (onAccept && orderId) {
      onAccept(orderId);
    }
  };

  return (
    <button
      className="btn-accept-order"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Aceptando..." : "Aceptar Pedido"}
    </button>
  );
};

export default AcceptOrderButton;