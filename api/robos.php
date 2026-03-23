<?php
// Define o cabeçalho da resposta como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Carrega a biblioteca de execução remota via SSH
require_once __DIR__ . '/../lib/lib-ssh.php';

// Executa remotamente o comando que lista os autoloaders
$saida = executarSsh('lsscsi -g | grep mediumx');

// Inicializa o array que armazenará a lista de robôs
$robos = [];

// Verifica se o comando retornou alguma saída
if (!empty($saida))
{
    // Divide a saída em linhas para processar cada dispositivo
    $linhas = explode("\n", trim($saida));

    foreach ($linhas as $linha)
    {
        // Ignora linhas vazias
        if (empty(trim($linha))) continue;

        // Remove espaços duplos para facilitar o split
        $linha  = preg_replace('/\s+/', ' ', trim($linha));
        $partes = explode(' ', $linha);

        $endereco    = isset($partes[0]) ? $partes[0] : 'N/A';
        $tipo        = isset($partes[1]) ? $partes[1] : 'N/A';
        $marca       = isset($partes[2]) ? $partes[2] : 'Desconhecida';
        $modelo      = isset($partes[3]) ? $partes[3] : 'Desconhecido';
        $revisao     = isset($partes[4]) ? $partes[4] : 'N/A';
        $dispositivo = end($partes);

        $robos[] =
        [
            'endereco'    => $endereco,
            'tipo'        => $tipo,
            'marca'       => $marca,
            'modelo'      => $modelo,
            'revisao'     => $revisao,
            'dispositivo' => $dispositivo,
        ];
    }
}

// Retorna o JSON com a lista de robôs e o total encontrado
echo json_encode([
    'sucesso' => true,
    'total'   => count($robos),
    'robos'   => $robos,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
