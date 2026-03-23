<?php
// Define o cabeçalho como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Diretório fixo onde ficam os dados a gravar
$diretorio = '/var/www/html/data';

// Verifica se o diretório existe e é acessível
if (!is_dir($diretorio))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Diretório não encontrado: ' . $diretorio]);
    exit;
}

// Lista apenas entradas diretas do diretório (não recursivo)
$entradas = scandir($diretorio);
$itens    = [];

foreach ($entradas as $entrada)
{
    // Ignora entradas de navegação
    if ($entrada === '.' || $entrada === '..') continue;

    $caminho  = $diretorio . '/' . $entrada;
    $itens[]  =
    [
        'nome'      => $entrada,
        'caminho'   => $caminho,
        'tipo'      => is_dir($caminho) ? 'diretorio' : 'arquivo',
        'tamanho'   => is_file($caminho) ? filesize($caminho) : null,
    ];
}

echo json_encode(['sucesso' => true, 'itens' => $itens]);
