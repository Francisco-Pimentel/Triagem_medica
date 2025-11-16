package sistemamedico.dp;

import java.time.LocalDateTime;

public class SinaisVitais {
    private int id;
    private int pacienteId;
    private int frequenciaCardiaca;
    private int pressaoSistolica;
    private int pressaoDiastolica;
    private int frequenciaRespiratoria;
    private double temperatura;
    private int saturacaoOxigenio;
    private String nivelConsciencia;
    private LocalDateTime dataRegistro;
    private int usuarioId;
    
    public SinaisVitais(int pacienteId, int frequenciaCardiaca, int pressaoSistolica, 
                       int pressaoDiastolica, int frequenciaRespiratoria, double temperatura, 
                       int saturacaoOxigenio, String nivelConsciencia) {
        this.pacienteId = pacienteId;
        this.frequenciaCardiaca = frequenciaCardiaca;
        this.pressaoSistolica = pressaoSistolica;
        this.pressaoDiastolica = pressaoDiastolica;
        this.frequenciaRespiratoria = frequenciaRespiratoria;
        this.temperatura = temperatura;
        this.saturacaoOxigenio = saturacaoOxigenio;
        this.nivelConsciencia = nivelConsciencia;
        this.dataRegistro = LocalDateTime.now();
    }
    
    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getPacienteId() { return pacienteId; }
    public void setPacienteId(int pacienteId) { this.pacienteId = pacienteId; }
    
    public int getFrequenciaCardiaca() { return frequenciaCardiaca; }
    public void setFrequenciaCardiaca(int frequenciaCardiaca) { this.frequenciaCardiaca = frequenciaCardiaca; }
    
    public int getPressaoSistolica() { return pressaoSistolica; }
    public void setPressaoSistolica(int pressaoSistolica) { this.pressaoSistolica = pressaoSistolica; }
    
    public int getPressaoDiastolica() { return pressaoDiastolica; }
    public void setPressaoDiastolica(int pressaoDiastolica) { this.pressaoDiastolica = pressaoDiastolica; }
    
    public int getFrequenciaRespiratoria() { return frequenciaRespiratoria; }
    public void setFrequenciaRespiratoria(int frequenciaRespiratoria) { this.frequenciaRespiratoria = frequenciaRespiratoria; }
    
    public double getTemperatura() { return temperatura; }
    public void setTemperatura(double temperatura) { this.temperatura = temperatura; }
    
    public int getSaturacaoOxigenio() { return saturacaoOxigenio; }
    public void setSaturacaoOxigenio(int saturacaoOxigenio) { this.saturacaoOxigenio = saturacaoOxigenio; }
    
    public String getNivelConsciencia() { return nivelConsciencia; }
    public void setNivelConsciencia(String nivelConsciencia) { this.nivelConsciencia = nivelConsciencia; }
    
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
    
    public int getUsuarioId() { return usuarioId; }
    public void setUsuarioId(int usuarioId) { this.usuarioId = usuarioId; }
}