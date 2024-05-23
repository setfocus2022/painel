import "./FrameComponent.css";

const FrameComponent = () => {
  return (
    <div className="frame-b">
      <img
        className="conectlogo-1-icon"
        loading="eager"
        alt=""
        src="/conectlogo-1@2x.png"
      />
      <form className="user-frame">
        <div className="username-text">
          <div className="usurio">Usuário:</div>
          <div className="rectangle-c">
            <input className="background-rectangle" type="text" />
          </div>
        </div>
        <div className="background-rectangle1">
          <div className="login-button-frame">
            <div className="senha">Senha:</div>
            <div className="password-input-frame">
              <input className="second-access-rectangle" type="text" />
            </div>
          </div>
        </div>
        <div className="login-label-frame">
          <button className="botao-login">
            <div className="botao-login-child" />
            <div className="login">Login</div>
          </button>
        </div>
        <div className="primeiro-acesso">Primeiro Acesso</div>
      </form>
    </div>
  );
};

export default FrameComponent;