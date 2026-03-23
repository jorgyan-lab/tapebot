<?php
// Define o cabeçalho da resposta como JSON com UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Bloqueia requisições que não sejam POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido.']);
    exit;
}

// Lê e sanitiza as credenciais recebidas
$siape = isset($_POST['siape']) ? trim($_POST['siape']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha']       : '';

// Valida se os campos foram preenchidos
if (empty($siape) || empty($senha))
{
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'erro' => 'SIAPE e senha são obrigatórios.']);
    exit;
}

// Configurações do servidor LDAP
$servidorLdap  = 'CEF-DC02';
$portaLdap     = 389;
$baseDn        = 'DC=cefetes,DC=br';

// Grupo que tem permissão de acesso ao sistema
$grupoPermitido = 'grpCEFOR-CGTI-GLPI';

// Monta o UPN para autenticação (formato aceito pelo AD)
$upnUsuario = $siape . '@cefetes.br';

// Conecta ao servidor LDAP
$conexao = ldap_connect($servidorLdap, $portaLdap);

// Verifica se a conexão foi estabelecida
if (!$conexao)
{
    http_response_code(503);
    echo json_encode(['sucesso' => false, 'erro' => 'Não foi possível conectar ao servidor LDAP.']);
    exit;
}

// Define opções do protocolo LDAP
ldap_set_option($conexao, LDAP_OPT_PROTOCOL_VERSION, 3);
ldap_set_option($conexao, LDAP_OPT_REFERRALS, 0);
ldap_set_option($conexao, LDAP_OPT_NETWORK_TIMEOUT, 5);

// Tenta autenticar o usuário com as credenciais fornecidas
$bind = @ldap_bind($conexao, $upnUsuario, $senha);

// Verifica se o bind (autenticação) foi bem-sucedido
if (!$bind)
{
    http_response_code(401);
    echo json_encode(['sucesso' => false, 'erro' => 'SIAPE ou senha inválidos.']);
    exit;
}

// Busca os dados do usuário no AD após autenticação bem-sucedida
$filtro     = '(sAMAccountName=' . ldap_escape($siape, '', LDAP_ESCAPE_FILTER) . ')';
$atributos  = ['cn', 'mail', 'memberOf', 'department', 'title'];
$resultado  = ldap_search($conexao, $baseDn, $filtro, $atributos);
$entradas   = ldap_get_entries($conexao, $resultado);

// Verifica se o usuário foi encontrado na base
if ($entradas['count'] === 0)
{
    http_response_code(403);
    echo json_encode(['sucesso' => false, 'erro' => 'Usuário não encontrado no diretório.']);
    exit;
}

$usuario = $entradas[0];

// Extrai os grupos do usuário
$grupos = [];
if (isset($usuario['memberof']))
{
    // Remove o índice numérico 'count' retornado pelo LDAP
    for ($i = 0; $i < $usuario['memberof']['count']; $i++)
    {
        // Extrai somente o nome do grupo do DN completo (ex: CN=grpCEFOR-CGTI-GLPI,OU=...)
        preg_match('/^CN=([^,]+)/i', $usuario['memberof'][$i], $match);
        if (!empty($match[1]))
        {
            $grupos[] = $match[1];
        }
    }
}

// Verifica se o usuário pertence ao grupo autorizado
if (!in_array($grupoPermitido, $grupos))
{
    http_response_code(403);
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Acesso negado. Somente membros da CGTI têm acesso a este sistema.'
    ]);
    exit;
}

// Encerra a conexão LDAP
ldap_unbind($conexao);

// Retorna os dados do usuário autenticado
echo json_encode([
    'sucesso'    => true,
    'nome'       => isset($usuario['cn'][0])         ? $usuario['cn'][0]         : '',
    'email'      => isset($usuario['mail'][0])        ? $usuario['mail'][0]       : '',
    'setor'      => isset($usuario['department'][0])  ? $usuario['department'][0] : '',
    'cargo'      => isset($usuario['title'][0])       ? $usuario['title'][0]      : '',
    'siape'      => $siape,
    'grupos'     => $grupos,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

