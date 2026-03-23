<?php
// Define o cabeçalho como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Carrega a biblioteca de execução remota via SSH
require_once __DIR__ . '/../lib/lib-ssh.php';

// Lê e sanitiza os parâmetros enviados via POST
$dispositivo = isset($_POST['dispositivo']) ? trim($_POST['dispositivo']) : '';
$slot        = isset($_POST['slot'])        ? trim($_POST['slot'])        : '';
$drive       = isset($_POST['drive'])       ? trim($_POST['drive'])       : '';

// Valida o dispositivo: deve seguir o padrão /dev/sgN
if (empty($dispositivo) || !preg_match('/^\/dev\/sg[0-9]+$/', $dispositivo))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Dispositivo inválido ou não informado.']);
    exit;
}

// Valida slot e drive: devem ser inteiros não negativos
if (!preg_match('/^[0-9]+$/', $slot) || !preg_match('/^[0-9]+$/', $drive))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Slot ou drive inválido.']);
    exit;
}

// Executa remotamente o comando mtx load
$saida = executarSsh('mtx -f ' . escapeshellarg($dispositivo) . ' load ' . (int)$slot . ' ' . (int)$drive . ' 2>&1');

// Verifica se houve resposta do dispositivo
if (empty($saida))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Nenhuma resposta do dispositivo.']);
    exit;
}

// mtx retorna mensagem de sucesso contendo "Loaded"
if (stripos($saida, 'Loaded') !== false || stripos($saida, 'load') !== false)
{
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Slot ' . $slot . ' carregado no drive ' . $drive . ' com sucesso.',
        'saida'    => trim($saida),
    ]);
}
else
{
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Falha ao carregar: ' . trim($saida),
    ]);
}
