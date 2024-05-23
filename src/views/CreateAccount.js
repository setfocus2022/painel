import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image} from 'react-bootstrap';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useHistory } from 'react-router-dom';
import './UserLogin.css'; // Reutilize os estilos da tela de login
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withStyles } from '@material-ui/core/styles';
const CriarConta = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false);
  const validateEmail = (email) => {
    // Expressão regular para validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const WhiteCheckbox = withStyles({
    root: {
      color: 'white', // Cor do checkbox desmarcado
      '&$checked': {
        color: 'white', // Cor do checkbox marcado
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  
    if (!validateEmail(emailValue)) {
      setEmailError('Digite um email válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Verificar se o username já existe
      const usernameResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-username/${username}`);
      if (usernameResponse.data.exists) {
        setUsernameError('Este Usuário já está em uso');
        toast.error('Este Usuário já está em uso'); // Exibe um toasty de erro
        return;
      }
  
      // Verificar se o email já existe
      const emailResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-email/${email}`);
      if (emailResponse.data.exists) {
        setEmailError('Este email já está cadastrado');
        toast.error('Este email já está cadastrado'); // Exibe um toasty de erro
        return;
      }
  
      if (passwordError) {
        // Display an error message or toast
        toast.error('A senha não atende aos requisitos de complexidade.');
        return;
      }

      if (!agreedToPrivacyPolicy) {
        toast.error('Você precisa aceitar os termos de uso.');
        return;
      }
      // Se o username e email não existirem, enviar o formulário
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-aluno`, { nome, sobrenome, email, senha, username, role: 'Admin' });
      if (response.data.success) {
        toast.success('Conta criada com sucesso!'); // Exibe um toasty de sucesso
        history.push('/Login');
      } else {
        toast.error('Erro ao criar conta'); // Exibe um toasty de erro
        console.error('Erro ao criar conta');
      }
    } catch (error) {
      toast.error('Erro ao criar conta'); // Exibe um toasty de erro
      console.error('Erro ao criar conta:', error);
    }
  };
  const validatePassword = (password) => {
 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };


  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setSenha(passwordValue);
  
    if (!validatePassword(passwordValue)) {
      setPasswordError('A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
    } else {
      setPasswordError('');
    }
  };
  return (
    <Container fluid className="d-flex align-items-center justify-content-center login-container">
      <Row className="flex-grow-1">
        <Col md={6} className="login-section-wrapper">
          <div className="brand-wrapper">
            <Image src="https://imgur.com/97hX0ve.png" alt="logo" className="logologin" />
          </div>
          <div className="login-wrapper my-auto">
            <h1 className="login-title">Criar Conta</h1>
            <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group>
              <Form.Label>Usuário:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isInvalid={!!usernameError}
                required
              />
              <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
            </Form.Group>
              <Form.Group>
                <Form.Label>Nome:</Form.Label>
                <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sobrenome:</Form.Label>
                <Form.Control type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  isInvalid={!!emailError}
                  required
                />
                <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Senha:</Form.Label>
                <Form.Control 
                  type="password" 
                  value={senha} 
                  onChange={handlePasswordChange} 
                  isInvalid={!!passwordError} 
                  required 
                />
                <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
              </Form.Group>

              <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px', marginBottom: '10px', border: '1px solid gray', padding: '10px', fontFamily:'Montserrat', color:'white', backgroundColor:'black'  }}>
    <strong>Política de Privacidade e Proteção de Dados Pessoais:</strong>
    <p>Política de Privacidade e Proteção de Dados Pessoais
    </p>
    <p>Recomendamos que você leia com atenção esse documento, bem como as suas eventuais alterações.
 </p>
    <p>1. Apresentação </p>
    <p>1.1.FMATCH TECNOLOGIA LTDA, inscrito no CNPJ sob o nº 52.622.018/0001-29, com sede na
cidade de Lençóis Paulista, estado de São Paulo, Rua Coronel Álvaro Martins, 443, Vila nova Irerê,
CEP 1682-180, reconhece a importância da privacidade e da proteção dos dados pessoais de seus
clientes, colaboradores, parceiros e demais stakeholders.
 </p>
    <p>1.2.Esta Política de Privacidade e Proteção de Dados Pessoais ("Política") tem como objetivo estabelecer
as diretrizes e medidas adotadas pela Empresa para garantir a segurança e o tratamento adequado
dos dados pessoais coletados em suas operações, tanto online quanto offline, em conformidade
com a Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018.
 </p>
    <p>2. Definições </p>
    <p>2.1.Dados Pessoais: Qualquer informação relacionada a uma pessoa natural identificada ou
identificável. Exemplos: nome completo, endereço, telefone, e-mail, CPF, RG, dados bancários,
imagem, voz, etc.
 </p>
    <p>2.2.Tratamento de Dados: Toda operação realizada com dados pessoais, como coleta, produção,
recepção, classificação, utilização, acesso, reprodução, distribuição, comunicação, transferência,
armazenamento, eliminação, avaliação ou controle da informação. </p>
    <p>2.3.Titular dos Dados: Pessoa natural a quem se referem os dados pessoais. </p>
    <p>2.4.Controlador: Pessoa jurídica que toma as decisões sobre o tratamento de dados pessoais. </p>
    <p>2.5.Operador: Pessoa jurídica que realiza o tratamento de dados pessoais a mando do controlador.
 </p>
    <p>3. Da aceitação </p>
    <p>3.1. O presente Termo estabelece obrigações contratadas de livre e espontânea vontade, por tempo
indeterminado, entre a plataforma e as pessoas físicas ou jurídicas, usuárias dos serviços.
 </p>
    <p>3.2.Ao utilizar a plataforma o usuário aceita integralmente as presentes normas e compromete-se a
observá-las, sob o risco de aplicação das penalidades cabíveis. </p>
    <p>3.3.A aceitação do presente instrumento é imprescindível para o acesso e para a utilização de quaisquer
serviços fornecidos pela empresa. Caso não concorde com as disposições deste instrumento, o
usuário não deve comprar o curso. </p>
    <p>4. Coleta de Dados Pessoais </p>
    <p>4.1.A Empresa coleta dados pessoais de diversas formas, como:
 </p>
    <p>4.1.1. Ao navegar em nosso site ou aplicativo: cookies e outras tecnologias podem coletar
informações sobre seu dispositivo, localização, comportamento de navegação, etc. </p>
    <p>4.1.2. Ao se cadastrar em nosso site e nossos serviços: nome, e-mail, telefone, CPF, RG, data de
nascimento, endereço, etc. </p>
    <p>4.1.3. Ao entrar em contato conosco: telefone, e-mail, chat online, etc </p>
    <p>4.1.4. Ao participar de promoções ou eventos: informações fornecidas nos formulários de
inscrição. </p>
    <p>4.1.5. Ao se candidatar a uma vaga de emprego: currículo, carta de apresentação, etc.
 </p>
    <p>5. Finalidade do Tratamento de Dados
 </p>
    <p>5.1.A Empresa utiliza os dados pessoais coletados para diversas finalidades, como: </p>
    <p>5.1.1. Prestar os serviços contratados: fornecer acesso ao conteúdo do site, realizar entregas,
processar pagamentos, etc. </p>
    <p>5.1.2. Enviar comunicados e informações: newsletters, promoções, eventos, novidades, etc.
 </p>
    <p>5.1.3. Melhorar a experiência do usuário: personalizar o conteúdo do site, recomendar produtos,
etc. </p>
    <p>5.1.4. Realizar pesquisas e análises: entender melhor o perfil dos clientes, suas necessidades e
preferências. </p>
    <p>5.1.5. Cumprir obrigações legais: responder a solicitações de órgãos governamentais, cumprir
obrigações fiscais, etc. </p>
    <p>5.1.6. Gerenciar riscos e prevenir fraudes: proteger a Empresa contra fraudes, acessos não
autorizados e outros riscos. </p>
    <p>6. O prazo para conservação dos dados </p>
    <p>6.1. Os dados coletados serão preservados e conservados pelo FMATCH, ou por empresa
contratada especialmente para esse fim, pelo período necessário, com sua posterior eliminação,
sendo autorizada sua conservação nas hipóteses descritas na Lei Geral de Proteção de Dados (Lei nº
13.709, de 14 de agosto de 2018). </p>
    <p>7. Compartilhamento de Dados Pessoais
 </p>
    <p>7.1.A Empresa poderá compartilhar seus dados pessoais com terceiros em determinadas situações,
como:
 </p>
    <p>7.1.1. Com empresas parceiras: para oferecer produtos e serviços personalizados, realizar
entregas, etc.
 </p>
    <p>7.1.2. Com órgãos governamentais: quando necessário para cumprir obrigações legais. </p>
    <p>7.1.3. Com empresas de suporte: para auxiliar na manutenção da plataforma e na prestação de
serviços.
 </p>
    <p>7.1.4. A Empresa garante que os dados pessoais serão compartilhados apenas com entidades que
adotem medidas de segurança e proteção de dados compatíveis com esta Política. </p>
    <p>8. Política de Cookies </p>
    <p>8.1.Seus dados podem ser coletados e armazenados por meio de cookies – arquivos de texto contendo
informações de identificação que ficam armazenados em seu computador – scripts de servidor e em
clientes próprios ou em ferramentas de terceiros.
 </p>
    <p>8.2.Usamos os cookies necessários para fazer o site funcionar da melhor forma possível e sempre
aprimorar os nossos serviços. Cookies colocados em seu dispositivo diretamente pelo nosso site –
são conhecidos como cookies primários. Eles são essenciais para você navegar no site e usar seus
recursos. </p>
    <p>8.3.Outros cookies são colocados no seu dispositivo não pelo site que você está visitando, mas por
terceiros, como, por exemplo, os sistemas analíticos. Apesar dos cookies não serem prejudiciais ao
seu equipamento, você tem a liberdade de recusar a utilização, bastando para isso acessar as
configurações de seu navegador (browser), assim como impedir a execução de javascript. </p>
    <p>8.4.Você também pode configurar seu navegador para notificá-lo a respeito de cookies, para decidir
individualmente se aceita ou não e desabilitar os cookies.
 </p>
    <p>9. Segurança dos Dados Pessoais
 </p>
    <p>9.1.A Empresa adota medidas técnicas e organizacionais para garantir a segurança dos dados pessoais,
como: </p>
    <p>9.1.1. Uso de criptografia: para proteger os dados durante a transmissão e armazenamento. </p>
    <p>9.1.2. Controle de acesso: apenas os colaboradores autorizados têm acesso aos dados.
 </p>
    <p>9.1.3. Políticas de segurança da informação: para proteger os dados contra acessos não
autorizados, uso indevido, perda, alteração ou destruição.
 </p>
    <p>10. Direitos do Titular dos Dados
 </p>
    <p>10.1. O titular dos dados possui diversos direitos em relação aos seus dados pessoais, como:
 </p>
    <p>10.1.1. Confirmar a existência de tratamento: saber se seus dados estão sendo tratados pela
Empresa. </p>
    <p>10.1.2. Acessar seus dados: solicitar uma cópia dos seus dados pessoais e obter informações sobre
como eles estão sendo tratados. </p>
    <p>10.1.3. Corrigir seus dados: solicitar a correção de seus dados caso estejam incompletos, incorretos.
 </p>
    <p>10.1.4. Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em
desconformidade com a legislação nacional; </p>
    <p>10.1.5. O ALUNO declara ciência de que os dados fornecidos, uma vez anonimizados, não são
considerados DADOS PESSOAIS, como estabelece o artigo 12 da Lei Geral de Proteção de
Dados (Lei nº 13.709, de 14 de agosto de 2018)
 </p>
    <p>10.1.6. Revogar o seu Consentimento, quando os seus Dados Pessoais são tratados sob essa base
legal; </p>
    <p>10.1.7. Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição
expressa pelo Usuário, consoante regulamentação específica da ANPD (Autoridade Nacional
de Proteção de Dados); </p>
    <p>10.1.8. Além disso, você pode exercer qualquer outro direito conferido por lei.
 </p>
    <p>10.1.9. Os dados coletados serão preservados e conservados pelo FMATCH, ou por empresa
contratada especialmente para esse fim, pelo período necessário e serão eliminados
quando deixarem de ser necessários para as finalidades para as quais foram coletados, ou
quando o usuário solicitar a sua eliminação, exceto se a manutenção do dado justificar-se
pela existência de alguma base legal que legitime o seu tratamento nas hipóteses descritas
na Lei Geral de Proteção de Dados (Lei nº 13.709, de 14 de agosto de 2018). </p>
    <p>11. Encarregados pelo Tratamento de Dados Pessoais
 </p>
    <p>1. Encarregados pelo Tratamento de Dados Pessoais
11.1. Conforme previsto na Lei Geral de Proteção de Dados, a forma de contato para cumprimento
das atividades e responsabilidades presentes na LGPD, é suporte.fmatch@outlook.com . </p>
   
  </div>
  <center>
  <FormControlLabel
          control={<WhiteCheckbox checked={agreedToPrivacyPolicy} onChange={(e) => setAgreedToPrivacyPolicy(e.target.checked)} name="agreedToPrivacyPolicy" />}
          style={{ fontFamily: 'Montserrat', color: 'white' }}
          label="Concordo com a Política de Privacidade e Proteção de Dados Pessoais."
        />
</center>
             <center><Button 
  type="submit" 
  className="login-button" 
  style={{ backgroundColor: 'black' }} 
  disabled={!agreedToPrivacyPolicy || !nome || !sobrenome || !email || !senha || emailError || passwordError || usernameError}
>
  Criar Conta
</Button></center> 
            </Form>
            <a href="/login" className="forgot-password-link">Voltar a tela de login</a>
            <a href="/" className="forgot-password-link">Voltar ao site</a>
          </div>
        </Col>
        <Col md={6} className="px-0 d-none d-md-block coluna-imagem">
  {/* Remover o <Image> se decidir usar background no CSS */}
</Col>

      </Row>
      <ToastContainer />
    </Container>
  );
};

export default CriarConta;
