package sistemamedico.dp;

import java.time.LocalDateTime;

public class ClassificacaoRisco {
    public enum NivelRisco {
        SEM_RISCO, BAIXO, MEDIO, ALTO, CRITICO
    }
    
    private int id;
    private int pacienteId;
    private int escore;
    private NivelRisco nivelRisco;
    private LocalDateTime dataClassificacao;
    private int usuarioId;
    private String justificativa;
    
    public ClassificacaoRisco(int pacienteId, int escore, NivelRisco nivelRisco) {
        this.pacienteId = pacienteId;
        this.escore = escore;
        this.nivelRisco = nivelRisco;
        this.dataClassificacao = LocalDateTime.now();
    }
    
    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getPacienteId() { return pacienteId; }
    public void setPacienteId(int pacienteId) { this.pacienteId = pacienteId; }
    
    public int getEscore() { return escore; }
    public void setEscore(int escore) { this.escore = escore; }
    
    public NivelRisco getNivelRisco() { return nivelRisco; }
    public void setNivelRisco(NivelRisco nivelRisco) { this.nivelRisco = nivelRisco; }
    
    public LocalDateTime getDataClassificacao() { return dataClassificacao; }
    public void setDataClassificacao(LocalDateTime dataClassificacao) { this.dataClassificacao = dataClassificacao; }
    
    public int getUsuarioId() { return usuarioId; }
    public void setUsuarioId(int usuarioId) { this.usuarioId = usuarioId; }
    
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
}