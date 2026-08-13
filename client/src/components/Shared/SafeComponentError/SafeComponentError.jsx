// src/components/Shared/SafeComponentError/SafeComponentError.jsx
import { Component } from "react";
import "./SafeComponentError.scss";

class SafeComponentError extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SafeComponentError atrapó un fallo de UI:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="safe-component-error">
          <h4>Algo salió mal en esta sección</h4>
          <p>Ocurrió un error inesperado al renderizar este componente.</p>
          <button className="btn-retry" onClick={this.handleRetry}>
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeComponentError;