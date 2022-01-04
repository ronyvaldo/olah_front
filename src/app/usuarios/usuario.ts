import { GrupoCongregacional } from "../grupos-congregacionais/grupoCongregacional";
import { Igreja } from "../igrejas/igreja";

export class Usuario {
    
    id: number;
    login: string;
    senha: string;
    perfil: number;
    descricaoPerfil: string;
    email: string;
    nome: string;
    cpf: string;
    dddCelular: string;
    numeroCelular: string;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    dataInativacao: string;
    dataNascimento: string;
    igrejas: Igreja[];
    grupoCongregacional: GrupoCongregacional;
}