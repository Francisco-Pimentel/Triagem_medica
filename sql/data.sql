-- Dados iniciais para teste

-- Inserir usuários
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Dr. João Silva', 'joao.silva@hospital.com', 'senha123', 'MEDICO'),
('Enf. Maria Santos', 'maria.santos@hospital.com', 'senha123', 'ENFERMEIRO'),
('Dr. Pedro Costa', 'pedro.costa@hospital.com', 'senha123', 'MEDICO');

-- Inserir pacientes de exemplo
INSERT INTO pacientes (nome, cpf, data_nascimento, sexo, telefone, endereco) VALUES 
('Carlos Oliveira', '123.456.789-00', '1980-05-15', 'M', '(11) 9999-8888', 'Rua A, 123 - São Paulo/SP'),
('Ana Pereira', '987.654.321-00', '1975-12-20', 'F', '(11) 7777-6666', 'Av. B, 456 - São Paulo/SP'),
('Roberto Alves', '111.222.333-44', '1990-08-10', 'M', '(11) 5555-4444', 'Rua C, 789 - São Paulo/SP');