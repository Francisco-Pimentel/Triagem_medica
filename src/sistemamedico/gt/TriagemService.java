package sistemamedico.gt;

import sistemamedico.dp.ClassificacaoRisco;
import sistemamedico.dp.SinaisVitais;
import sistemamedico.gd.SinaisVitaisDAO;
import sistemamedico.gd.ClassificacaoRiscoDAO;
import java.sql.SQLException;
import java.util.List;

public class TriagemService {
    private SinaisVitaisDAO sinaisVitaisDAO;
    private ClassificacaoRiscoDAO classificacaoRiscoDAO;
    
    public TriagemService() { 
        this.sinaisVitaisDAO = new SinaisVitaisDAO(); 
        this.classificacaoRiscoDAO = new ClassificacaoRiscoDAO();
    }
    
    public boolean registrarSinaisVitais(SinaisVitais sinaisVitais) {
        try { 
            boolean sucesso = sinaisVitaisDAO.inserir(sinaisVitais);
            if (sucesso) { 
                classificarRisco(sinaisVitais); 
            }
            return sucesso;
        } catch (SQLException e) { 
            System.err.println("❌ Erro ao registrar sinais vitais: " + e.getMessage()); 
            return false; 
        }
    }
    
    public ClassificacaoRisco obterUltimaClassificacao(int pacienteId) {
        try {
            return classificacaoRiscoDAO.buscarUltimaClassificacao(pacienteId);
        } catch (SQLException e) {
            System.err.println("❌ Erro ao obter classificação: " + e.getMessage());
            return null;
        }
    }
    
    public List<ClassificacaoRisco> listarClassificacoesAtivas() {
        try {
            return classificacaoRiscoDAO.listarClassificacoesAtivas();
        } catch (SQLException e) {
            System.err.println("❌ Erro ao listar classificações: " + e.getMessage());
            return null;
        }
    }
    
    public void listarPacientesCriticos() {
        try {
            List<ClassificacaoRisco> classificacoes = classificacaoRiscoDAO.buscarClassificacoesCriticas();
            
            if (classificacoes.isEmpty()) {
                System.out.println("✅ Nenhum paciente crítico encontrado.");
            } else {
                System.out.println("\n🚨 === PACIENTES CRÍTICOS ===");
                for (ClassificacaoRisco classificacao : classificacoes) {
                    System.out.println("📋 Paciente ID: " + classificacao.getPacienteId() + 
                                     " | Nível Risco: " + classificacao.getNivelRisco() +
                                     " | Escore: " + classificacao.getEscore());
                }
                System.out.println("Total: " + classificacoes.size() + " paciente(s) crítico(s)\n");
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao buscar pacientes críticos: " + e.getMessage());
        }
    }
    
    private void classificarRisco(SinaisVitais sinaisVitais) throws SQLException {
        int escore = calcularEscoreNEWS(sinaisVitais);
        ClassificacaoRisco.NivelRisco nivel = determinarNivelRisco(escore);
        
        ClassificacaoRisco classificacao = new ClassificacaoRisco(
            sinaisVitais.getPacienteId(), escore, nivel);
        classificacao.setUsuarioId(sinaisVitais.getUsuarioId());
        classificacao.setJustificativa("Classificação automática baseada no escore NEWS");
        
        classificacaoRiscoDAO.inserir(classificacao);
        
        if (nivel == ClassificacaoRisco.NivelRisco.CRITICO) {
            System.out.println("🚨 ALERTA CRÍTICO: Paciente em risco crítico! Escore NEWS: " + escore);
        }
    }
    
    private int calcularEscoreNEWS(SinaisVitais sinais) {
        int escore = 0;
        
        // Frequência respiratória
        if (sinais.getFrequenciaRespiratoria() <= 8) escore += 3;
        else if (sinais.getFrequenciaRespiratoria() <= 11) escore += 1;
        else if (sinais.getFrequenciaRespiratoria() >= 21 && sinais.getFrequenciaRespiratoria() <= 24) escore += 2;
        else if (sinais.getFrequenciaRespiratoria() >= 25) escore += 3;
        
        // Saturação de oxigênio
        if (sinais.getSaturacaoOxigenio() <= 91) escore += 3;
        else if (sinais.getSaturacaoOxigenio() <= 93) escore += 2;
        else if (sinais.getSaturacaoOxigenio() <= 95) escore += 1;
        
        // Temperatura
        if (sinais.getTemperatura() <= 35.0) escore += 3;
        else if (sinais.getTemperatura() <= 36.0) escore += 1;
        else if (sinais.getTemperatura() >= 38.1 && sinais.getTemperatura() <= 39.0) escore += 1;
        else if (sinais.getTemperatura() >= 39.1) escore += 2;
        
        // Pressão arterial sistólica
        if (sinais.getPressaoSistolica() <= 90) escore += 3;
        else if (sinais.getPressaoSistolica() <= 100) escore += 2;
        else if (sinais.getPressaoSistolica() <= 110) escore += 1;
        else if (sinais.getPressaoSistolica() >= 220) escore += 3;
        
        // Frequência cardíaca
        if (sinais.getFrequenciaCardiaca() <= 40) escore += 3;
        else if (sinais.getFrequenciaCardiaca() <= 50) escore += 1;
        else if (sinais.getFrequenciaCardiaca() >= 91 && sinais.getFrequenciaCardiaca() <= 110) escore += 1;
        else if (sinais.getFrequenciaCardiaca() >= 111 && sinais.getFrequenciaCardiaca() <= 130) escore += 2;
        else if (sinais.getFrequenciaCardiaca() >= 131) escore += 3;
        
        // Nível de consciência
        if (!"Alert".equalsIgnoreCase(sinais.getNivelConsciencia())) {
            escore += 3;
        }
        
        return escore;
    }
    
    private ClassificacaoRisco.NivelRisco determinarNivelRisco(int escore) {
        if (escore >= 7) return ClassificacaoRisco.NivelRisco.CRITICO;
        else if (escore >= 5) return ClassificacaoRisco.NivelRisco.ALTO;
        else if (escore >= 3) return ClassificacaoRisco.NivelRisco.MEDIO;
        else if (escore >= 1) return ClassificacaoRisco.NivelRisco.BAIXO;
        else return ClassificacaoRisco.NivelRisco.SEM_RISCO;
    }
}