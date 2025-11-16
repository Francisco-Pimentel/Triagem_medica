package sistemamedico.gd;

import sistemamedico.dp.SinaisVitais;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SinaisVitaisDAO {
    private Connection connection;
    
    public SinaisVitaisDAO() {
        this.connection = DatabaseConfig.getConnection();
    }
    
    public boolean inserir(SinaisVitais sinaisVitais) throws SQLException {
        String sql = "INSERT INTO sinais_vitais (paciente_id, frequencia_cardiaca, pressao_sistolica, pressao_diastolica, frequencia_respiratoria, temperatura, saturacao_oxigenio, nivel_consciencia, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, sinaisVitais.getPacienteId());
            stmt.setInt(2, sinaisVitais.getFrequenciaCardiaca());
            stmt.setInt(3, sinaisVitais.getPressaoSistolica());
            stmt.setInt(4, sinaisVitais.getPressaoDiastolica());
            stmt.setInt(5, sinaisVitais.getFrequenciaRespiratoria());
            stmt.setDouble(6, sinaisVitais.getTemperatura());
            stmt.setInt(7, sinaisVitais.getSaturacaoOxigenio());
            stmt.setString(8, sinaisVitais.getNivelConsciencia());
            stmt.setInt(9, sinaisVitais.getUsuarioId());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        sinaisVitais.setId(generatedKeys.getInt(1));
                    }
                }
            }
            
            return affectedRows > 0;
        }
    }
    
    public List<SinaisVitais> buscarHistorico(int pacienteId) throws SQLException {
        List<SinaisVitais> historico = new ArrayList<>();
        String sql = "SELECT * FROM sinais_vitais WHERE paciente_id = ? ORDER BY data_registro DESC";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, pacienteId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    SinaisVitais sinais = new SinaisVitais(
                        rs.getInt("paciente_id"),
                        rs.getInt("frequencia_cardiaca"),
                        rs.getInt("pressao_sistolica"),
                        rs.getInt("pressao_diastolica"),
                        rs.getInt("frequencia_respiratoria"),
                        rs.getDouble("temperatura"),
                        rs.getInt("saturacao_oxigenio"),
                        rs.getString("nivel_consciencia")
                    );
                    sinais.setId(rs.getInt("id"));
                    sinais.setDataRegistro(rs.getTimestamp("data_registro").toLocalDateTime());
                    sinais.setUsuarioId(rs.getInt("usuario_id"));
                    
                    historico.add(sinais);
                }
            }
        }
        
        return historico;
    }
}