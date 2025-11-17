'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Blocks/Home/header";
import { Mail, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Footer } from "@/components/Blocks/Home/footer";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner"; // Importar o toast
import { api } from '@/lib/api'; // Importar o client da API

const Contact = () => {
    // Estados para os campos do formulário e para o carregamento
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Função para atualizar o estado do formulário
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página
        setIsLoading(true);

        try {
            // Usa o client da API para fazer a requisição
            const response = await api.post('contato/send', formData);

            if (response && response.error) {
                // Se a API retornar um erro, exibe no toast
                toast.error(response.message || 'Ocorreu um erro ao enviar a mensagem.');
            } else {
                // Se for sucesso, exibe mensagem e limpa o formulário
                toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                setFormData({ name: '', title: '', email: '', phone: '', message: '' });
            }
        } catch (error) {
            // Erro de rede ou outro erro inesperado
            toast.error('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            < Header />

            <main className="container mx-auto px-4 py-8 lg:py-5 lg:px-10">
                {/* Cabeçalho da Seção */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                        Entre em Contato
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
                        Tem alguma dúvida ou quer ver nossa tecnologia em ação? Preencha o formulário abaixo ou utilize um de nossos canais de atendimento. Nossa equipe está pronta para ajudar, caso esteja com dúvida sobre os preços basta entrar em contato.
                    </p>
                </div>

                {/* Formulário + Informações de Contato */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">

                    {/* Coluna do Formulário */}
                    <div className="bg-slate-50 dark:bg-card border border-[#0101017c] rounded-2xl p-8 lg:p-10 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>

                        {/* Formulário agora usa o estado e o handleSubmit */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="title">Motivo do contato</Label>
                                <Input id="title" placeholder="Quero o Logpack na minha empresa" type="text" value={formData.title} onChange={handleChange} required className={"border border-[#0101017c]"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" placeholder="Seu nome completo" type="text" value={formData.name} onChange={handleChange} required className={"border border-[#0101017c]"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input id="email" placeholder="seuemail@email.com" type="email" value={formData.email} onChange={handleChange} required className={"border border-[#0101017c]"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone (Opcional)</Label>
                                <Input id="phone" placeholder="(00) 00000-0000" type="tel" value={formData.phone} onChange={handleChange} className={"border border-[#0101017c]"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Mensagem</Label>
                                <Textarea id="message" placeholder="Digite sua dúvida ou solicitação aqui..." value={formData.message} onChange={handleChange} required minLength={10} className="min-h-[120px] border border-[#0101017c]" />
                            </div>

                            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Enviar Mensagem
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Coluna de Informações de Contato */}
                    <div className="flex flex-col justify-center gap-8">
                        <h3 className="text-2xl font-bold text-center lg:text-left">
                            Ou fale conosco diretamente
                        </h3>
                        <div className="space-y-6">
                            {/* E-mail */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">E-mail</h4>
                                    <p className="text-muted-foreground">
                                        Entre em contato para suporte.
                                    </p>
                                    <a href="mailto:sajuan1020@gmail.com" className="text-primary hover:underline">
                                        sajuan1020@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Telefone</h4>
                                    <p className="text-muted-foreground">
                                        Disponível em horário comercial.
                                    </p>
                                    <a href="tel:+5511988804869" className="text-primary hover:underline">
                                        +55 (11) 98880-4869
                                    </a>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Nosso Escritório</h4>
                                    <p className="text-muted-foreground">
                                        Não sei, 123, Sala 1 <br />
                                        São Paulo, SP - 00000-000
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Separator />
            <Footer />
        </>
    );
};

export default Contact;