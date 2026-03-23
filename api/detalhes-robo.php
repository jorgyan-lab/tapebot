<?php
// Define o cabeçalho como JSON com suporte a UTF-8
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Carrega a biblioteca de execução remota via SSH
require_once __DIR__ . '/../lib/lib-ssh.php';

// Lê e sanitiza o parâmetro "dispositivo" enviado via GET
$dispositivo = isset($_GET['dispositivo']) ? $_GET['dispositivo'] : '';

// Valida o dispositivo: deve seguir o padrão /dev/sgN
if (empty($dispositivo) || !preg_match('/^\/dev\/sg[0-9]+$/', $dispositivo))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Dispositivo inválido ou não informado.']);
    exit;
}

// Executa remotamente o comando mtx para obter o status do autoloader
$saida = executarSsh('mtx -f ' . escapeshellarg($dispositivo) . ' status 2>&1');

// Verifica se o comando retornou alguma saída
if (empty($saida))
{
    echo json_encode(['sucesso' => false, 'erro' => 'Nenhuma resposta do dispositivo ' . $dispositivo]);
    exit;
}

// Inicializa as variáveis de resumo
$totalDrives       = 0;
$totalSlots        = 0;
$totalImportExport = 0;
$drives            = [];
$slots             = [];
$importExport      = [];

// Divide a saída em linhas para processar cada uma
$linhas = explode("\n", trim($saida));

foreach ($linhas as $linha)
{
    $linha = trim($linha);

    // Extrai os totais da linha de cabeçalho do Storage Changer
    if (preg_match('/Storage Changer .+:(\d+)\s+Drives?,\s+(\d+)\s+Slots?\s*\(\s*(\d+)\s+Import\/Export\s*\)/i', $linha, $m))
    {
        $totalDrives       = (int)$m[1];
        $totalSlots        = (int)$m[2];
        $totalImportExport = (int)$m[3];
        continue;
    }

    // Processa linha de drive
    if (preg_match('/Data Transfer Element\s+(\d+):(Empty|Full)(.*)/i', $linha, $m))
    {
        $numero     = (int)$m[1];
        $ocupado    = strtolower($m[2]) === 'full';
        $etiqueta   = '';
        $slotOrigem = null;

        if (preg_match('/VolumeTag\s*=\s*(\S+)/i',            $m[3], $mv)) $etiqueta   = trim($mv[1]);
        if (preg_match('/Storage Element\s+(\d+)\s+Loaded/i', $m[3], $ms)) $slotOrigem = (int)$ms[1];

        $drives[] = ['numero' => $numero, 'ocupado' => $ocupado, 'etiqueta' => $etiqueta, 'slotOrigem' => $slotOrigem];
        continue;
    }

    // Processa linha de slot Import/Export
    if (preg_match('/Storage Element\s+(\d+)\s+IMPORT\/EXPORT:(Empty|Full)(.*)/i', $linha, $m))
    {
        $numero   = (int)$m[1];
        $ocupado  = strtolower($m[2]) === 'full';
        $etiqueta = '';

        if (preg_match('/VolumeTag\s*=\s*(\S+)/i', $m[3], $mv)) $etiqueta = trim($mv[1]);

        $importExport[] = ['numero' => $numero, 'ocupado' => $ocupado, 'etiqueta' => $etiqueta];
        continue;
    }

    // Processa linha de slot comum
    if (preg_match('/Storage Element\s+(\d+):(Empty|Full)(.*)/i', $linha, $m))
    {
        $numero   = (int)$m[1];
        $ocupado  = strtolower($m[2]) === 'full';
        $etiqueta = '';

        if (preg_match('/VolumeTag\s*=\s*(\S+)/i', $m[3], $mv)) $etiqueta = trim($mv[1]);

        $slots[] = ['numero' => $numero, 'ocupado' => $ocupado, 'etiqueta' => $etiqueta];
        continue;
    }
}

// Calcula estatísticas derivadas
$drivesOcupados = count(array_filter($drives,       function($d) { return $d['ocupado']; }));
$drivesLivres   = count($drives) - $drivesOcupados;
$slotsOcupados  = count(array_filter($slots,        function($s) { return $s['ocupado']; }));
$slotsLivres    = count($slots)  - $slotsOcupados;
$ieOcupados     = count(array_filter($importExport, function($i) { return $i['ocupado']; }));

// Retorna o JSON completo
echo json_encode([
    'sucesso'      => true,
    'dispositivo'  => $dispositivo,
    'resumo'       =>
    [
        'totalDrives'       => $totalDrives,
        'drivesOcupados'    => $drivesOcupados,
        'drivesLivres'      => $drivesLivres,
        'totalSlots'        => $totalSlots,
        'slotsOcupados'     => $slotsOcupados,
        'slotsLivres'       => $slotsLivres,
        'totalImportExport' => $totalImportExport,
        'ieOcupados'        => $ieOcupados,
    ],
    'drives'       => $drives,
    'slots'        => $slots,
    'importExport' => $importExport,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
