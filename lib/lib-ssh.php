<?php

// Carrega as configurações de conexão SSH
require_once __DIR__ . '/../config/ssh.php';

// Executa um comando remoto na VM via SSH e retorna a saída
function executarSsh($comando)
{
    // Monta o comando SSH com chave privada e sem interatividade
    $ssh    = 'ssh -i ' . SSH_KEY . ' -o StrictHostKeyChecking=no ' . SSH_USER . '@' . SSH_HOST;
    $cmdFmt = $ssh . ' ' . escapeshellarg($comando);

    // Executa e retorna a saída
    return shell_exec($cmdFmt);
}
