<?php
// Define o cabeçalho da resposta como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Carrega a biblioteca de execução remota via SSH
require_once __DIR__ . '/../lib/lib-ssh.php';

// Lê e sanitiza os parâmetros enviados via POST
$dispositivo = isset($_POST['dispositivo']) ? trim($_POST['dispositivo']) : '';
$origem      = isset($_POST['origem'])      ? (int)$_POST['origem']      : 0;
$destino     = isset($_POST['destino'])     ? (int)$_POST['destino']     : 0;

// Valida o dispositivo: deve seguir o padrão /dev/sgN
if (empty($dispositivo) || !preg_match('/^\/dev\/sg[0-9]+$/', $dispositivo))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Dispositivo inválido ou não informado.']);
    exit;
}

// Valida que origem e destino são números positivos
if ($origem <= 0 || $destino <= 0)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Slot de origem e destino devem ser números positivos.']);
    exit;
}

// Valida que origem e destino não são o mesmo slot
if ($origem === $destino)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Slot de origem e destino não podem ser iguais.']);
    exit;
}

// Consulta remotamente o status atual do autoloader para validar slots
$statusSaida = executarSsh('mtx -f ' . escapeshellarg($dispositivo) . ' status 2>&1');

// Verifica se houve resposta do dispositivo
if (empty($statusSaida))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Nenhuma resposta do dispositivo ' . $dispositivo]);
    exit;
}

// Inicializa flags de validação dos slots
$origemOcupado  = false;
$etiquetaFita   = '';
$destinoOcupado = false;

foreach (explode("\n", $statusSaida) as $linha)
{
    $linha = trim($linha);

    // Verifica o slot de origem
    if (preg_match('/Storage Element\s+' . $origem . ':(Empty|Full)(.*)/i', $linha, $m))
    {
        $origemOcupado = strtolower($m[1]) === 'full';

        if (preg_match('/VolumeTag\s*=\s*(\S+)/i', $m[2], $mv)) $etiquetaFita = trim($mv[1]);
    }

    // Verifica o slot de destino
    if (preg_match('/Storage Element\s+' . $destino . ':(Empty|Full)/i', $linha, $m))
    {
        $destinoOcupado = strtolower($m[1]) === 'full';
    }
}

// Rejeita a operação se a origem estiver vazia
if (!$origemOcupado)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Slot de origem ' . $origem . ' está vazio.']);
    exit;
}

// Rejeita a operação se o destino já estiver ocupado
if ($destinoOcupado)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Slot de destino ' . $destino . ' já está ocupado.']);
    exit;
}

// Executa remotamente o comando mtx transfer para mover a fita entre os slots
$saida     = executarSsh('mtx -f ' . escapeshellarg($dispositivo) . ' transfer ' . (int)$origem . ' ' . (int)$destino . ' 2>&1');
$houveErro = !empty($saida) && preg_match('/error|fail|unable|cannot/i', $saida);

// Verifica se o comando retornou erro
if ($houveErro)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Falha ao executar o transfer: ' . trim($saida)]);
    exit;
}

// Retorna sucesso com os detalhes da operação realizada
echo json_encode([
    'sucesso'     => true,
    'dispositivo' => $dispositivo,
    'origem'      => $origem,
    'destino'     => $destino,
    'etiqueta'    => $etiquetaFita,
    'mensagem'    => 'Fita ' . ($etiquetaFita ?: 'S/N') . ' movida do slot ' . $origem . ' para o slot ' . $destino . ' com sucesso.',
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
