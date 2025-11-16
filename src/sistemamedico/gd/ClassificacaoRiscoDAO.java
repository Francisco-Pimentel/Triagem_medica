package sistemamedico.gd;

import sistemamedico.dp.ClassificacaoRisco;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ClassificacaoRiscoDAO {
    private Connection connection;
    
    public ClassificacaoRiscoDAO() {
        this.connection = DatabaseConfig.getConnection();
    }
    
    public boolean inserir(ClassificacaoRisco classificacao) throws SQLException {
        String sql = "INSERT INTO classificacao_risco (paciente_id, escore, nivel_risco, usuario_id, justificativa) VALUES (?, ?, ?, ?, ?)";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, classificacao.getPacienteId());
            stmt.setInt(2, classificacao.getEscore());
            stmt.setString(3, classificacao.getNivelRisco().name());
            stmt.setInt(4, classificacao.getUsuarioId());
            stmt.setString(5, classificacao.getJustificativa());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        classificacao.setId(generatedKeys.getInt(1));
                    }
                }
            }
            
            return affectedRows > 0;
        }
    }
    
    public List<ClassificacaoRisco> buscarClassificacoesCriticas() throws SQLException {
        List<ClassificacaoRisco> classificacoes = new ArrayList<>();
        String sql = "SELECT * FROM classificacao_risco WHERE nivel_risco = 'CRITICO' ORDER BY data_classificacao DESC";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                ClassificacaoRisco classificacao = new ClassificacaoRisco(
                    rs.getInt("paciente_id"),
                    rs.getInt("escore"),
                    ClassificacaoRisco.NivelRisco.valueOf(rs.getString("nivel_risco"))
                );
                classificacao.setId(rs.getInt("id"));
                classificacao.setDataClassificacao(rs.getTimestamp("data_classificacao").toLocalDateTime());
                classificacao.setUsuarioId(rs.getInt("usuario_id"));
                classificacao.setJustificativa(rs.getString("justificativa"));
                
                classificacoes.add(classificacao);
            }
        }
        
        return classificacoes;
    }
    
    public ClassificacaoRisco buscarUltimaClassificacao(int pacienteId) throws SQLException {
        String sql = "SELECT * FROM classificacao_risco WHERE paciente_id = ? ORDER BY data_classificacao DESC LIMIT 1";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, pacienteId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ClassificacaoRisco classificacao = new ClassificacaoRisco(
                        rs.getInt("paciente_id"),
                        rs.getInt("escore"),
                        ClassificacaoRisco.NivelRisco.valueOf(rs.getString("nivel_risco"))
                    );
                    classificacao.setId(rs.getInt("id"));
                    classificacao.setDataClassificacao(rs.getTimestamp("data_classificacao").toLocalDateTime());
                    classificacao.setUsuarioId(rs.getInt("usuario_id"));
                    classificacao.setJustificativa(rs.getString("justificativa"));
                    
                    return classificacao;
                }
            }
        }
        
        return null;
    }
    
    public List<ClassificacaoRisco> listarClassificacoesAtivas() throws SQLException {
        List<ClassificacaoRisco> classificacoes = new ArrayList<>();
        String sql = "SELECT * FROM classificacao_risco WHERE data_classificacao >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY data_classificacao DESC";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                ClassificacaoRisco classificacao = new ClassificacaoRisco(
                    rs.getInt("paciente_id"),
                    rs.getInt("escore"),
                    ClassificacaoRisco.NivelRisco.valueOf(rs.getString("nivel_risco"))
                );
                classificacao.setId(rs.getInt("id"));
                classificacao.setDataClassificacao(rs.getTimestamp("data_classificacao").toLocalDateTime());
                classificacao.setUsuarioId(rs.getInt("usuario_id"));
                classificacao.setJustificativa(rs.getString("justificativa"));
                
                classificacoes.add(classificacao);
            }
        }
        
        return classificacoes;
    }
}