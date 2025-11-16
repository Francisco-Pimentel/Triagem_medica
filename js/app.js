// App principal - Dashboard
class SistemaTriagemApp {
    constructor() {
        this.init();
    }

    init() {
        this.carregarEstatisticas();
        this.carregarAtividadesRecentes();
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        // Atualizar dados a cada 30 segundos
        setInterval(() => {
            this.carregarEstatisticas();
            this.carregarAtividadesRecentes();
        }, 30000);
    }

    async carregarEstatisticas() {
        try {
            // Simulação de dados - substitua por API real
            const estatisticas = {
                totalPacientes: 24,
                pacientesCriticos: 3,
                triagensHoje: 8
            };

            this.atualizarUIEstatisticas(estatisticas);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            this.mostrarErro('Erro ao carregar estatísticas do sistema');
        }
    }

    atualizarUIEstatisticas(estatisticas) {
        document.getElementById('total-pacientes').textContent = estatisticas.totalPacientes;
        document.getElementById('pacientes-criticos').textContent = estatisticas.pacientesCriticos;
        document.getElementById('triagens-hoje').textContent = estatisticas.triagensHoje;
    }

    async carregarAtividadesRecentes() {
        try {
            // Simulação de dados - substitua por API real
            const atividades = [
                {
                    tipo: 'triagem',
                    pacienteId: 101,
                    escore: 7,
                    nivelRisco: 'CRITICO',
                    timestamp: new Date().toISOString(),
                    usuario: 'Dr. Silva'
                },
                {
                    tipo: 'triagem',
                    pacienteId: 102,
                    escore: 2,
                    nivelRisco: 'BAIXO',
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                    usuario: 'Enf. Costa'
                },
                {
                    tipo: 'triagem',
                    pacienteId: 103,
                    escore: 5,
                    nivelRisco: 'ALTO',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    usuario: 'Dr. Santos'
                },
                {
                    tipo: 'triagem',
                    pacienteId: 104,
                    escore: 1,
                    nivelRisco: 'SEM_RISCO',
                    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                    usuario: 'Enf. Oliveira'
                }
            ];

            this.exibirAtividades(atividades);
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            this.mostrarErro('Erro ao carregar atividades recentes');
        }
    }

    exibirAtividades(atividades) {
        const container = document.getElementById('atividades-recentes');
        
        if (atividades.length === 0) {
            container.innerHTML = '<div class="no-data">Nenhuma atividade recente</div>';
            return;
        }

        const html = atividades.map(atividade => `
            <div class="activity-item ${this.getClasseNivelRisco(atividade.nivelRisco)}">
                <div class="activity-header">
                    <strong>Paciente ID: ${atividade.pacienteId}</strong>
                    <span class="activity-time">${this.formatarTempo(atividade.timestamp)}</span>
                </div>
                <div class="activity-details">
                    <span class="badge ${this.getClasseBadgeNivelRisco(atividade.nivelRisco)}">
                        ${atividade.nivelRisco}
                    </span>
                    <span>Escore: ${atividade.escore}</span>
                    <span>Por: ${atividade.usuario}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
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

    formatarTempo(timestamp) {
        const agora = new Date();
        const data = new Date(timestamp);
        const diffMs = agora - data;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `Há ${diffMins} min`;
        if (diffMins < 1440) return `Há ${Math.floor(diffMins / 60)} h`;
        
        return data.toLocaleDateString('pt-BR');
    }

    mostrarErro(mensagem) {
        // Implementação básica de exibição de erro
        console.error(mensagem);
        const container = document.getElementById('atividades-recentes');
        container.innerHTML = `<div class="no-data" style="color: var(--danger);">${mensagem}</div>`;
    }
}

// Inicializar app quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new SistemaTriagemApp();
});