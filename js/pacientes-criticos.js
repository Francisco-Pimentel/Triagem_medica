// Gerenciamento da lista de pacientes críticos
class PacientesCriticosManager {
    constructor() {
        this.pacientes = [];
        this.filtroTexto = '';
        this.filtroNivel = '';
        this.init();
    }

    init() {
        this.carregarPacientesCriticos();
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        // Atualizar a cada 1 minuto
        setInterval(() => this.carregarPacientesCriticos(), 60000);
    }

    async carregarPacientesCriticos() {
        try {
            this.mostrarLoading();
            
            // Simulação de dados - substitua por API real
            const pacientes = await this.buscarPacientesCriticos();
            this.pacientes = pacientes;
            
            this.exibirPacientes(pacientes);
            this.atualizarContador(pacientes.length);
            
        } catch (error) {
            console.error('Erro ao carregar pacientes críticos:', error);
            this.mostrarErro('Erro ao carregar lista de pacientes críticos');
        }
    }

    async buscarPacientesCriticos() {
        // Simular chamada API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        pacienteId: 101,
                        escore: 8,
                        nivelRisco: 'CRITICO',
                        dataClassificacao: new Date().toISOString(),
                        usuarioId: 1,
                        justificativa: 'Classificação automática baseada no escore NEWS',
                        sinaisVitais: {
                            frequenciaCardiaca: 130,
                            pressaoSistolica: 85,
                            pressaoDiastolica: 50,
                            frequenciaRespiratoria: 28,
                            temperatura: 38.5,
                            saturacaoOxigenio: 88,
                            nivelConsciencia: 'Confused'
                        }
                    },
                    {
                        id: 2,
                        pacienteId: 102,
                        escore: 7,
                        nivelRisco: 'CRITICO',
                        dataClassificacao: new Date(Date.now() - 30 * 60000).toISOString(),
                        usuarioId: 2,
                        justificativa: 'Classificação automática baseada no escore NEWS',
                        sinaisVitais: {
                            frequenciaCardiaca: 45,
                            pressaoSistolica: 95,
                            pressaoDiastolica: 60,
                            frequenciaRespiratoria: 7,
                            temperatura: 35.2,
                            saturacaoOxigenio: 92,
                            nivelConsciencia: 'Drowsy'
                        }
                    },
                    {
                        id: 3,
                        pacienteId: 103,
                        escore: 9,
                        nivelRisco: 'CRITICO',
                        dataClassificacao: new Date(Date.now() - 60 * 60000).toISOString(),
                        usuarioId: 1,
                        justificativa: 'Classificação automática baseada no escore NEWS',
                        sinaisVitais: {
                            frequenciaCardiaca: 140,
                            pressaoSistolica: 80,
                            pressaoDiastolica: 45,
                            frequenciaRespiratoria: 32,
                            temperatura: 39.8,
                            saturacaoOxigenio: 85,
                            nivelConsciencia: 'Unresponsive'
                        }
                    }
                ]);
            }, 1000);
        });
    }

    exibirPacientes(pacientes) {
        const container = document.getElementById('lista-pacientes-criticos');
        
        if (pacientes.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <div class="icone-grande">✅</div>
                    <h3>Nenhum paciente crítico encontrado</h3>
                    <p>Todos os pacientes estão estáveis no momento.</p>
                </div>
            `;
            return;
        }

        const pacientesFiltrados = this.filtrarPacientes(pacientes);
        const html = pacientesFiltrados.map(paciente => this.criarCardPaciente(paciente)).join('');
        
        container.innerHTML = html;
    }

    filtrarPacientes(pacientes) {
        return pacientes.filter(paciente => {
            const textoMatch = this.filtroTexto === '' || 
                paciente.pacienteId.toString().includes(this.filtroTexto);
            
            const nivelMatch = this.filtroNivel === '' || 
                paciente.nivelRisco === this.filtroNivel;
            
            return textoMatch && nivelMatch;
        });
    }

    criarCardPaciente(paciente) {
        const tempoDecorrido = this.calcularTempoDecorrido(paciente.dataClassificacao);
        const sinais = paciente.sinaisVitais;
        
        return `
            <div class="paciente-item ${this.getClasseNivelRisco(paciente.nivelRisco)}">
                <div class="paciente-header">
                    <h3>🚨 Paciente ID: ${paciente.pacienteId}</h3>
                    <span class="paciente-tempo">${tempoDecorrido}</span>
                </div>
                
                <div class="paciente-info">
                    <div class="info-principal">
                        <div class="info-item">
                            <span class="info-label">Escore NEWS:</span>
                            <span class="info-valor critico">${paciente.escore}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Nível de Risco:</span>
                            <span class="badge critical">${paciente.nivelRisco}</span>
                        </div>
                    </div>
                    
                    <div class="sinais-vitais">
                        <h4>📊 Sinais Vitais:</h4>
                        <div class="sinais-grid">
                            <div class="sinal-item">
                                <span class="sinal-label">FC:</span>
                                <span class="sinal-valor ${this.getClassSinal('fc', sinais.frequenciaCardiaca)}">
                                    ${sinais.frequenciaCardiaca} bpm
                                </span>
                            </div>
                            <div class="sinal-item">
                                <span class="sinal-label">PA:</span>
                                <span class="sinal-valor ${this.getClassSinal('pas', sinais.pressaoSistolica)}">
                                    ${sinais.pressaoSistolica}/${sinais.pressaoDiastolica} mmHg
                                </span>
                            </div>
                            <div class="sinal-item">
                                <span class="sinal-label">FR:</span>
                                <span class="sinal-valor ${this.getClassSinal('fr', sinais.frequenciaRespiratoria)}">
                                    ${sinais.frequenciaRespiratoria} rpm
                                </span>
                            </div>
                            <div class="sinal-item">
                                <span class="sinal-label">Temp:</span>
                                <span class="sinal-valor ${this.getClassSinal('temp', sinais.temperatura)}">
                                    ${sinais.temperatura}°C
                                </span>
                            </div>
                            <div class="sinal-item">
                                <span class="sinal-label">SpO₂:</span>
                                <span class="sinal-valor ${this.getClassSinal('spo2', sinais.saturacaoOxigenio)}">
                                    ${sinais.saturacaoOxigenio}%
                                </span>
                            </div>
                            <div class="sinal-item">
                                <span class="sinal-label">Consciência:</span>
                                <span class="sinal-valor ${sinais.nivelConsciencia !== 'Alert' ? 'critico' : 'normal'}">
                                    ${this.traduzirConsciencia(sinais.nivelConsciencia)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="paciente-actions">
                        <button onclick="visualizarPaciente(${paciente.pacienteId})" class="btn-primary">
                            👁️ Visualizar Detalhes
                        </button>
                        <button onclick="registrarEvolucao(${paciente.pacienteId})" class="btn-warning">
                            📝 Registrar Evolução
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getClasseNivelRisco(nivel) {
        const classes = {
            'CRITICO': 'critico',
            'ALTO': 'alto',
            'MEDIO': 'medio',
            'BAIXO': 'baixo',
            'SEM_RISCO': 'sem-risco'
        };
        return classes[nivel] || '';
    }

    getClassSinal(tipo, valor) {
        // Lógica simplificada para colorir sinais anormais
        switch(tipo) {
            case 'fc':
                return (valor < 50 || valor > 120) ? 'anormal' : 'normal';
            case 'pas':
                return (valor < 90 || valor > 180) ? 'anormal' : 'normal';
            case 'fr':
                return (valor < 10 || valor > 24) ? 'anormal' : 'normal';
            case 'temp':
                return (valor < 36 || valor > 38) ? 'anormal' : 'normal';
            case 'spo2':
                return valor < 94 ? 'anormal' : 'normal';
            default:
                return 'normal';
        }
    }

    traduzirConsciencia(nivel) {
        const traducoes = {
            'Alert': 'Alerta',
            'Confused': 'Confuso',
            'Drowsy': 'Sonolento',
            'Unresponsive': 'Não Responsivo'
        };
        return traducoes[nivel] || nivel;
    }

    calcularTempoDecorrido(timestamp) {
        const agora = new Date();
        const data = new Date(timestamp);
        const diffMs = agora - data;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `Há ${diffMins} min`;
        if (diffMins < 1440) return `Há ${Math.floor(diffMins / 60)} h`;
        
        return `Há ${Math.floor(diffMins / 1440)} dias`;
    }

    atualizarContador(total) {
        document.getElementById('total-criticos').textContent = total;
    }

    mostrarLoading() {
        const container = document.getElementById('lista-pacientes-criticos');
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando pacientes críticos...</p>
            </div>
        `;
    }

    mostrarErro(mensagem) {
        const container = document.getElementById('lista-pacientes-criticos');
        container.innerHTML = `
            <div class="no-data" style="color: var(--danger);">
                <div class="icone-grande">❌</div>
                <h3>Erro ao carregar dados</h3>
                <p>${mensagem}</p>
                <button onclick="carregarPacientesCriticos()" class="btn-primary">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

// Funções globais para os botões
function carregarPacientesCriticos() {
    if (!window.pacientesManager) {
        window.pacientesManager = new PacientesCriticosManager();
    } else {
        window.pacientesManager.carregarPacientesCriticos();
    }
}

function filtrarPacientes() {
    if (window.pacientesManager) {
        window.pacientesManager.filtroTexto = document.getElementById('search-paciente').value;
        window.pacientesManager.filtroNivel = document.getElementById('filter-prioridade').value;
        window.pacientesManager.exibirPacientes(window.pacientesManager.pacientes);
    }
}

function exportarRelatorio() {
    // Simular exportação
    alert('Relatório exportado com sucesso!');
    console.log('Exportando relatório de pacientes críticos...');
}

function visualizarPaciente(pacienteId) {
    alert(`Visualizando detalhes do paciente ${pacienteId}`);
    // Implementar navegação para detalhes do paciente
}

function registrarEvolucao(pacienteId) {
    alert(`Registrando evolução do paciente ${pacienteId}`);
    // Implementar formulário de evolução
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    window.pacientesManager = new PacientesCriticosManager();
});