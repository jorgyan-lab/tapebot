<?php
// Define o cabeçalho como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Lê e sanitiza os parâmetros enviados via POST
$dispositivo = isset($_POST['dispositivo']) ? trim($_POST['dispositivo']) : '';
$drive       = isset($_POST['drive'])       ? trim($_POST['drive'])       : '';
$caminho     = isset($_POST['caminho'])     ? trim($_POST['caminho'])     : '';

// Valida o dispositivo: deve seguir o padrão /dev/sgN
if (empty($dispositivo) || !preg_match('/^\/dev\/sg[0-9]+$/', $dispositivo))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Dispositivo inválido ou não informado.']);
    exit;
}

// Valida drive: deve ser inteiro não negativo
if (!preg_match('/^[0-9]+$/', $drive))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Drive inválido.']);
    exit;
}

// Valida caminho: deve estar dentro do diretório permitido
$basePath = '/var/www/html/data';
$realPath = realpath($caminho);

if (!$realPath || strpos($realPath, $basePath) !== 0)
{
    echo json_encode(['sucesso' => false, 'erro' => 'Caminho inválido ou fora do diretório permitido.']);
    exit;
}

// Monta o dispositivo de fita a partir do número do drive (ex: drive 0 → /dev/nst0)
$dispositivoFita = '/dev/nst' . (int)$drive;

// Monta e executa o comando tar para gravar na fita
$comando = 'tar -cvf ' . escapeshellarg($dispositivoFita) . ' ' . escapeshellarg($realPath) . ' 2>&1';
$saida   = shell_exec($comando);

// Verifica se houve resposta
if (empty($saida))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Nenhuma resposta do dispositivo.']);
    exit;
}

// tar não retorna palavra-chave clara de sucesso, então verifica ausência de "error"
if (stripos($saida, 'error') === false && stripos($saida, 'cannot') === false)
{
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Gravação de ' . basename($realPath) . ' no DRIVE-' . $drive . ' concluída.',
        'saida'    => trim($saida),
    ]);
}
else
{
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Falha ao gravar: ' . trim($saida),
    ]);
}
