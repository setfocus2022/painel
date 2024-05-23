import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import cursosData from './CursosFMATCH.json';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setPurchaseStatus } from '../redux/actions/userActions.js';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const CursosEmpresas = () => {
  const dispatch = useDispatch();
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState({});
  const { authState } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [agreedToServiceTerms, setAgreedToServiceTerms] = useState(false);
  const purchaseStatus = useSelector(state => state.user.purchaseStatus);
  const [cursosOriginais, setCursosOriginais] = useState([]);
  const [selectedOriginalCourses, setSelectedOriginalCourses] = useState([]);
  const [selectedPriceOptions, setSelectedPriceOptions] = useState({});
  const [courseCount, setCourseCount] = useState(0);
  const [selectedAccessPeriods, setSelectedAccessPeriods] = useState({});
  const [purchases, setPurchases] = useState([]);


  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchComprasEmpresa = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empresa/compras`, {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        });
        setCompras(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico de compras da empresa:', error);
        toast.error('Erro ao carregar histórico de compras.');
      }
    };

    fetchComprasEmpresa();
  }, [authState.token]);
  // Função para verificar o status da compra
  const checkPurchaseStatus = async (compraId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/compra/status/${compraId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });
      const status = response.data.status;

      if (status === 'aprovado') {
        clearCart();
        toast.success("Compra aprovada! Obrigado por comprar conosco.");

        // Atualizar o histórico de compras
        fetchPurchases();

        // Remove event listener when purchase is approved
        window.removeEventListener('beforeunload', () => {});
      } else if (status === 'reprovado') {
        toast.error("Compra reprovada. Por favor, tente novamente.");
      }

      return status;
    } catch (error) {
      console.error("Erro ao verificar o status da compra:", error);
      toast.error("Erro ao verificar o status da compra. Por favor, contate o suporte.");
      return 'erro';
    }
  };

  useEffect(() => {
    requestPopupPermission();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/all-purchases`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      toast.error('Erro ao carregar compras.');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    const fetchUsersEmpresa = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/alunos/empresa/${authState.username}`);
        setUsuarios(response.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchUsersEmpresa();
  }, [authState.username]);

  const handleCursoSelect = (cursoId) => {
    if (selectedCursos.includes(cursoId)) {
      setSelectedCursos(prev => prev.filter(id => id !== cursoId));
    } else {
      setSelectedCursos(prev => [...prev, cursoId]);
    }
  };

  const calculateTotal = () => {
    return selectedCursos.reduce((total, cursoId) => {
      const curso = cursosOriginais.find((curso) => curso.id === cursoId);
      return total + (curso ? curso.valor_10d * usuarios.length : 0);
    }, 0);
  };

 // Função para buscar compras da empresa (movida para dentro do componente)
 const fetchComprasEmpresa = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empresa/compras`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    });
    setCompras(response.data);
  } catch (error) {
    console.error('Erro ao buscar histórico de compras da empresa:', error);
    toast.error('Erro ao carregar histórico de compras.');
  }
};

const handleSubmit = async () => {
  const userId = authState.userId;

  // Calcula o valor total dos cursos selecionados
  const totalCompra = calculateTotal();

  // Cria um único item para o Mercado Pago com a lista de cursos
  const items = [
    {
      id: selectedCursos,
      title: selectedCursos.map(cursoId => {
        const curso = cursosOriginais.find(curso => curso.id === cursoId);
        return curso ? curso.nome : '';
      }).join(', '),
      unit_price: parseFloat(totalCompra.toFixed(2).replace(',', '.')),
      quantity: 1,
    }
  ];

  dispatch(setPurchaseStatus('pendente'));

  const toastId = toast.info("Compra Pendente: Você tem 5 minutos para realizar a compra", { autoClose: false });

  try {
    const { data: { comprasRegistradas, preferenceId } } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/checkout/pacote`,
      { items, userId },
      {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      }
    );

    if (!comprasRegistradas || comprasRegistradas.length === 0) {
      toast.error("Erro ao processar a compra. Nenhuma compra registrada.");
      return;
    }

    // Obter o primeiro ID da lista de IDs separados por ponto e vírgula
    const compraId = comprasRegistradas[0][0];

    if (preferenceId) {
      const checkoutURL = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
      window.open(checkoutURL, '_blank');
    }

    window.addEventListener('beforeunload', (event) => {
      if (purchaseStatus === 'pendente') {
        event.preventDefault();
        event.returnValue = '';
      }
    });

    let checkCount = 0; // Contador para limitar as verificações
    const maxChecks = 10; // Número máximo de verificações (10 * 30 segundos = 5 minutos)

    const intervalId = setInterval(async () => {
      const status = await checkPurchaseStatus(compraId);
      checkCount++;

      if (status !== 'pendente' || checkCount >= maxChecks) {
        clearInterval(intervalId);
        toast.dismiss(toastId);

        if (status === 'aprovado') {
          clearCart();
        } else if (status === 'reprovado' || status === 'Compra não efetuada no tempo determinado') {
          // Lógica para lidar com compra reprovada ou expirada
        }

        dispatch(setPurchaseStatus(''));

        // Atualizar o histórico de compras
        fetchComprasEmpresa(); // Chamando a função para atualizar o histórico
      }
    }, 60000);

   // Timeout de 5 minutos
   setTimeout(async () => {
    if (purchaseStatus === 'pendente') {
      toast.dismiss(toastId);
      toast.error("Compra não realizada por tempo expirado");
      dispatch(setPurchaseStatus(''));

      // Verificar o status da compra no banco de dados
      const status = await checkPurchaseStatus(compraId);
      if (status === 'pendente') {
        // Atualizar o status da compra para "Compra não efetuada no tempo determinado"
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/atualizar-status-compra/${compraId}`, {}, {
            headers: {
              Authorization: `Bearer ${authState.token}`
            }
          });
          // Atualizar o histórico de compras
          fetchComprasEmpresa();
        } catch (error) {
          console.error('Erro ao atualizar status da compra:', error);
          toast.error('Erro ao atualizar status da compra.');
        }
      }
    }
  }, 300000); // 5 minutos em milissegundos

  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Erro ao processar o pagamento. Por favor, tente novamente.");
    console.error("Erro ao criar a preferência de pagamento:", error);
  }
};

  const requestPopupPermission = () => {
    if (!("Notification" in window)) {
      console.error("Este navegador não suporta notificações.");
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permissão de pop-up concedida.");
        } else {
          console.log("Permissão de pop-up negada.");
        }
      });
    }
  };

  

  useEffect(() => {
    setCursosOriginais(cursosData);
  }, []);

  useEffect(() => {
    setSelectedOriginalCourses([]);
  }, []);

  const clearCart = () => {
    setSelectedCursos([]);
    setSelectedOriginalCourses([]);
    setSelectedPriceOptions({});
    setCourseCount(0);
    setSelectedAccessPeriods({});
    setAgreedToServiceTerms(false); // Resetar o checkbox de termos de serviço
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      <center>
        <div className='back' style={{ marginBottom: '25px' }}>
          <h1 style={{ fontFamily: 'Montserrat', fontSize: '28pt' }}>Comprar Cursos</h1>
        </div>
      </center>
      <Table striped bordered hover>
        <thead>
          <tr style={{ color: 'black', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
            <th>Selecionar</th>
            <th>Curso</th>
            <th>Valor Unid.</th>
            <th>Valor total p/ Alunos</th>
            <th>Alunos</th>
          </tr>
        </thead>
        <tbody>
          {cursosData.map(curso => (
            <tr key={curso.id}>
              <td>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCursos.includes(curso.id)} // Corrigido para selectedCursos
                      onChange={() => handleCursoSelect(curso.id)}
                      name={`curso-${curso.id}`}
                    />
                  }
                  label=""
                />
              </td>
              <td>{curso.nome}</td>
              <td>R$ {curso.valor_10d.toFixed(2)}</td>
              <td>R$ {(curso.valor_10d * usuarios.length).toFixed(2)}</td>
              <td>
                <Form.Group>
                  {usuarios.map(usuario => (
                    <Form.Check
                      key={usuario.id}
                      type="checkbox"
                      label={`${usuario.nome} ${usuario.sobrenome}`}
                      checked={selectedAlunos[usuario.id] || false}
                      onChange={(e) => handleAlunoSelect(usuario.id, e.target.checked)}
                    />
                  ))}
                </Form.Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-center" style={{ marginBottom: '20px', fontFamily: 'Montserrat', fontSize: '18pt' }}>
        <strong>Total da Compra: R$ {calculateTotal().toFixed(2)}</strong>
      </div>
      <hr />
      <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px', marginBottom: '10px', border: '1px solid gray', padding: '10px', fontFamily:'Montserrat' , backgroundColor:'#FFFFFF' }}>
    <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>
    <p>CURSOS RÁPIDOS</p>
    <p>Termos e Condições Gerais de Compra e Uso </p>
    <p>Pelo presente instrumento e na melhor forma de direito, em que são partes contratantes, de um lado, a
    FMATCH TECNOLOGIA LTDA, inscrito no CNPJ sob o nº 52.622.018/0001-29, com sede na cidade de
Lençóis Paulista, estado de São Paulo, Rua Coronel Álvaro Martins, 443, Vila nova Irerê, CEP 1682-180, e de
outro lado o "ALUNO", cujos dados se encontram cadastrados no formulário de pré-inscrição do curso na
modalidade de educação a distância vinculado eletronicamente a este termo, têm entre si justo e acordado o
presente contrato que se regerá pelas cláusulas e condições seguintes:
 </p>
    <p>1. Do Objeto </p>
    <p>1.1 Constitui objeto do presente contrato a compra e uso de serviços educacionais consistente em CURSOS
RÁPIDOS ORIGINAIS FMATCH para TREINAMENTO fornecidos pela FMATCH TECNOLOGIA
LTDA para o contratante ALUNO de acordo com o conteúdo especificado nas diretrizes de acesso na
aba do curso desejado que se enontra no endereço https://www.fmatch.com.br que foi
devidamente observado antes da compra.
 </p>
    <p>2. Definições </p>
    <p>2.1.Plataforma: Ambiente virtual que disponibiliza cursos online. </p>
    <p>2.2.ALUNO: Pessoa física que se cadastra na plataforma e adquiri os cursos. </p>
    <p>2.3.Curso: Conteúdo educativo curso rápido disponibilizado em videoaulas no formato da
tecnologia de streaming ou broadcast;
 </p>
    <p>2.4.Plataforma: Site e Área do ALUNO, acessível após login no sistema, disponível em
https://www.fmatch.com.br;
 </p>
    <p>2.5.Política de Privacidade: regras para proteção da privacidade do Usuário, bem como para trazer
transparência acerca do tratamento dos dados e informações pessoais que são
disponibilizados na Plataforma; </p>
    <p>2.6.Política de Proteção aos Direitos Autorais: regras para orientar Você sobre a proteção à
propriedade intelectual conferida pela Lei de Direitos Autorais, pela Constituição Federal, e
demais legislações aplicáveis;
 </p>
    <p>2.7.Material Didático: Apostilas, vídeos, exercícios e outros materiais eventualmente
disponibilizados para o aprendizado do Usuário. </p>
    <p>2.8.Instrutor: Pessoa responsável pelo conteúdo e acompanhamento do Curso. </p>
    <p>1.2 Das Responsabilidades </p>
    <p>1.2.1 A FMATCH se obriga a: </p>
    <p>2.8.1. Disponibilizar o modulo do curso especificado nas condições apresentadas no
endereço: https://www.fmatch.com.br/.
 </p>
    <p>2.8.2. Disponibilizar e permitir o acesso do ALUNO matriculado no curso durante o
período compreendido entre o início e o término estabelecido no programa. </p>
    <p>2.8.3. Disponibilizar no período previsto do curso os recursos didáticos e
atendimento conforme a descrição do programa. </p>
    <p>2.8.4. Emitir certificado de conclusão para o ALUNO que obteve o aproveitamento
mínimo estipulado para o curso após o seu encerramento.
 </p>
    <p>2.9.O ALUNO se obriga a: </p>
    <p>2.9.1. Ao se cadastrar o usuário deverá informar dados completos, recentes e
válidos, sendo de sua exclusiva responsabilidade manter referidos dados
atualizados, bem como o usuário se compromete com a veracidade dos dados
fornecidos. </p>
    <p>2.9.2. O ALUNO está ciente de que o mero cadastro na Plataforma não fornecerá
acesso aos Cursos da FMATCH, os quais só serão disponibilizados ao
ALUNO após comprovação de pagamento, conforme pormenorizado neste
contrato. </p>
    <p>2.9.3. Menores de 18 anos e aqueles que não possuírem plena capacidade civil
deverão obter previamente o consentimento expresso de seus responsáveis
legais para utilização da plataforma e dos serviços ou produtos, sendo de
responsabilidade exclusiva dos mesmos o eventual acesso por menores de
idade e por aqueles que não possuem plena capacidade civil sem a prévia
autorização.
 </p>
    <p>2.9.4. Mediante a realização do cadastro o usuário declara e garante expressamente
ser plenamente capaz, podendo exercer e usufruir livremente dos serviços e
produtos. </p>
    <p>2.9.5. Efetuar o pagamento do curso conforme opção no campo pagamento.
 </p>
    <p>2.9.6. Utilizar o curso de forma ética e responsável. </p>
    <p>2.9.7. Manter o login e senha em sigilo. </p>
    <p>2.9.8. Não informar seus dados cadastrais e/ou de acesso à plataforma a terceiros,
responsabilizando-se integralmente pelo uso que deles seja feito.
 </p>
    <p>2.9.9. Fornecer um endereço de e-mail válido, através do qual o site realizará todas
comunicações necessárias.
 </p>
    <p>2.9.10. Manter confidencialidade de sua senha evitando o acesso indevido às
informações pessoais ou uso indevido. </p>
    <p>2.9.11. Realizar as atividades previstas no curso com o aproveitamento do conteúdo
ministrado dentro do limite de conclusão, até a data de término estabelecida
no Programa. </p>
    <p>2.9.12. Assegurar que o seu equipamento (hardware) e programas (software) são
compatíveis com as características técnicas que viabilize a utilização da
plataforma e dos serviços ou produtos, sendo inteiramente responsável pelas
condições de local e horário para seus estudos online, bem como pelo acesso
ao curso, e serviços de acesso à internet, telefone e outros recursos
necessários para o bom funcionamento do mesmo.
 </p>
    <p>4. Da computo do pagamento </p>
    <p>4.1.O ALUNO é responsável por verificar as informações de compra e pagamento antes de
confirmar a compra e o pagamento.
 </p>
    <p>4.2.O pagamento do curso se dará por meio da plataforma MERCADO PAGO, sendo tal plataforma
responsável pelos métodos de pagamento disponíveis e a gestão dos pagamentos. </p>
    <p>5. Do período para realização do curso
 </p>
    <p>5.1.Após computado o pagamento o curso será disponibilizado ao ALUNO para acesso.
 </p>
    <p>5.2.Ao abrir o módulo pela primeira vez, é reconhecido o acesso do ALUNO ao curso e considerado
como visualizado o primeiro acesso e concluído o curso rápido, iniciando-se o prazo de 10
(dez) dias de vigência em que o curso será disponibilizado ao ALUNO. </p>
    <p>5.3.Dentro do prazo de disponibilidade de 10 (dez) dias, ao ALUNO será permitido outras 2
(três) visualizações do mesmo curso rápido a título de “revisão de modulo” (posterior o
primeiro acesso), sendo certo que após o acesso a 2ª (segunda) “revisão de módulo”
disponibilizada ou decorrido o prazo de 10 (dez) dias do primeiro acesso, novos acessos ao
curso rápido serão automaticamente revogado.
 </p>
    <p>6. Disposições gerais </p>
    <p>6.1.Todos os Cursos e Conteúdos que são disponibilizados para o ALUNO na Plataforma os são
apenas no estado em que se encontram e tão somente para sua informação e uso pessoal na
forma designada FMATCH. Tais Cursos e Conteúdos não serão adaptados, EM NENHUMA
HIPÓTESE, à qualquer necessidade ou solicitação do ALUNO. </p>
    <p>6.2.O acesso à Plataforma será liberado ao Usuário após o preenchimento completo dos dados
cadastrais, com todas as informações obrigatórias solicitadas pela FMATCH com a
criação do respectivo login e senha para acesso.
 </p>
    <p>6.3.O ALUNO é o único responsável pelas informações por ele fornecidas quando de seu cadastro
na Plataforma, estando ciente de que a FMATCH não se responsabiliza por informações
incorretas ou inverídicas apresentadas pelo Usuário, o qual será responsável, também, por
manter atualizadas todas as informações pessoais e de contato fornecidas, especialmente seu
correio eletrônico (e-mail), telefone e endereço. </p>
    <p>6.4.O ALUNO reconhece que, caso seja constatado que este forneceu informações incorretas ou
inverídicas em seu cadastro, seu acesso à Plataforma poderá ser cancelado,
independentemente de qualquer formalidade, sem que nada seja devido pela FMATCH,
em razão de tal cancelamento.
 </p>
    <p>6.5.No acesso, navegação, cadastro e/ou utilização da Plataforma, aplicam-se as disposições
constantes na Política de Privacidade e Política de Proteção aos Direitos Autorais,
conjuntamente com estes Termos de Uso.
 </p>
    <p>6.6.A FMATCH poderá bloquear totalmente o acesso do ALUNO, independentemente de
prévio aviso, caso seja constatado qualquer atitude que possa colocar em risco a segurança e
a estabilidade do serviço, ou caso seja constado qualquer descumprimento do ALUNO.  </p>
    <p>6.7.A FMATCH se reserva o direito de alterar este instrumento a qualquer momento. Em
caso de dúvidas ou problemas, o Usuário deve entrar em contato com o suporte da
plataforma. </p>
    <p>6.8.A FMATCH não disponibiliza suas videoaulas em DVDs, pendrives ou qualquer tipo de
mídia de armazenamento, devendo o acesso ao Conteúdo ocorrer apenas na Plataforma. </p>
    <p>6.9. Após o término do Curso, o ALUNO não terá mais permissão para acessá-lo, devendo se
atentar às datas do cronograma disponibilizado pela FMATCH na Plataforma. </p>
    <p>6.10.O acesso a áreas restritas dentro da Plataforma somente é permitido aos Usuários
devidamente cadastrados, a partir do uso de seu login e senha, sendo tais áreas consideradas
fechadas. Neste sentido, o ALUNO fica ciente que se alguma falha no sistema for encontrada
que permita o seu acesso a qualquer área restrita da Plataforma, ainda que por mera
tentativa de erro e acerto de senha, ainda assim o ALUNO incidirá em sanções civis e criminais
decorrentes de sua conduta. </p>
    <p>6.11.O ALUNO poderá exercer seu direito de arrependimento previsto na Lei 8.098/1990 (Código
de Defesa do Consumidor), desde que não tenha assistido a mais de 30% (trinta por cento)
do conteúdo do Curso, podendo requerer o cancelamento do acesso ao curso adquirido e a
devolução dos valores pagos, através do email: conect.fam@gmail.com com o seguinte
título: “Cancelamento”. </p>
    <p>6.12. Reconhecendo o alcance mundial da Internet, o ALUNO concorda em cumprir qualquer
legislação do local onde está situado, bem como as leis vigentes na sede da FMATCH,
no Brasil e, ainda, a respeitar o disposto nestes Termos de Uso, Política de Privacidade e
Política de Proteção aos Direitos Autorais. </p>
    <p>6.13.O ALUNO reconhece que, em qualquer hipótese, será o único responsável pelo uso que fizer
da Plataforma, bem como por qualquer conteúdo ou comentário que nela inserir. </p>
    <p>6.14. Caso o ALUNO identifique qualquer material ofensivo, ilegal, ou atentatório à moral e aos
bons costumes, disponibilizado por outro Usuário da Plataforma, poderá, imediatamente
comunicar a FMATCH, através do email conect.fam@gmail.com com o título “abuso” ,
para que possa apurar a denúncia, ficando a FMATCH isenta de qualquer
responsabilidade por tal conteúdo, por ter sido realizado por terceiros, sem qualquer
intervenção ou controle da FMATCH.
 </p>
    <p>6.15. Ficará ao critério da administração da FMATCH a apuração das denúncias que lhe forem
dirigidas. </p>
    <p>6.16.O comportamento ilícito poderá ser sancionado com a suspensão ou cancelamento do
cadastro do Usuário na Plataforma, sem prejuízo da adoção das medidas judiciais cabíveis. </p>
    <p>7. Da Conclusão e Certificação </p>
    <p>7.1.Para ser certificado ao final do curso, o ALUNO deverá participar e concluir as atividades
propostas no prazo e obter o aproveitamento mínimo estipulado para o curso na data de seu
encerramento. </p>
    <p>7.2.Concluído o curso pelo ALUNO, caso necessário, este poderá solicitar a emissão do certificado
de conclusão. </p>
    <p>8. Exclusão de garantias e de responsabilidade da FMATCH </p>
    <p>8.1.A FMATCH não será, em hipótese alguma, responsável por quaisquer danos decorrentes
da interrupção do acesso à Plataforma ou falhas no seu funcionamento.</p>
    <p>8.2.A FMATCH utiliza as melhores práticas recomendadas de mercado para manter seguros
todos os dados inseridos por Você na Plataforma, entretanto, a FMATCH se exime de
responsabilidade por eventuais danos e prejuízos de toda natureza que decorram do
conhecimento que terceiros não autorizados tenham de quaisquer informações passadas pelo
ALUNO, em decorrência de falha exclusivamente atribuível ao ALUNO ou a terceiros que fujam
a qualquer controle razoável da FMATCH. </p>
    <p>8.3.A FMATCH não garante a ausência de softwares maliciosos quando da utilização de sua
Plataforma, bem como outros elementos nocivos que possam produzir alterações nos
sistemas informáticos dos Usuários (software e hardware) ou nos documentos eletrônicos
armazenados no sistema informático, eximindo-se de qualquer responsabilidade pelos danos
e prejuízos que possam decorrer da presença de vírus ou de outros elementos nocivos na
Plataforma. </p>
    <p>8.4.A FMATCH poderá, sem anuência ou concordância do Usuário, realizar quaisquer
alterações na Plataforma que julgar necessárias, sem que qualquer valor ou indenização seja
devida a Você em razão disso.
 </p>
    <p>8.5.Na máxima extensão permitida pela legislação aplicável, o valor máximo a que a FMATCH se responsabiliza, independente do motivo que originou o pedido, está limitado ao
montante eventualmente pago pelo ALUNO à FMATCH, desde que inequivocamente
comprovado o prejuízo alegado.
 </p>
    <p>8.6. Mesmo que qualquer parte destes Termos de Uso seja considerada inválida ou inexequível,
as demais disposições permanecerão em pleno vigor e efeito, sendo que o referido trecho
deverá ser interpretado de forma consistente com a lei aplicável, para refletir, na medida do
possível, a intenção original das partes. </p>
    <p>8.7. Eventual falha da FMATCH em exigir quaisquer direitos ou disposições dos presentes
Termos de Uso não constituirá renúncia, podendo exercer regularmente o seu direito, dentro
dos prazos legais. </p>
    <p>9. Dos Direitos Autorais
 </p>
    <p>9.1.Toda e qualquer atividade realizada com o uso da senha será de responsabilidade do usuário,
que deverá informar prontamente a plataforma em caso de uso indevido da respectiva senha.
 </p>
    <p>9.2.Não será permitido ceder, vender, alugar ou transferir, de qualquer forma, a conta, que é
pessoal e intransferível. </p>
    <p>9.3.É terminantemente proibida a cópia, reprodução, no todo ou em partes do conteúdo do curso
os vídeos disponibilizados na plataforma são protegidos por direitos autorais e propriedade
intelectual.
 </p>
    <p>9.4.O ALUNO está autorizado a assistir os vídeos para fins de estudo, treinamento e educação </p>
    <p><strong>9.5.A transmissão do Curso ao ALUNO ocorrerá, exclusivamente, na Plataforma, sendo proibido
o armazenamento, download ou qualquer meio de gravação das videoaulas. </strong></p>
    <p><strong>9.6.Não é permitido que os cursos sejam repassados, copiados, reproduzidos, distribuídos,
transmitidos, difundidos, exibidos, vendidos, licenciados, adaptados ou, de outro modo,
explorados para quaisquer fins, sem o consentimento prévio e por escrito da FMATCH,
nem mesmo é permitido ao ALUNO reproduza para outras pessoas ou
compartilhe/distribuía ou ceda sua “revisão de modulo” para terceiros. </strong></p>
    <p><strong>9.7.É proibido qualquer forma de cópia, inclusive de instantâneos, quadro de imagens ou sons
dos cursos rápidos ou o uso dos cursos rápidos para qualquer finalidade que não seja a
expressamente autorizada exclusivamente ao ALUNO.  </strong></p>
    <p><strong>9.8.É proibida a utilização dos cursos para fins ilegais ou imorais.
 </strong></p>
    <p>9.9. O ALUNO deverá utilizar a Plataforma e todo o Conteúdo nela disponibilizado, incluindo os
Cursos, de acordo com o ordenamento jurídico brasileiro, com a moral e os bons costumes
geralmente aceitos, com os presentes Termos de Uso, Política de Proteção aos Direitos
Autorais e as demais instruções existentes na Plataforma, abstendo-se de usar, explorar,
reproduzir ou divulgar, indevidamente, por qualquer meio, o conteúdo disponibilizado na
Plataforma. </p>
    <p>9.10. Todo conteúdo disponibilizado na Plataforma, como marcas, logotipos, vídeos, arquivos,
textos, ícones, desenhos, sons, layouts, materiais didáticos, algoritmos, incluindo-se os
Cursos, são de propriedade exclusiva da FMATCH, ou de terceiros que concederam
autorização para tal utilização, e estão protegidos pelas leis e tratados internacionais, sendo
vedada sua cópia, reprodução, ou qualquer outro tipo de utilização, ficando os infratores
sujeitos às sanções civis e criminais correspondentes, nos termos das Leis 9.279/96, 9.610/98
e 9.609/98, conforme detalhado na Política de Proteção aos Direitos Autorais. </p>
    <p>9.11.A violação dos direitos autorais pode resultar em sanções civis e criminai. </p>
    <p>9.12. Todas as marcas, nomes comerciais ou logotipos de qualquer espécie, disponibilizados na
Plataforma, são de propriedade da FMATCH, sem que a utilização da Plataforma possa
ser entendida como autorização para que o ALUNO possa citar as tais marcas, os nomes
comerciais e logotipos.
</p>
    <p>9.13.A FMATCH, ainda, se reserva o direito de recusar ou retirar o acesso à Plataforma, a
qualquer momento, e sem necessidade de prévio aviso, por iniciativa própria ou por
exigência de um terceiro, se o ALUNO descumprir, de qualquer forma, estes Termos de Uso,
as Políticas de Privacidade e Proteção aos Direitos Autorais e/ou a legislação vigente. </p>
    <p>9.14.O ALUNO reconhece que a FMATCH pode, a qualquer tempo, remover da Plataforma
qualquer Curso ou Conteúdo disponibilizado, sem necessidade de aviso prévio e sem que
nenhuma indenização seja devida em razão de tal remoção, com exceção das hipóteses
expressamente previstas no Contrato. </p>
    <p>9.15.O ALUNO se compromete a não produzir, reproduzir, disponibilizar, divulgar ou transmitir
qualquer conteúdo que: (i) Seja contrário a qualquer norma da legislação brasileira, bem
como à moral e aos bons costumes normalmente aceitos, ou que incentive qualquer forma
de racismo, discriminação ou violência; (ii)Seja protegido por quaisquer direitos de
propriedade intelectual ou industrial pertencente a terceiros, sem que Você tenha obtido
previamente dos seus titulares a autorização necessária para levar a cabo o uso que efetuar
ou pretender efetuar; (iii) Incorporem códigos maliciosos ou outros elementos físicos ou
eletrônicos que possam gerar danos ou impedir o normal funcionamento da rede, do sistema
ou de equipamentos informáticos (hardware e software) da CONNEC FAN ou de terceiros, ou
que possam causar dano aos documentos eletrônicos e arquivos armazenados nestes
equipamentos informáticos; (iv) Provoquem, por suas características (tais como forma,
extensão etc.) dificuldades no normal funcionamento do serviço. </p>
    <p>10. Outorga final </p>
    <p>10.1.Os presentes Termos de Uso serão regidos, interpretados e executados de acordo com as leis
da República Federativa do Brasil, independentemente dos conflitos dessas leis com leis de
outros estados ou países, sendo competente o Foro de Lençóis Paulisa/SP, no Brasil, para
dirimir qualquer dúvida decorrente deste instrumento, renunciando expressamente, neste
ato, à competência de qualquer outro foro, por mais privilegiado que seja ou venha a ser.
 </p>
    <p>10.2. E por estarem assim justas e contratadas, o ALUNO, ao clicar no botão "CONCORDO" assina
eletronicamente o presente contrato e declara estar de acordo com os Termos de Uso para
Serviços de Curso Online, aderindo às condições, que têm a mesma validade jurídica de um
documento impresso </p>
    <p>10.3. Caso Você não concorde com os presentes Termos de Uso, recomendamos que não prossiga
com o cadastramento na Plataforma, bem como que se abstenha de acessá-la e utilizá-la. </p>
   
  </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToServiceTerms}
            onChange={(e) => setAgreedToServiceTerms(e.target.checked)}
            name="agreedToServiceTerms"
          />
        }
        style={{ fontFamily: 'Montserrat' }}
        label="Concordo com os Termos e Condições de Serviço."
      />

      <Button
        variant="primary"
        onClick={handleSubmit}
        className="btn-suus"
        style={{ backgroundColor: '#14253A' }}
        disabled={!agreedToServiceTerms || purchaseStatus === 'pendente'}
      >
        Comprar Cursos
      </Button>

      <hr />
        <center>
         <div className='back' style={{ marginBottom: '25px' }}>
             <h1 style={{ fontFamily: 'Montserrat', fontSize: '28pt' }}>Historico de Compras</h1>
         </div>
        </center>
        <Table striped bordered hover style={{ marginTop: '25px' }}>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Aluno</th> {/* Nova coluna para o nome do aluno */}
            <th>Período</th>
            <th>Data do Pedido de Compra</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td>{compra.curso_nome}</td>
              <td>{compra.aluno_nome}</td> {/* Exibir o nome do aluno */}
              <td>{compra.periodo}</td>
              <td>{compra.data_compra}</td>
              <td>{compra.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CursosEmpresas;