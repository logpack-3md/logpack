import User from "../models/User.js";
import UserLog from "../models/UserLog.js";
import validarCpf from "validar-cpf";
import z from "zod";
import { put } from "@vercel/blob";

class UserController {
    static createSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }),
        cpf: z.string().refine(validarCpf, { error: "CPF inválido. Verifique o formato ou os dígitos verificadores." }),
        email: z.email({ error: "Digite um email válido." }),
        password: z.string().min(6, { error: "A senha deve conter no mínimo 6 caracteres." }),
        confirmPassword: z.string(),
        role: z.enum(['employee', 'admin', 'buyer', 'manager'], { error: "A função é obrigatória." })
    }).superRefine((data, ctx) => {
        if (data.password) {
            if (!data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "A confirmação de senha é obrigatória ao alterar a senha.",
                    path: ['confirmPassword'],
                });
                return;
            }

            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "As senhas não coincidem.",
                    path: ['confirmPassword'],
                });
            }
        }
    });

    static updateSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }).optional(),
        email: z.string().email({ message: "Digite um email válido." }).optional(),
        password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." }).optional(),
        confirmPassword: z.string().optional(),
    }).partial().superRefine((data, ctx) => {
        if (data.password) {
            if (!data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "A confirmação de senha é obrigatória ao alterar a senha.",
                    path: ['confirmPassword'],
                });
                return;
            }

            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "As senhas não coincidem.",
                    path: ['confirmPassword'],
                });
            }
        }
    });

    static async createUser(req, res) {
        const file = req.file;
        let imageUrl = null;

        try {
            const validatedSchema = UserController.createSchema.parse(req.body);
            const { ...userData } = validatedSchema

            if (file) {
                const filename = `${Date.now()}_${file.originalname}`

                const blob = await put(
                    filename,
                    file.buffer,
                    {
                        access: 'public',
                        contentType: file.mimetype,
                    }
                )

                imageUrl = blob.url
            }

            const user = await User.create({
                ...userData,
                image: imageUrl
            });

            await UserLog.create({
                userId: user.id,
                contextDetails: "Cadastro de novo usuário.",
                actionType: 'INSERT',
                oldData: null,
                newData: user.toJSON()
            })

            return res.status(201).json(user);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                })
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = Object.keys(error.fields)

                let message = "O registro já existe. "

                if (fields.includes('email')) {
                    message += "O Email já está cadastrado. "
                }

                if (fields.includes('cpf')) {
                    message += "O CPF já está cadastrado. "
                }

                return res.status(409).json({ message: message.trim(), fields: fields })
            }

            console.error("Erro ao criar usuário", error);
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }

    static async updateUser(req, res) {
        const file = req.file
        let imageUrl = null
        const userId = req.user.id

        try {
            const oldDataJson = await User.findByPk(userId)
            if (!oldDataJson) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            const oldImageUrl = oldDataJson.image;

            const validatedUpdate = UserController.updateSchema.parse(req.body)
            let updateData = { ...validatedUpdate }

            if (file) {
                const filename = `${Date.now()}_${file.originalname}`

                const blob = await put(
                    filename,
                    file.buffer,
                    {
                        access: 'public',
                        contentType: file.mimetype,
                    }
                )

                imageUrl = blob.url
                updateData.image = imageUrl

                if (oldImageUrl) {
                    try {
                        await del(oldImageUrl);
                        console.log(`Imagem de perfil antiga excluída do Blob: ${oldImageUrl}`);
                    } catch (error) {
                        console.error(`Falha ao excluir imagem de perfil antiga do Blob (${oldImageUrl}):`, error);
                    }
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(200).json({ message: "Nenhum dado válido fornecido para atualização." })
            }

            const [rowsAffected] = await User.update(updateData, {
                where: { id: userId }
            })

            if (rowsAffected === 0) {
                return res.status(200).json({ message: "Nenhuma alteração detectada. Usuário permanece o mesmo." })
            }

            const newDataJson = await User.findByPk(userId)

            await UserLog.create({
                userId: userId,
                contextDetails: "Atualização de dados de usuário e/ou imagem de perfil.",
                actionType: 'UPDATE',
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

            return res.status(200).json({
                message: "Usuário atualizado com sucesso.",
                user: newDataJson
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos.",
                    issues: error.issues
                })
            }
            console.error("Erro ao atualizar usuário", error);
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }

    static async seeProfile(req, res) {
        const userId = req.user.id

        try {
            const user = await User.findByPk(userId, {
                attributes: [
                    'name',
                    'email',
                    'role',
                    'image'
                ]
            })

            if (!user) {
                return res.status(404).json({ message: "Perfil não encontrado" })
            }

            return res.status(200).json(user)
        } catch (error) {
            console.error("Erro interno ao ver perfil", error)
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao buscar informações de perfil" })
        }
    }
}

export default UserController;