#!/bin/bash

# Projeto: Simulador de Autoloader
# Objetivo: Monitorar o status de slots e drives permitindo a troca do dispositivo e filtros por parâmetros.

# Definição de cores
AMARELO='\033[1;33m'
VERDE='\033[0;32m'
RESET='\033[0m'

# Valores padrão
DEVICE="/dev/sg6"
OPCAO="-all"

# Processa os argumentos passados
while [[ $# -gt 0 ]]; do
    case $1 in
        -f)
            DEVICE="$2"
            shift 2
            ;;
        -s|-d|-all)
            OPCAO="$1"
            shift
            ;;
        *)
            echo "Opção inválida: $1"
            echo "Uso: $0 [-f /dev/device] [-s | -d | -all]"
            exit 1
            ;;
    esac
done

while true
do
    clear
    echo "========================================================="
    echo "         STATUS DO AUTOLOADER ($DEVICE)"
    echo "========================================================="
    echo ""

    case $OPCAO in
        "-s")
            echo -e "${VERDE}--- SLOTS (Armazenamento) ---${RESET}"
            echo ""
            mtx -f "$DEVICE" status | grep "Storage Element" | grep -v "IMPORT/EXPORT" | grep -v "Data Transfer"
            ;;
        "-d")
            echo -e "${AMARELO}--- DRIVES (Gravadoras) ---${RESET}"
            echo ""
            mtx -f "$DEVICE" status | grep "Data Transfer Element"
            ;;
        "-all")
            echo -e "${AMARELO}--- DRIVES (Gravadoras) ---${RESET}"
            echo ""
            mtx -f "$DEVICE" status | grep "Data Transfer Element"
            echo ""
            echo -e "${VERDE}--- SLOTS (Armazenamento) ---${RESET}"
            echo ""
            mtx -f "$DEVICE" status | grep "Storage Element" | grep -v "IMPORT/EXPORT" | grep -v "Data Transfer Element"
            ;;
    esac

    echo ""
    echo "Última atualizaçao: $(date '+%H:%M:%S')..."
    sleep 3
done