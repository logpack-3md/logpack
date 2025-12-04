'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Blocks/Home/header";
import { Mail, Phone, MapPin, ArrowRight, Loader2, LifeBuoy, FileQuestion } from "lucide-react";
import { Footer } from "@/components/Blocks/Home/footer";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { api } from '@/lib/api';

const SupportPage = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        phone: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('suporte/send', formData);

            if (response && response.error) {
                toast.error(response.message || 'Ocorreu um erro ao abrir o chamado.');
            } else {
                toast.success('Chamado aberto com sucesso! Nossa equipe técnica responderá em breve.');
                setFormData({ name: '', email: '', phone: '', title: '', message: '' });
            }
        } catch (error) {
            toast.error('Falha ao conectar com a central de suporte. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-8 lg:py-10 lg:px-10">

                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <LifeBuoy className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                        Central de Suporte
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
                        Precisa de ajuda com nosso sistema? Abra um chamado abaixo detalhando seu problema ou dúvida técnica. Nossa equipe de especialistas está pronta para resolver sua solicitação.
                    </p>
                </div>


                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">

                    <div className="bg-slate-50 dark:bg-card border border-[#0101017c] rounded-2xl p-8 lg:p-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <FileQuestion className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Abrir novo chamado</h2>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} required className="border border-[#0101017c]" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                    <Input id="phone" placeholder="(00) 00000-0000" type="tel" value={formData.phone} onChange={handleChange} className="border border-[#0101017c]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail de Cadastro</Label>
                                <Input id="email" placeholder="seuemail@cliente.com" type="email" value={formData.email} onChange={handleChange} required className="border border-[#0101017c]" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Titulo</Label>
                                <Input id="title" placeholder="Ex: Erro ao fazer login, Dúvida sobre fatura..." type="text" value={formData.title} onChange={handleChange} required className="border border-[#0101017c]" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Descrição do Problema</Label>
                                <Textarea id="message" placeholder="Descreva detalhadamente o que está acontecendo para agilizarmos seu atendimento..." value={formData.message} onChange={handleChange} required minLength={10} className="min-h-[150px] border border-[#0101017c]" />
                            </div>

                            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        Enviar Solicitação
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col justify-center gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-center lg:text-left mb-2">
                                Outros canais de atendimento
                            </h3>
                            <p className="text-muted-foreground text-center lg:text-left">
                                Caso seja uma emergência ou prefira falar diretamente com um atendente.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* E-mail de Suporte */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">E-mail Técnico</h4>
                                    <p className="text-muted-foreground">
                                        Envie logs ou prints de erros diretamente.
                                    </p>
                                    <a href="mailto:suporte@seusistema.com" className="text-primary hover:underline">
                                        suporte@seusistema.com
                                    </a>
                                </div>
                            </div>

                            {/* Telefone / Help Desk */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Central Telefônica</h4>
                                    <p className="text-muted-foreground">
                                        Segunda a Sexta, das 08h às 18h.
                                    </p>
                                    <a href="tel:+5511988804869" className="text-primary hover:underline">
                                        +55 (11) 98880-4869
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Endereço Administrativo</h4>
                                    <p className="text-muted-foreground">
                                        Rua Exemplo, 123, Sala de TI <br />
                                        São Paulo, SP - 00000-000
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="bg-muted/50 p-6 rounded-xl mt-4">
                            <h4 className="font-semibold mb-2">Dica Útil:</h4>
                            <p className="text-sm text-muted-foreground">
                                Ao abrir um chamado, descreva o problema passo a passo e caso tenha imagens do problema entre em contato pelo email LogPack@gmail.com e envie prints da tela. Quanto mais detalhes você fornecer, mais rápido conseguimos resolver seu atendimento.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
            <Separator />
            <Footer />
            <Toaster richColors position="top-center" />
        </>
    );
};

export default SupportPage;