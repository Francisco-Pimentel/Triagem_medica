// Gerenciamento do formulário de triagem
class TriagemForm {
    constructor() {
        this.form = document.getElementById('form-triagem');
        this.resultadoContainer = document.getElementById('resultado-triagem');
        this.dadosResultado = document.getElementById('dados-resultado');
        this.init();
    }

    init() {
        this.configurarEventListeners();
        this.configurarValidacoes();
    }

    configurarEventListeners() {
        this.form.addEventListener('submit', (e) => this.processarTriagem(e));
        
        // Validação em tempo real
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validarCampo(input));
            input.addEventListener('input', () => this.limparErro(input));
        });
    }

    configurarValidacoes() {
        // Configurar validações específicas
        const fcInput = document.getElementById('frequencia-cardiaca');
        fcInput.addEventListener('input', () => this.validarFrequenciaCardiaca(fcInput));

        const spo2Input = document.getElementById('saturacao-oxigenio');
        spo2Input.addEventListener('input', () => this.validarSaturacaoOxigenio(spo2Input));
    }

    async processarTriagem(event) {
        event.preventDefault();
        
        if (!this.validarFormulario()) {
            this.mostrarErro('Por favor, corrija os erros no formulário antes de enviar.');
            return;
        }

        const dados = this.obterDadosFormulario();
        const resultado = this.calcularEscoreNEWS(dados);
        
        this.exibirResultado(dados, resultado);
        this.rolarParaResultado();
        
        // Simular envio para backend
        await this.enviarParaBackend(dados, resultado);
    }

    obterDadosFormulario() {
        return {
            pacienteId: parseInt(document.getElementById('paciente-id').value),
            frequenciaCardiaca: parseInt(document.getElementById('frequencia-cardiaca').value),
            pressaoSistolica: parseInt(document.getElementById('pressao-sistolica').value),
            pressaoDiastolica: parseInt(document.getElementById('pressao-diastolica').value),
            frequenciaRespiratoria: parseInt(document.getElementById('frequencia-respiratoria').value),
            temperatura: parseFloat(document.getElementById('temperatura').value),
            saturacaoOxigenio: parseInt(document.getElementById('saturacao-oxigenio').value),
            nivelConsciencia: document.getElementById('nivel-consciencia').value,
            usuarioId: parseInt(document.getElementById('usuario-id').value)
        };
    }

    calcularEscoreNEWS(dados) {
        let escore = 0;
        const calculos = [];

        // Frequência respiratória
        if (dados.frequenciaRespiratoria <= 8) {
            escore += 3;
            calculos.push('FR ≤ 8: +3 pontos');
        } else if (dados.frequenciaRespiratoria <= 11) {
            escore += 1;
            calculos.push('FR 9-11: +1 ponto');
        } else if (dados.frequenciaRespiratoria >= 21 && dados.frequenciaRespiratoria <= 24) {
            escore += 2;
            calculos.push('FR 21-24: +2 pontos');
        } else if (dados.frequenciaRespiratoria >= 25) {
            escore += 3;
            calculos.push('FR ≥ 25: +3 pontos');
        } else {
            calculos.push('FR 12-20: 0 pontos');
        }

        // Saturação de oxigênio
        if (dados.saturacaoOxigenio <= 91) {
            escore += 3;
            calculos.push('SpO₂ ≤ 91%: +3 pontos');
        } else if (dados.saturacaoOxigenio <= 93) {
            escore += 2;
            calculos.push('SpO₂ 92-93%: +2 pontos');
        } else if (dados.saturacaoOxigenio <= 95) {
            escore += 1;
            calculos.push('SpO₂ 94-95%: +1 ponto');
        } else {
            calculos.push('SpO₂ ≥ 96%: 0 pontos');
        }

        // Temperatura
        if (dados.temperatura <= 35.0) {
            escore += 3;
            calculos.push('Temp ≤ 35°C: +3 pontos');
        } else if (dados.temperatura <= 36.0) {
            escore += 1;
            calculos.push('Temp 35.1-36°C: +1 ponto');
        } else if (dados.temperatura >= 38.1 && dados.temperatura <= 39.0) {
            escore += 1;
            calculos.push('Temp 38.1-39°C: +1 ponto');
        } else if (dados.temperatura >= 39.1) {
            escore += 2;
            calculos.push('Temp ≥ 39.1°C: +2 pontos');
        } else {
            calculos.push('Temp 36.1-38°C: 0 pontos');
        }

        // Pressão arterial sistólica
        if (dados.pressaoSistolica <= 90) {
            escore += 3;
            calculos.push('PAS ≤ 90: +3 pontos');
        } else if (dados.pressaoSistolica <= 100) {
            escore += 2;
            calculos.push('PAS 91-100: +2 pontos');
        } else if (dados.pressaoSistolica <= 110) {
            escore += 1;
            calculos.push('PAS 101-110: +1 ponto');
        } else if (dados.pressaoSistolica >= 220) {
            escore += 3;
            calculos.push('PAS ≥ 220: +3 pontos');
        } else {
            calculos.push('PAS 111-219: 0 pontos');
        }

        // Frequência cardíaca
        if (dados.frequenciaCardiaca <= 40) {
            escore += 3;
            calculos.push('FC ≤ 40: +3 pontos');
        } else if (dados.frequenciaCardiaca <= 50) {
            escore += 1;
            calculos.push('FC 41-50: +1 ponto');
        } else if (dados.frequenciaCardiaca >= 91 && dados.frequenciaCardiaca <= 110) {
            escore += 1;
            calculos.push('FC 91-110: +1 ponto');
        } else if (dados.frequenciaCardiaca >= 111 && dados.frequenciaCardiaca <= 130) {
            escore += 2;
            calculos.push('FC 111-130: +2 pontos');
        } else if (dados.frequenciaCardiaca >= 131) {
            escore += 3;
            calculos.push('FC ≥ 131: +3 pontos');
        } else {
            calculos.push('FC 51-90: 0 pontos');
        }

        // Nível de consciência
        if (dados.nivelConsciencia !== 'Alert') {
            escore += 3;
            calculos.push('Consciência alterada: +3 pontos');
        } else {
            calculos.push('Consciência normal: 0 pontos');
        }

        const nivelRisco = this.determinarNivelRisco(escore);

        return {
            escore,
            nivelRisco,
            calculos,
            timestamp: new Date().toISOString()
        };
    }

    determinarNivelRisco(escore) {
        if (escore >= 7) return { nivel: 'CRITICO', cor: 'danger', icone: '🚨' };
        else if (escore >= 5) return { nivel: 'ALTO', cor: 'warning', icone: '⚠️' };
        else if (escore >= 3) return { nivel: 'MEDIO', cor: 'warning', icone: '📋' };
        else if (escore >= 1) return { nivel: 'BAIXO', cor: 'success', icone: '✅' };
        else return { nivel: 'SEM_RISCO', cor: 'success', icone: '👍' };
    }

    exibirResultado(dados, resultado) {
        const risco = resultado.nivelRisco;
        
        const html = `
            <div class="resultado-alerta ${risco.cor}">
                <div class="resultado-header">
                    <span class="resultado-icone">${risco.icone}</span>
                    <h4>Classificação: ${risco.nivel}</h4>
                </div>
                
                <div class="resultado-detalhes">
                    <div class="detalhe-item">
                        <span class="detalhe-label">Escore NEWS:</span>
                        <span class="detalhe-valor escore-${risco.cor}">${resultado.escore}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Nível de Risco:</span>
                        <span class="badge ${risco.cor}">${risco.nivel}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Paciente ID:</span>
                        <span class="detalhe-valor">${dados.pacienteId}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Data/Hora:</span>
                        <span class="detalhe-valor">${new Date().toLocaleString('pt-BR')}</span>
                    </div>
                </div>

                ${resultado.escore > 0 ? `
                <div class="calculos-detailed">
                    <h5>📊 Detalhamento do Escore:</h5>
                    <ul>
                        ${resultado.calculos.map(calc => `<li>${calc}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${risco.nivel === 'CRITICO' ? `
                <div class="alerta-critico">
                    <strong>🚨 ATENÇÃO: PACIENTE EM ESTADO CRÍTICO!</strong>
                    <p>Encaminhar imediatamente para atendimento prioritário.</p>
                </div>
                ` : ''}
            </div>
        `;

        this.dadosResultado.innerHTML = html;
        this.resultadoContainer.style.display = 'block';
    }

    rolarParaResultado() {
        this.resultadoContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    async enviarParaBackend(dados, resultado) {
        try {
            // Simular envio para API
            console.log('Enviando dados para backend:', { dados, resultado });
            
            // Aqui você faria a chamada real para sua API
            // const response = await fetch('/api/triagem', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ dados, resultado })
            // });
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
            
            this.mostrarSucesso('Triagem registrada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao enviar para backend:', error);
            this.mostrarErro('Erro ao registrar triagem. Tente novamente.');
        }
    }

    validarFormulario() {
        let valido = true;
        const campos = this.form.querySelectorAll('input[required], select[required]');
        
        campos.forEach(campo => {
            if (!this.validarCampo(campo)) {
                valido = false;
            }
        });

        return valido;
    }

    validarCampo(campo) {
        const valor = campo.value.trim();
        
        if (!valor) {
            this.mostrarErroCampo(campo, 'Este campo é obrigatório');
            return false;
        }

        // Validações específicas
        switch(campo.id) {
            case 'frequencia-cardiaca':
                return this.validarFrequenciaCardiaca(campo);
            case 'saturacao-oxigenio':
                return this.validarSaturacaoOxigenio(campo);
            case 'temperatura':
                return this.validarTemperatura(campo);
        }

        this.limparErro(campo);
        return true;
    }

    validarFrequenciaCardiaca(campo) {
        const valor = parseInt(campo.value);
        if (valor < 20 || valor > 250) {
            this.mostrarErroCampo(campo, 'Frequência cardíaca deve estar entre 20 e 250 bpm');
            return false;
        }
        this.limparErro(campo);
        return true;
    }

    validarSaturacaoOxigenio(campo) {
        const valor = parseInt(campo.value);
        if (valor < 50 || valor > 100) {
            this.mostrarErroCampo(campo, 'Sat. Oxigênio deve estar entre 50% e 100%');
            return false;
        }
        this.limparErro(campo);
        return true;
    }

    validarTemperatura(campo) {
        const valor = parseFloat(campo.value);
        if (valor < 30 || valor > 45) {
            this.mostrarErroCampo(campo, 'Temperatura deve estar entre 30°C e 45°C');
            return false;
        }
        this.limparErro(campo);
        return true;
    }

    mostrarErroCampo(campo, mensagem) {
        this.limparErro(campo);
        campo.style.borderColor = 'var(--danger)';
        
        const erroElement = document.createElement('div');
        erroElement.className = 'erro-campo';
        erroElement.style.color = 'var(--danger)';
        erroElement.style.fontSize = '0.8em';
        erroElement.style.marginTop = '5px';
        erroElement.textContent = mensagem;
        
        campo.parentNode.appendChild(erroElement);
    }

    limparErro(campo) {
        campo.style.borderColor = '';
        const erroExistente = campo.parentNode.querySelector('.erro-campo');
        if (erroExistente) {
            erroExistente.remove();
        }
    }

    mostrarSucesso(mensagem) {
        this.mostrarNotificacao(mensagem, 'success');
    }

    mostrarErro(mensagem) {
        this.mostrarNotificacao(mensagem, 'error');
    }

    mostrarNotificacao(mensagem, tipo) {
        // Implementação básica de notificação
        alert(`[${tipo.toUpperCase()}] ${mensagem}`);
    }
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    new TriagemForm();
});