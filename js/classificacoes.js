// Gerenciamento da lista de classificações
class ClassificacoesManager {
    constructor() {
        this.classificacoes = [];
        this.init();
    }

    init() {
        this.carregarClassificacoes();
    }

    async carregarClassificacoes() {
        try {
            this.mostrarLoading();
            
            // Simulação de dados - substitua por API real
            const classificacoes = await this.buscarClassificacoes();
            this.classificacoes = classificacoes;
            
            this.exibirClassificacoes(classificacoes);
            
        } catch (error) {
            console.error('Erro ao carregar classificações:', error);
            this.mostrarErro('Erro ao carregar lista de classificações');
        }
    }

    async buscarClassificacoes() {
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
                        justificativa: 'Classificação automática baseada no escore NEWS'
                    },
                    {
                        id: 2,
                        pacienteId: 102,
                        escore: 2,
                        nivelRisco: 'BAIXO',
                        dataClassificacao: new Date(Date.now() - 2 * 3600000).toISOString(),
                        usuarioId: 2,
                        justificativa: 'Classificação automática baseada no escore NEWS'
                    },
                    {
                        id: 3,
                        pacienteId: 103,
                        escore: 5,
                        nivelRisco: 'ALTO',
                        dataClassificacao: new Date(Date.now() - 4 * 3600000).toISOString(),
                        usuarioId: 1,
                        justificativa: 'Classificação automática baseada no escore NEWS'
                    },
                    {
                        id: 4,
                        pacienteId: 104,
                        escore: 0,
                        nivelRisco: 'SEM_RISCO',
                        dataClassificacao: new Date(Date.now() - 6 * 3600000).toISOString(),
                        usuarioId: 3,
                        justificativa: 'Classificação automática baseada no escore NEWS'
                    },
                    {
                        id: 5,
                        pacienteId: 105,
                        escore: 3,
                        nivelRisco: 'MEDIO',
                        dataClassificacao: new Date(Date.now() - 8 * 3600000).toISOString(),
                        usuarioId: 2,
                        justificativa: 'Classificação automática baseada no escore NEWS'
                    }
                ]);
            }, 1000);
        });
    }

    exibirClassificacoes(classificacoes) {
        const container = document.getElementById('lista-classificacoes');
        
        if (classificacoes.length === 0) {
            container.innerHTML = '<div class="no-data">Nenhuma classificação encontrada</div>';
            return;
        }

        const classificacoesFiltradas = this.filtrarClassificacoes(classificacoes);
        const html = classificacoesFiltradas.map(classificacao => 
            this.criarCardClassificacao(classificacao)
        ).join('');
        
        container.innerHTML = html;
    }

    filtrarClassificacoes(classificacoes) {
        const filtroTexto = document.getElementById('search-classificacao').value.toLowerCase();
        const filtroNivel = document.getElementById('filter-nivel').value;

        return classificacoes.filter(classificacao => {
            const textoMatch = filtroTexto === '' || 
                classificacao.pacienteId.toString().includes(filtroTexto);
            
            const nivelMatch = filtroNivel === '' || 
                classificacao.nivelRisco === filtroNivel;
            
            return textoMatch && nivelMatch;
        });
    }

    criarCardClassificacao(classificacao) {
        const tempoDecorrido = this.calcularTempoDecorrido(classificacao.dataClassificacao);
        
        return `
            <div class="classificacao-item ${this.getClasseNivelRisco(classificacao.nivelRisco)}">
                <div class="classificacao-header">
                    <h3>Paciente ID: ${classificacao.pacienteId}</h3>
                    <span class="classificacao-tempo">${tempoDecorrido}</span>
                </div>
                
                <div class="classificacao-detalhes">
                    <div class="detalhe-item">
                        <span class="detalhe-label">Escore NEWS:</span>
                        <span class="detalhe-valor ${this.getClasseValor(classificacao.escore)}">
                            ${classificacao.escore}
                        </span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Nível de Risco:</span>
                        <span class="badge ${this.getClasseBadgeNivelRisco(classificacao.nivelRisco)}">
                            ${this.traduzirNivelRisco(classificacao.nivelRisco)}
                        </span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Data/Hora:</span>
                        <span class="detalhe-valor">
                            ${new Date(classificacao.dataClassificacao).toLocaleString('pt-BR')}
                        </span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Justificativa:</span>
                        <span class="detalhe-valor">${classificacao.justificativa}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getClasseNivelRisco(nivel) {
        const classes = {
            'CRITICO': 'nivel-critico',
            'ALTO': 'nivel-alto',
            'MEDIO': 'nivel-medio',
            'BAIXO': 'nivel-baixo',
            'SEM_RISCO': 'nivel-sem-risco'
        };
        return classes[nivel] || '';
    }

    getClasseBadgeNivelRisco(nivel) {
        const classes = {
            'CRITICO': 'critical',
            'ALTO': 'warning',
            'MEDIO': 'warning',
            'BAIXO': 'success',
            'SEM_RISCO': 'success'
        };
        return classes[nivel] || '';
    }

    getClasseValor(escore) {
        if (escore >= 7) return 'critico';
        if (escore >= 5) return 'alto';
        if (escore >= 3) return 'medio';
        if (escore >= 1) return 'baixo';
        return 'normal';
    }

    traduzirNivelRisco(nivel) {
        const traducoes = {
            'CRITICO': 'Crítico',
            'ALTO': 'Alto',
            'MEDIO': 'Médio',
            'BAIXO': 'Baixo',
            'SEM_RISCO': 'Sem Risco'
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

    mostrarLoading() {
        const container = document.getElementById('lista-classificacoes');
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando classificações...</p>
            </div>
        `;
    }

    mostrarErro(mensagem) {
        const container = document.getElementById('lista-classificacoes');
        container.innerHTML = `
            <div class="no-data" style="color: var(--danger);">
                <div class="icone-grande">❌</div>
                <h3>Erro ao carregar dados</h3>
                <p>${mensagem}</p>
                <button onclick="carregarClassificacoes()" class="btn-primary">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

// Funções globais
function carregarClassificacoes() {
    if (!window.classificacoesManager) {
        window.classificacoesManager = new ClassificacoesManager();
    } else {
        window.classificacoesManager.carregarClassificacoes();
    }
}

function limparFiltros() {
    document.getElementById('search-classificacao').value = '';
    document.getElementById('filter-nivel').value = '';
    carregarClassificacoes();
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    window.classificacoesManager = new ClassificacoesManager();
});