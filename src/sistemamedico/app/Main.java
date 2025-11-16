package sistemamedico.app;

import sistemamedico.gt.TriagemService;
import sistemamedico.dp.SinaisVitais;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        TriagemService triagemService = new TriagemService();
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("🏥 SISTEMA DE TRIAGEM MÉDICA");
        System.out.println("=============================");
        
        while (true) {
            System.out.println("\n1. Registrar Sinais Vitais");
            System.out.println("2. Listar Pacientes Críticos");
            System.out.println("3. Sair");
            System.out.print("Escolha uma opção: ");
            
            int opcao = scanner.nextInt();
            scanner.nextLine(); // Limpar buffer
            
            switch (opcao) {
                case 1:
                    registrarSinaisVitais(triagemService, scanner);
                    break;
                case 2:
                    triagemService.listarPacientesCriticos();
                    break;
                case 3:
                    System.out.println("Saindo do sistema...");
                    return;
                default:
                    System.out.println("Opção inválida!");
            }
        }
    }
    
    private static void registrarSinaisVitais(TriagemService triagemService, Scanner scanner) {
        System.out.println("\n--- REGISTRO DE SINAS VITAIS ---");
        
        System.out.print("ID do Paciente: ");
        int pacienteId = scanner.nextInt();
        
        System.out.print("Frequência Cardíaca: ");
        int fc = scanner.nextInt();
        
        System.out.print("Pressão Sistólica: ");
        int ps = scanner.nextInt();
        
        System.out.print("Pressão Diastólica: ");
        int pd = scanner.nextInt();
        
        System.out.print("Frequência Respiratória: ");
        int fr = scanner.nextInt();
        
        System.out.print("Temperatura: ");
        double temp = scanner.nextDouble();
        
        System.out.print("Saturação de Oxigênio: ");
        int spo2 = scanner.nextInt();
        scanner.nextLine(); // Limpar buffer
        
        System.out.print("Nível de Consciência (Alert/Confused/etc): ");
        String consciencia = scanner.nextLine();
        
        System.out.print("ID do Usuário: ");
        int usuarioId = scanner.nextInt();
        
        SinaisVitais sinais = new SinaisVitais(pacienteId, fc, ps, pd, fr, temp, spo2, consciencia);
        sinais.setUsuarioId(usuarioId);
        
        boolean sucesso = triagemService.registrarSinaisVitais(sinais);
        
        if (sucesso) {
            System.out.println("✅ Sinais vitais registrados com sucesso!");
        } else {
            System.out.println("❌ Erro ao registrar sinais vitais!");
        }
    }
}