-- Banco de dados do Sistema de Triagem Médica

CREATE DATABASE IF NOT EXISTS sistema_medico;
USE sistema_medico;

-- Tabela de Pacientes
CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo ENUM('M', 'F', 'OUTRO') NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Sinais Vitais
CREATE TABLE sinais_vitais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    frequencia_cardiaca INT NOT NULL,
    pressao_sistolica INT NOT NULL,
    pressao_diastolica INT NOT NULL,
    frequencia_respiratoria INT NOT NULL,
    temperatura DECIMAL(3,1) NOT NULL,
    saturacao_oxigenio INT NOT NULL,
    nivel_consciencia VARCHAR(50) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- Tabela de Classificação de Risco
CREATE TABLE classificacao_risco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    escore INT NOT NULL,
    nivel_risco ENUM('SEM_RISCO', 'BAIXO', 'MEDIO', 'ALTO', 'CRITICO') NOT NULL,
    data_classificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    justificativa TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- Tabela de Usuários do Sistema
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('MEDICO', 'ENFERMEIRO', 'ADMIN') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_classificacao_risco_nivel ON classificacao_risco(nivel_risco);
CREATE INDEX idx_classificacao_risco_data ON classificacao_risco(data_classificacao);
CREATE INDEX idx_sinais_vitais_paciente ON sinais_vitais(paciente_id);
CREATE INDEX idx_sinais_vitais_data ON sinais_vitais(data_registro);